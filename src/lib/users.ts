import { users, type UserProfile } from "./config";
import { fetchDiscordAvatarUrl } from "./discord";
import { fetchRobloxProfile, type RobloxProfile } from "./roblox";

export type PublicUser = {
  id: string;
  name: string;
  discordAvatarUrl: string;
  links: UserProfile["links"];
  roblox: RobloxProfile | null;
};

export async function fetchEnrichedUsers(): Promise<PublicUser[]> {
  return Promise.all(
    users.map(async (user) => {
      const [discordResult, roblox] = await Promise.all([
        fetchDiscordAvatarUrl(user.discordId, true),
        user.robloxId ? fetchRobloxProfile(user.robloxId) : Promise.resolve(null),
      ]);

      return {
        id: user.id,
        name: user.name,
        discordAvatarUrl: discordResult.avatarUrl,
        links: user.links,
        roblox,
      };
    }),
  );
}
