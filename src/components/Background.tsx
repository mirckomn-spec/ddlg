import { backgroundVideo } from "@/lib/config";
import VideoBackground from "./VideoBackground";

const videoSrc =
  process.env.BACKGROUND_VIDEO_URL?.trim() || backgroundVideo.src;

export default function Background() {
  return (
    <>
      <VideoBackground
        src={videoSrc}
        fallbackSrc={backgroundVideo.fallbackSrc}
      />
      <div className="bg-vignette" aria-hidden="true" />
    </>
  );
}
