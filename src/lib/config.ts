export const musicPlayer = {
  src: "/music/rockstar-made-playboi-carti.mp3",
  title: "Rockstar Made - Playboi Carti",
  artist: "",
  cover: "https://i.imgur.com/SM8qwCH.png",
  statusLabel: "tocando agora",
} as const;

export const backgroundVideo = {
  src: "/abstract-waves.mp4",
} as const;

export const sideDecorations = {
  left: {
    src: "https://i.imgur.com/SEtxAFp.png",
    alt: "Decoração lateral esquerda",
  },
  right: {
    src: "https://i.ibb.co/5h8LQSp0/Gemini-Generated-Image-rdlywtrdlywtrdly-Photoroom-1-Photoroom.png",
    alt: "Decoração lateral direita",
  },
} as const;

export type SocialPlatform = "instagram" | "twitter" | "tiktok";

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
        platform: "instagram",
        url: "https://www.instagram.com/sickboyx_x",
        label: "Instagram",
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
        url: "https://www.tiktok.com/@dienaltic",
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
