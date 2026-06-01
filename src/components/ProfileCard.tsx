import { fetchEnrichedUsers } from "@/lib/users";
import UserCard from "./UserCard";

export const dynamic = "force-dynamic";

export default async function ProfileCard() {
  const enrichedUsers = await fetchEnrichedUsers();

  return (
    <div className="profile-wrapper animate-fade-in">
      <div className="profiles-grid">
        {enrichedUsers.map((user, index) => (
          <UserCard key={user.id} user={user} index={index} />
        ))}
      </div>
    </div>
  );
}
