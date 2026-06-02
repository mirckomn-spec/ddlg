"use client";

import { useEffect, useRef } from "react";
import { backgroundVideo } from "@/lib/config";

const videoSrc =
  process.env.NEXT_PUBLIC_BACKGROUND_VIDEO_URL?.trim() ||
  backgroundVideo.src;

export default function VideoBackground() {
  const videoRef = useRef<HTMLVideoElement>(null);

  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;

    video.muted = true;
    const play = () => {
      void video.play().catch(() => {});
    };

    if (video.readyState >= HTMLMediaElement.HAVE_METADATA) {
      play();
    } else {
      video.addEventListener("loadeddata", play, { once: true });
      return () => video.removeEventListener("loadeddata", play);
    }
  }, []);

  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        ref={videoRef}
        className="bg-video"
        src={videoSrc}
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
