import {
  ensureDiscordBot,
  getPresenceForApi,
  isPresenceBotReady,
} from "@/lib/discord-presence";
import { NextResponse } from "next/server";

export const runtime = "nodejs";
export const dynamic = "force-dynamic";

type RouteContext = {
  params: Promise<{ id: string }>;
};

export async function GET(_request: Request, context: RouteContext) {
  const { id } = await context.params;

  if (!/^\d{17,20}$/.test(id)) {
    return NextResponse.json({ error: "ID inválido" }, { status: 400 });
  }

  await ensureDiscordBot();
  const presence = await getPresenceForApi(id);
  const ready = isPresenceBotReady();

  if (ready && !presence?.activity) {
    console.log(
      `[discord-presence] ${id}: sem atividade (status: ${presence?.status ?? "desconhecido"})`,
    );
  }

  return NextResponse.json(
    {
      userId: id,
      ready,
      presence,
      fetchedAt: Date.now(),
    },
    {
      headers: { "Cache-Control": "no-store" },
    },
  );
}
