import type { SocialLink } from "@/lib/config";
import { SocialIcon } from "./SocialIcons";

type SocialLinksProps = {
  links: SocialLink[];
  userId: string;
  userName: string;
};

export default function SocialLinks({ links, userId, userName }: SocialLinksProps) {
  if (links.length === 0) return null;

  return (
    <nav className="profile-links" aria-label={`Redes sociais de ${userName}`}>
      {links.map((link) => (
        <a
          key={`${userId}-${link.platform}`}
          href={link.url}
          target="_blank"
          rel="noopener noreferrer"
          className={`social-icon-btn social-icon-btn--${link.platform}`}
          data-cursor-hover
          aria-label={`${link.label} — ${userName}`}
        >
          <SocialIcon
            platform={link.platform}
            gradientId={
              link.platform === "instagram"
                ? `ig-gradient-${userId}`
                : undefined
            }
          />
        </a>
      ))}
    </nav>
  );
}
