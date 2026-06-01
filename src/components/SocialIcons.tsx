import type { SocialPlatform } from "@/lib/config";

type IconProps = {
  gradientId?: string;
};

export function InstagramIcon({ gradientId = "ig-gradient" }: IconProps) {
  return (
    <svg viewBox="0 0 24 24" fill="none" aria-hidden="true">
      <defs>
        <linearGradient id={gradientId} x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#f09433" />
          <stop offset="25%" stopColor="#e6683c" />
          <stop offset="50%" stopColor="#dc2743" />
          <stop offset="75%" stopColor="#cc2366" />
          <stop offset="100%" stopColor="#bc1888" />
        </linearGradient>
      </defs>
      <rect
        x="2"
        y="2"
        width="20"
        height="20"
        rx="5"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
      <circle
        cx="12"
        cy="12"
        r="4.25"
        stroke={`url(#${gradientId})`}
        strokeWidth="2"
      />
      <circle cx="17.2" cy="6.8" r="1.1" fill={`url(#${gradientId})`} />
    </svg>
  );
}

export function TwitterIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z" />
    </svg>
  );
}

export function TikTokIcon() {
  return (
    <svg viewBox="0 0 24 24" fill="currentColor" aria-hidden="true">
      <path d="M19.59 6.69a4.83 4.83 0 0 1-3.77-4.25V2h-3.45v13.67a2.89 2.89 0 0 1-2.88 2.5 2.89 2.89 0 0 1-2.89-2.89 2.89 2.89 0 0 1 2.89-2.89c.28 0 .54.04.79.1V9.01a6.33 6.33 0 0 0-.79-.05 6.34 6.34 0 0 0-6.34 6.34 6.34 6.34 0 0 0 6.34 6.34 6.34 6.34 0 0 0 6.33-6.34V8.69a8.18 8.18 0 0 0 4.77 1.52V6.76a4.85 4.85 0 0 1-1-.07z" />
    </svg>
  );
}

export function SocialIcon({
  platform,
  gradientId,
}: {
  platform: SocialPlatform;
  gradientId?: string;
}) {
  switch (platform) {
    case "instagram":
      return <InstagramIcon gradientId={gradientId} />;
    case "twitter":
      return <TwitterIcon />;
    case "tiktok":
      return <TikTokIcon />;
  }
}
