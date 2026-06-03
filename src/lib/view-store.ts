import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const VIEW_KEY = "site:views";
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "views.json");

type ViewFile = { count: number };

async function readFileCount(): Promise<number> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw) as ViewFile;
    return Number.isFinite(data.count) && data.count >= 0 ? data.count : 0;
  } catch {
    return 0;
  }
}

async function writeFileCount(count: number): Promise<void> {
  await mkdir(DATA_DIR, { recursive: true });
  await writeFile(DATA_FILE, JSON.stringify({ count }), "utf8");
}

async function upstashCommand<T>(command: string[]): Promise<T | null> {
  const url = process.env.UPSTASH_REDIS_REST_URL?.trim();
  const token = process.env.UPSTASH_REDIS_REST_TOKEN?.trim();
  if (!url || !token) return null;

  try {
    const response = await fetch(url, {
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/json",
      },
      body: JSON.stringify(command),
      cache: "no-store",
    });

    if (!response.ok) return null;

    const data = (await response.json()) as { result?: T };
    return data.result ?? null;
  } catch {
    return null;
  }
}

export async function getViewCount(): Promise<number> {
  const redisCount = await upstashCommand<number>(["GET", VIEW_KEY]);
  if (typeof redisCount === "number") return redisCount;
  if (typeof redisCount === "string") {
    const parsed = parseInt(redisCount, 10);
    if (Number.isFinite(parsed)) return parsed;
  }

  return readFileCount();
}

export async function incrementViewCount(): Promise<number> {
  const redisCount = await upstashCommand<number>(["INCR", VIEW_KEY]);
  if (typeof redisCount === "number") return redisCount;

  const next = (await readFileCount()) + 1;
  await writeFileCount(next);
  return next;
}
