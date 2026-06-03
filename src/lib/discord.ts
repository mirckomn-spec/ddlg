const DISCORD_API = "https://discord.com/api/v10";

export type DiscordUser = {
  id: string;
  avatar: string | null;
  global_name?: string | null;
  username?: string;
};

function defaultAvatarUrl(userId: string): string {
  const id = BigInt(userId);
  const index = Number((id >> BigInt(22)) % BigInt(6));
  return `https://cdn.discordapp.com/embed/avatars/${index}.png`;
}

export function buildDiscordAvatarUrl(
  userId: string,
  avatarHash: string | null,
): string {
  if (!avatarHash) {
    return defaultAvatarUrl(userId);
  }

  const extension = avatarHash.startsWith("a_") ? "gif" : "png";
  return `https://cdn.discordapp.com/avatars/${userId}/${avatarHash}.${extension}?size=512`;
}

export function getDiscordBotToken(): string | undefined {
  return process.env.DISCORD_BOT_TOKEN?.trim() || undefined;
}

export async function fetchDiscordUser(
  userId: string,
  noCache = false,
): Promise<DiscordUser | null> {
  const token = getDiscordBotToken();

  if (!token) {
    return null;
  }

  try {
    const response = await fetch(`${DISCORD_API}/users/${userId}`, {
      headers: {
        Authorization: `Bot ${token}`,
        Accept: "application/json",
      },
      ...(noCache
        ? { cache: "no-store" as const }
        : { next: { revalidate: 60 } }),
    });

    if (!response.ok) {
      if (process.env.NODE_ENV === "development") {
        console.warn(`[discord] Falha ao buscar usuário (${response.status})`);
      }
      return null;
    }

    return (await response.json()) as DiscordUser;
  } catch {
    return null;
  }
}

export async function fetchDiscordAvatarUrl(
  userId: string,
  noCache = false,
): Promise<{ avatarUrl: string; fromApi: boolean }> {
  const user = await fetchDiscordUser(userId, noCache);

  if (!user) {
    return {
      avatarUrl: defaultAvatarUrl(userId),
      fromApi: false,
    };
  }

  return {
    avatarUrl: buildDiscordAvatarUrl(user.id, user.avatar),
    fromApi: true,
  };
}
