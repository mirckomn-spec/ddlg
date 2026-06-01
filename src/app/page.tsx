import Background from "@/components/Background";
import MusicPlayer from "@/components/MusicPlayer";
import ProfileCard from "@/components/ProfileCard";
import SideDecorations from "@/components/SideDecorations";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <Background />
      <SideDecorations />
      <ProfileCard />
      <MusicPlayer />
    </main>
  );
}
