"use client";

import { backgroundVideo } from "@/lib/config";
import { useCallback, useEffect, useRef, useState } from "react";

type VideoBackgroundProps = {
  src: string;
  fallbackSrc?: string;
};

export default function VideoBackground({
  src,
  fallbackSrc = backgroundVideo.fallbackSrc,
}: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [activeSrc, setActiveSrc] = useState(src);
  const triedFallbackRef = useRef(false);

  const tryPlay = useCallback((video: HTMLVideoElement) => {
    video.muted = true;
    video.defaultMuted = true;
    video.loop = true;
    video.playsInline = true;

    const play = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
      play();
      return;
    }

    video.addEventListener("canplay", play, { once: true });
  }, []);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    const onEnded = () => {
      video.currentTime = 0;
      void video.play().catch(() => {});
    };

    const onStalled = () => {
      if (!video.paused && !video.ended) return;
      void video.play().catch(() => {});
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible") {
        tryPlay(video);
      }
    };

    const onSiteEnter = () => tryPlay(video);

    const onError = () => {
      if (triedFallbackRef.current || !fallbackSrc || activeSrc === fallbackSrc) {
        return;
      }
      triedFallbackRef.current = true;
      setActiveSrc(fallbackSrc);
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("stalled", onStalled);
    video.addEventListener("error", onError);
    document.addEventListener("visibilitychange", onVisibility);
    window.addEventListener("ddlg-enter", onSiteEnter);

    tryPlay(video);

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("stalled", onStalled);
      video.removeEventListener("error", onError);
      document.removeEventListener("visibilitychange", onVisibility);
      window.removeEventListener("ddlg-enter", onSiteEnter);
    };
  }, [activeSrc, fallbackSrc, tryPlay]);

  useEffect(() => {
    setActiveSrc(src);
    triedFallbackRef.current = false;
  }, [src]);

  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        key={activeSrc}
        ref={videoRef}
        className="bg-video"
        src={activeSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="auto"
        disablePictureInPicture
      />
      <div className="bg-video-overlay" />
    </div>
  );
}
