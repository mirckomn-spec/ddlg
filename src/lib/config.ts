/** Contador de visualizações começa neste número e sobe a partir daqui */
export const siteViewCountBase = 554;

export const musicPlayer = {
  src: "/music/dj-transtorno-mental.mp3",
  title: "OUTSIDE - DJ TRANSTORNO MENTAL",
  artist: "",
  cover: "https://i.imgur.com/GJf0QYj.png",
  statusLabel: "tocando agora",
} as const;

export const backgroundVideo = {
  src: "/bg-wave.mp4",
  fallbackSrc: "/ABSTRATO.mp4",
} as const;

export const sideDecorations = {
  left: {
    src: "https://i.imgur.com/SEtxAFp.png",
    alt: "Decoração lateral esquerda",
  },
  right: {
    src: "https://i.ibb.co/fVNCYMQk/6uu65u56u565u6-Photoroom.png",
    alt: "Decoração lateral direita — boneca",
  },
  rightBelow: {
    src: "https://i.imgur.com/1s27jNk.png",
    alt: "Decoração lateral direita — banco",
  },
} as const;

export type SocialPlatform = "instagram" | "twitter" | "tiktok" | "whatsapp";

export type SocialLink = {
  platform: SocialPlatform;
  url: string;
  label: string;
};

export type UserProfile = {
  id: string;
  name: string;
  discordId: string;
  robloxId?: number;
  links: SocialLink[];
};

export const users: UserProfile[] = [
  {
    id: "neat",
    name: "neat",
    discordId: "1197773679233339434",
    robloxId: 1664934,
    links: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/robux28",
        label: "Instagram",
      },
    ],
  },
  {
    id: "muliro",
    name: "muliro",
    discordId: "1502474217030160525",
    robloxId: 7289259995,
    links: [
      {
        platform: "whatsapp",
        url: "https://wa.me/5511920901579",
        label: "WhatsApp",
      },
    ],
  },
  {
    id: "naltic",
    name: "naltic",
    discordId: "1508559016140472505",
    robloxId: 3431688822,
    links: [
      {
        platform: "instagram",
        url: "https://www.instagram.com/333naltic",
        label: "Instagram",
      },
      {
        platform: "tiktok",
        url: "https://www.tiktok.com/@nnaltic",
        label: "TikTok",
      },
      {
        platform: "twitter",
        url: "https://x.com/nnaltic",
        label: "Twitter",
      },
    ],
  },
];
