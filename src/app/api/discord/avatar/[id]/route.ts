import { fetchDiscordAvatarUrl } from "@/lib/discord";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic";
export const revalidate = 0;

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!/^\d{17,20}$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  const result = await fetchDiscordAvatarUrl(id, true);

  return NextResponse.json(
    {
      userId: id,
      avatarUrl: result.avatarUrl,
      fromApi: result.fromApi,
      error: result.error ?? null,
      fetchedAt: Date.now(),
    },
    {
      headers: {
        "Cache-Control": "no-store, no-cache, must-revalidate",
      },
    },
  );
}
