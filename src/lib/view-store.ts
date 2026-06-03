import { siteViewCountBase } from "@/lib/config";
import { mkdir, readFile, writeFile } from "fs/promises";
import path from "path";

const VIEW_KEY = "site:views";
const DATA_DIR = path.join(process.cwd(), ".data");
const DATA_FILE = path.join(DATA_DIR, "views.json");

type ViewFile = { count: number };

function normalizeCount(value: number): number {
  return Number.isFinite(value) && value >= siteViewCountBase
    ? value
    : siteViewCountBase;
}

async function readFileCount(): Promise<number> {
  try {
    const raw = await readFile(DATA_FILE, "utf8");
    const data = JSON.parse(raw) as ViewFile;
    return normalizeCount(data.count);
  } catch {
    return siteViewCountBase;
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

async function readRedisCount(): Promise<number | null> {
  const raw = await upstashCommand<number | string>(["GET", VIEW_KEY]);
  if (raw === null || raw === undefined) return null;
  const parsed = typeof raw === "number" ? raw : parseInt(String(raw), 10);
  if (!Number.isFinite(parsed)) return null;
  return parsed;
}

async function writeRedisCount(count: number): Promise<boolean> {
  const result = await upstashCommand<string>(["SET", VIEW_KEY, String(count)]);
  return result === "OK";
}

export async function getViewCount(): Promise<number> {
  const redisCount = await readRedisCount();
  if (redisCount !== null) return normalizeCount(redisCount);

  return readFileCount();
}

function hasUpstash(): boolean {
  return Boolean(
    process.env.UPSTASH_REDIS_REST_URL?.trim() &&
      process.env.UPSTASH_REDIS_REST_TOKEN?.trim(),
  );
}

export async function incrementViewCount(): Promise<number> {
  if (hasUpstash()) {
    const redisCount = await readRedisCount();

    if (redisCount === null || redisCount < siteViewCountBase) {
      await writeRedisCount(siteViewCountBase);
    }

    const incremented = await upstashCommand<number>(["INCR", VIEW_KEY]);
    if (typeof incremented === "number") {
      return Math.max(incremented, siteViewCountBase);
    }
  }

  const current = await readFileCount();
  const next = current + 1;
  await writeFileCount(next);
  return next;
}
