"use server";

import { getViewCount, incrementViewCount } from "@/lib/view-store";

export async function getSiteViewCount(): Promise<number> {
  return getViewCount();
}

export async function recordSiteView(): Promise<number> {
  return incrementViewCount();
}
