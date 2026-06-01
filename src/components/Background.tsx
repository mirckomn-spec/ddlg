import VideoBackground from "./VideoBackground";

export default function Background() {
  return (
    <>
      <VideoBackground />
      <div className="bg-vignette" aria-hidden="true" />
    </>
  );
}
