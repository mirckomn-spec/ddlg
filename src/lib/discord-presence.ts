import { users } from "@/lib/config";
import { getDiscordBotToken } from "@/lib/discord";
import {
  ActivityType,
  Client,
  Events,
  GatewayIntentBits,
  type Activity,
  type Guild,
  type Presence,
} from "discord.js";

export type PresenceActivity = {
  kind: "playing" | "competing" | "streaming" | "listening" | "watching";
  text: string;
  iconUrl: string | null;
};

export type UserPresenceDisplay = {
  status: "online" | "idle" | "dnd" | "offline" | "invisible";
  activity: PresenceActivity | null;
};

const TRACKED_IDS = users.map((u) => u.discordId);

/** Servidor DDLG (fallback se .env não tiver DISCORD_GUILD_ID) */
const DEFAULT_GUILD_ID = "1509710347806965842";

const ACTIVITY_PRIORITY: ActivityType[] = [
  ActivityType.Playing,
  ActivityType.Competing,
  ActivityType.Streaming,
  ActivityType.Listening,
  ActivityType.Watching,
];

const presenceCache = new Map<string, UserPresenceDisplay>();

let botClient: Client | null = null;
let botReady = false;
let botStarting: Promise<void> | null = null;
let activeGuildId: string | null = null;

declare global {
  // eslint-disable-next-line no-var
  var __discordPresenceBot: Client | undefined;
}

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

export function getGuildId(): string {
  return (
    process.env.DISCORD_GUILD_ID?.trim() ||
    process.env.GUILD_ID?.trim() ||
    DEFAULT_GUILD_ID
  );
}

const SPOTIFY_ICON =
  "https://storage.googleapis.com/pr-newsroom-wp/1/2023/05/Spotify_Primary_Logo_RGB_Green.png";

function isSpotifyActivity(activity: Activity): boolean {
  return (
    activity.name === "Spotify" ||
    activity.applicationId === "spotify:1" ||
    activity.syncId != null
  );
}

function getActivityIconUrl(activity: Activity): string | null {
  const assets = activity.assets;

  if (assets) {
    const large = assets.largeImageURL({ size: 128 });
    if (large) return large;

    const small = assets.smallImageURL({ size: 128 });
    if (small) return small;
  }

  if (isSpotifyActivity(activity)) {
    return SPOTIFY_ICON;
  }

  return null;
}

function formatActivity(activity: Activity): PresenceActivity {
  const iconUrl = getActivityIconUrl(activity);

  switch (activity.type) {
    case ActivityType.Playing:
      return { kind: "playing", text: `Jogando ${activity.name}`, iconUrl };
    case ActivityType.Competing:
      return {
        kind: "competing",
        text: `Competindo em ${activity.name}`,
        iconUrl,
      };
    case ActivityType.Streaming:
      return {
        kind: "streaming",
        text: activity.details
          ? `Transmitindo ${activity.details}`
          : `Transmitindo ${activity.name}`,
        iconUrl,
      };
    case ActivityType.Listening:
      if (isSpotifyActivity(activity) && activity.details && activity.state) {
        return {
          kind: "listening",
          text: `Ouvindo ${activity.details} — ${activity.state}`,
          iconUrl: iconUrl ?? SPOTIFY_ICON,
        };
      }
      return {
        kind: "listening",
        text: activity.details
          ? `Ouvindo ${activity.details}`
          : `Ouvindo ${activity.name}`,
        iconUrl: iconUrl ?? (isSpotifyActivity(activity) ? SPOTIFY_ICON : null),
      };
    case ActivityType.Watching:
      return { kind: "watching", text: `Assistindo ${activity.name}`, iconUrl };
    default:
      return { kind: "playing", text: activity.name, iconUrl };
  }
}

function pickActivity(
  presence: Presence | null | undefined,
): PresenceActivity | null {
  if (!presence) return null;

  const activities = presence.activities.filter(
    (a) => a.type !== ActivityType.Custom,
  );

  if (activities.length === 0) return null;

  for (const type of ACTIVITY_PRIORITY) {
    const match = activities.find((a) => a.type === type);
    if (match) return formatActivity(match);
  }

  return formatActivity(activities[0]);
}

function presenceFromUpdate(presence: Presence): UserPresenceDisplay {
  return {
    status: (presence.status ?? "offline") as UserPresenceDisplay["status"],
    activity: pickActivity(presence),
  };
}

function setCachedPresence(userId: string, data: UserPresenceDisplay): void {
  presenceCache.set(userId, data);
}

export function getUserPresence(userId: string): UserPresenceDisplay | null {
  return presenceCache.get(userId) ?? null;
}

export function isPresenceBotReady(): boolean {
  return botReady && Boolean(activeGuildId) && Boolean(botClient?.isReady());
}

function getActiveGuild(): Guild | null {
  if (!botClient?.isReady() || !activeGuildId) return null;
  return botClient.guilds.cache.get(activeGuildId) ?? null;
}

/** Lê presenças do Gateway (sem pedir lista de membros) */
function syncFromPresenceCache(guild: Guild): void {
  for (const discordId of TRACKED_IDS) {
    const presence = guild.presences.cache.get(discordId);
    if (presence) {
      setCachedPresence(discordId, presenceFromUpdate(presence));
    }
  }
}

function readLivePresence(userId: string): UserPresenceDisplay | null {
  const guild = getActiveGuild();
  if (!guild) return null;

  const presence = guild.presences.cache.get(userId);
  if (!presence) return null;

  const data = presenceFromUpdate(presence);
  setCachedPresence(userId, data);
  return data;
}

async function waitForBotReady(timeoutMs = 25_000): Promise<boolean> {
  const start = Date.now();
  while (Date.now() - start < timeoutMs) {
    if (botReady && botClient?.isReady()) return true;
    await sleep(250);
  }
  return false;
}

async function startBot(): Promise<void> {
  const token = getDiscordBotToken();
  if (!token) {
    console.warn("[discord-presence] DISCORD_BOT_TOKEN ausente.");
    return;
  }

  activeGuildId = getGuildId();

  if (global.__discordPresenceBot) {
    botClient = global.__discordPresenceBot;
    if (botClient.isReady()) {
      const guild = botClient.guilds.cache.get(activeGuildId);
      if (guild) syncFromPresenceCache(guild);
      botReady = true;
      return;
    }
    await new Promise<void>((resolve) => {
      botClient!.once(Events.ClientReady, () => resolve());
    });
    const guild = botClient.guilds.cache.get(activeGuildId);
    if (guild) syncFromPresenceCache(guild);
    botReady = true;
    return;
  }

  const client = new Client({
    intents: [
      GatewayIntentBits.Guilds,
      GatewayIntentBits.GuildPresences,
    ],
  });

  client.on("presenceUpdate", (_old, newPresence) => {
    if (!newPresence.guild || newPresence.guild.id !== activeGuildId) return;
    if (!TRACKED_IDS.includes(newPresence.userId)) return;

    setCachedPresence(newPresence.userId, presenceFromUpdate(newPresence));
  });

  client.once(Events.ClientReady, () => {
    const guild = client.guilds.cache.get(activeGuildId!);
    if (guild) {
      syncFromPresenceCache(guild);
      console.log(
        `[discord-presence] Bot online — servidor ${activeGuildId} (${guild.presences.cache.size} presenças no cache)`,
      );
    } else {
      console.warn(
        `[discord-presence] Bot online mas servidor ${activeGuildId} não encontrado. O bot está no servidor?`,
      );
    }
    botReady = true;
  });

  await client.login(token);

  global.__discordPresenceBot = client;
  botClient = client;
}

export async function ensureDiscordBot(): Promise<void> {
  if (botReady && botClient?.isReady()) return;

  if (!botStarting) {
    botStarting = startBot()
      .then(async () => {
        await waitForBotReady();
      })
      .catch((error) => {
        console.error("[discord-presence] Falha ao iniciar:", error);
        botStarting = null;
      });
  }

  await botStarting;
  await waitForBotReady();
}

export async function getPresenceForApi(
  userId: string,
): Promise<UserPresenceDisplay | null> {
  await ensureDiscordBot();

  const live = readLivePresence(userId);
  if (live?.activity) return live;

  const cached = getUserPresence(userId);
  if (cached?.activity) return cached;

  return live ?? cached;
}
