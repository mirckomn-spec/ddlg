"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { refreshAvatar } from "@/app/actions/discord";

const POLL_INTERVAL_MS = 30_000;

type DiscordAvatarProps = {
  userId: string;
  name: string;
  initialUrl: string;
};

function normalizeAvatarUrl(url: string): string {
  try {
    const parsed = new URL(url);
    return `${parsed.origin}${parsed.pathname}`;
  } catch {
    return url.split("?")[0];
  }
}

export default function DiscordAvatar({
  userId,
  name,
  initialUrl,
}: DiscordAvatarProps) {
  const [avatarUrl, setAvatarUrl] = useState(initialUrl);
  const lastKnownRef = useRef(normalizeAvatarUrl(initialUrl));

  const refresh = useCallback(async () => {
    try {
      const data = await refreshAvatar(userId);
      if (!data?.url) return;

      const normalized = normalizeAvatarUrl(data.url);
      if (normalized === lastKnownRef.current) return;

      lastKnownRef.current = normalized;
      setAvatarUrl(data.url);
    } catch {
      /* mantém imagem atual */
    }
  }, [userId]);

  useEffect(() => {
    refresh();

    const interval = setInterval(refresh, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  return (
    // eslint-disable-next-line @next/next/no-img-element
    <img
      src={avatarUrl}
      alt={`Foto de perfil de ${name}`}
      width={120}
      height={120}
      className="profile-avatar"
      decoding="async"
      loading="eager"
    />
  );
}
