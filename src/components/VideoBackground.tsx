"use client";

import { useEffect, useRef } from "react";

type VideoBackgroundProps = {
  src: string;
};

export default function VideoBackground({ src }: VideoBackgroundProps) {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    video.loop = true;

    const restart = () => {
      if (video.currentTime > 0.05) {
        video.currentTime = 0;
      }
      void video.play().catch(() => {});
    };

    const onEnded = () => restart();

    const onStalled = () => {
      if (video.paused && !video.ended) {
        void video.play().catch(() => {});
      }
    };

    const onVisibility = () => {
      if (document.visibilityState === "visible" && video.paused) {
        void video.play().catch(() => {});
      }
    };

    const play = () => {
      void video.play().catch(() => {});
    };

    video.addEventListener("ended", onEnded);
    video.addEventListener("stalled", onStalled);
    document.addEventListener("visibilitychange", onVisibility);

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      play();
    } else {
      video.addEventListener("loadeddata", play, { once: true });
    }

    return () => {
      video.removeEventListener("ended", onEnded);
      video.removeEventListener("stalled", onStalled);
      document.removeEventListener("visibilitychange", onVisibility);
      video.removeEventListener("loadeddata", play);
    };
  }, [src]);

  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        key={src}
        ref={videoRef}
        className="bg-video"
        src={src}
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
