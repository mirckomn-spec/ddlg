"use client";

import { useCallback, useEffect, useRef, useState } from "react";

/** Verifica a cada 30s; só troca a imagem se o avatar no Discord mudou */
const POLL_INTERVAL_MS = 30_000;

type DiscordAvatarProps = {
  discordId: string;
  name: string;
  initialUrl: string;
};

type AvatarApiResponse = {
  avatarUrl: string;
  fromApi: boolean;
  error: string | null;
  fetchedAt: number;
};

/** URL canônica (sem cache-buster) para comparar se o ícone mudou */
function normalizeAvatarUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

export default function DiscordAvatar({
  discordId,
  name,
  initialUrl,
}: DiscordAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const lastKnownRef = useRef(normalizeAvatarUrl(initialUrl));

  const refreshAvatar = useCallback(async () => {
    try {
      const response = await fetch(`/api/discord/avatar/${discordId}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as AvatarApiResponse;

      if (!data.avatarUrl || !data.fromApi) return;

      const normalized = normalizeAvatarUrl(data.avatarUrl);

      if (normalized === lastKnownRef.current) return;

      lastKnownRef.current = normalized;
      setAvatarUrl(data.avatarUrl);
    } catch {
      /* mantém imagem atual */
    }
  }, [discordId]);

  useEffect(() => {
    refreshAvatar();

    const interval = setInterval(refreshAvatar, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refreshAvatar();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshAvatar]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl}
      alt={`Foto de perfil Discord de ${name}`}
      width={120}
      height={120}
      className="profile-avatar"
      decoding="async"
      loading="eager"
    />
  );
}
