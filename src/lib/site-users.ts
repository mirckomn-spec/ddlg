import { users, type UserProfile } from "@/lib/config";

const byId = new Map(users.map((u) => [u.id, u]));

export function isAllowedProfileId(id: string): boolean {
  return byId.has(id);
}

export function getProfileById(id: string): UserProfile | null {
  return byId.get(id) ?? null;
}
