type RobloxUser = {
  id: number;
  name: string;
  displayName: string;
};

type ThumbnailEntry = {
  imageUrl: string;
  state: string;
};

type ThumbnailResponse = {
  data: ThumbnailEntry[];
};

export type RobloxProfile = {
  userId: number;
  username: string;
  displayName: string;
  avatarUrl: string;
  profileUrl: string;
};

export function buildRobloxProfileUrl(userId: number): string {
  return `https://www.roblox.com/users/${userId}/profile`;
}

export async function fetchRobloxProfile(
  userId: number,
): Promise<RobloxProfile | null> {
  try {
    const [userRes, thumbRes] = await Promise.all([
      fetch(`https://users.roblox.com/v1/users/${userId}`, {
        next: { revalidate: 3600 },
      }),
      fetch(
        `https://thumbnails.roblox.com/v1/users/avatar?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
        { next: { revalidate: 300 },
        },
      ),
    ]);

    if (!userRes.ok) {
      console.warn(`[roblox] Usuário ${userId} não encontrado.`);
      return null;
    }

    const user = (await userRes.json()) as RobloxUser;

    let avatarUrl = "";
    if (thumbRes.ok) {
      const thumbs = (await thumbRes.json()) as ThumbnailResponse;
      avatarUrl = thumbs.data?.[0]?.imageUrl ?? "";
    }

    if (!avatarUrl) {
      const fallback = await fetch(
        `https://thumbnails.roblox.com/v1/users/avatar-headshot?userIds=${userId}&size=420x420&format=Png&isCircular=false`,
        { next: { revalidate: 300 } },
      );
      if (fallback.ok) {
        const data = (await fallback.json()) as ThumbnailResponse;
        avatarUrl = data.data?.[0]?.imageUrl ?? "";
      }
    }

    if (!avatarUrl) return null;

    return {
      userId,
      username: user.name,
      displayName: user.displayName || user.name,
      avatarUrl,
      profileUrl: buildRobloxProfileUrl(userId),
    };
  } catch (error) {
    console.warn(`[roblox] Erro ao buscar usuário ${userId}:`, error);
    return null;
  }
}
