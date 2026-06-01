import type { EnrichedUser } from "@/lib/users";
import DiscordActivity from "./DiscordActivity";
import DiscordAvatar from "./DiscordAvatar";
import RobloxAvatar from "./RobloxAvatar";
import SocialLinks from "./SocialLinks";

type UserCardProps = {
  user: EnrichedUser;
  index: number;
};

export default function UserCard({ user, index }: UserCardProps) {
  const delayClass =
    index === 0
      ? "animate-delay-1"
      : index === 1
        ? "animate-delay-2"
        : "animate-delay-3";

  return (
    <article className={`profile-card animate-fade-in-up ${delayClass}`}>
      <div className="profile-card-top">
        <DiscordActivity discordId={user.discordId} placement="header" />
        <div className="profile-avatar-wrap" data-cursor-hover>
          <div className="profile-avatar-ring" aria-hidden="true" />
          <DiscordAvatar
            discordId={user.discordId}
            name={user.name}
            initialUrl={user.discordAvatarUrl}
          />
        </div>
      </div>

      <h2 className="profile-name">{user.name}</h2>

      <SocialLinks links={user.links} userId={user.id} userName={user.name} />

      {user.roblox && <RobloxAvatar roblox={user.roblox} userName={user.name} />}
    </article>
  );
}
