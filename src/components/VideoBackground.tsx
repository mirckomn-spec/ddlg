import { backgroundVideo } from "@/lib/config";

const videoSrc =
  process.env.NEXT_PUBLIC_BACKGROUND_VIDEO_URL?.trim() ||
  backgroundVideo.src;

export default function VideoBackground() {
  return (
    <div className="bg-video-wrap" aria-hidden="true">
      <video
        className="bg-video"
        src={videoSrc}
        autoPlay
        loop
        muted
        playsInline
        preload="metadata"
        disablePictureInPicture
      />
      <div className="bg-video-overlay" />
    </div>
  );
}
