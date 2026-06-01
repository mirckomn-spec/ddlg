import { users, type UserProfile } from "./config";
import { fetchDiscordAvatarUrl } from "./discord";
import { fetchRobloxProfile, type RobloxProfile } from "./roblox";

export type EnrichedUser = UserProfile & {
  discordAvatarUrl: string;
  roblox: RobloxProfile | null;
};

export async function fetchEnrichedUsers(): Promise<EnrichedUser[]> {
  return Promise.all(
    users.map(async (user) => {
      const [discordResult, roblox] = await Promise.all([
        fetchDiscordAvatarUrl(user.discordId, true),
        user.robloxId ? fetchRobloxProfile(user.robloxId) : Promise.resolve(null),
      ]);

      return {
        ...user,
        discordAvatarUrl: discordResult.avatarUrl,
        roblox,
      };
    }),
  );
}
