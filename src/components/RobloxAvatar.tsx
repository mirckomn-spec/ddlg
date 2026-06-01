import Image from "next/image";
import type { RobloxProfile } from "@/lib/roblox";

type RobloxAvatarProps = {
  roblox: RobloxProfile;
  userName: string;
};

export default function RobloxAvatar({ roblox, userName }: RobloxAvatarProps) {
  return (
    <a
      href={roblox.profileUrl}
      target="_blank"
      rel="noopener noreferrer"
      className="roblox-skin"
      data-cursor-hover
      aria-label={`Perfil Roblox de ${userName} — ${roblox.displayName}`}
    >
      <Image
        src={roblox.avatarUrl}
        alt={`Skin Roblox de ${roblox.displayName}`}
        width={420}
        height={420}
        className="roblox-skin-img"
        unoptimized
      />
      <span className="roblox-skin-name">@{roblox.username}</span>
    </a>
  );
}
