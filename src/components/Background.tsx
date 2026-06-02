import VideoBackground from "./VideoBackground";

type BackgroundProps = {
  active?: boolean;
};

export default function Background({ active = false }: BackgroundProps) {
  return (
    <>
      {active ? <VideoBackground /> : <div className="bg-idle" aria-hidden="true" />}
      <div className="bg-vignette" aria-hidden="true" />
    </>
  );
}
