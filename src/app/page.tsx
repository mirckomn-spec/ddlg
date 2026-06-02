import HomeClient from "@/components/HomeClient";
import ProfileCard from "@/components/ProfileCard";

export const dynamic = "force-dynamic";

export default function Home() {
  return (
    <main>
      <HomeClient>
        <ProfileCard />
      </HomeClient>
    </main>
  );
}
