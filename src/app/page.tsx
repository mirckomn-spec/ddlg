import HomeClient from "@/components/HomeClient";
import ProfileCard from "@/components/ProfileCard";
import { getSiteViewCount } from "@/app/actions/site";

export const dynamic = "force-dynamic";

export default async function Home() {
  const viewCount = await getSiteViewCount();

  return (
    <main>
      <HomeClient initialViewCount={viewCount}>
        <ProfileCard />
      </HomeClient>
    </main>
  );
}
