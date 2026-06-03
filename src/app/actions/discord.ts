"use server";

import { fetchDiscordAvatarUrl } from "@/lib/discord";
import {
  ensureDiscordBot,
  getPresenceForApi,
  isPresenceBotReady,
} from "@/lib/discord-presence";
import { getProfileById, isAllowedProfileId } from "@/lib/site-users";

export type PresenceUpdate = {
  text: string;
  iconUrl: string | null;
  kind: string;
};

export async function refreshAvatar(
  userId: string,
): Promise<{ url: string } | null> {
  if (!isAllowedProfileId(userId)) return null;

  const profile = getProfileById(userId);
  if (!profile) return null;

  const result = await fetchDiscordAvatarUrl(profile.discordId, true);
  if (!result.fromApi || !result.avatarUrl) return null;

  return { url: result.avatarUrl };
}

export async function refreshPresence(
  userId: string,
): Promise<PresenceUpdate | null> {
  if (!isAllowedProfileId(userId)) return null;

  const profile = getProfileById(userId);
  if (!profile) return null;

  await ensureDiscordBot();

  if (!isPresenceBotReady()) return null;

  const presence = await getPresenceForApi(profile.discordId);
  const activity = presence?.activity;

  if (!activity?.text) return null;

  return {
    text: activity.text,
    iconUrl: activity.iconUrl ?? null,
    kind: activity.kind,
  };
}
