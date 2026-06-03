"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { refreshPresence, type PresenceUpdate } from "@/app/actions/discord";
import ActivityIcon from "./ActivityIcon";

const POLL_INTERVAL_MS = 15_000;

type ActivityState = PresenceUpdate;

type DiscordActivityProps = {
  userId: string;
  placement?: "default" | "header";
};

function activitySnapshot(activity: ActivityState | null): string {
  if (!activity) return "";
  return `${activity.kind}|${activity.text}|${activity.iconUrl ?? ""}`;
}

export default function DiscordActivity({
  userId,
  placement = "default",
}: DiscordActivityProps) {
  const [activity, setActivity] = useState<ActivityState | null>(null);
  const lastSnapshotRef = useRef("");

  const isHeader = placement === "header";

  const refresh = useCallback(async () => {
    try {
      const next = await refreshPresence(userId);

      if (!next?.text) {
        if (lastSnapshotRef.current !== "") {
          lastSnapshotRef.current = "";
          setActivity(null);
        }
        return;
      }

      const snapshot = activitySnapshot(next);
      if (snapshot === lastSnapshotRef.current) return;

      lastSnapshotRef.current = snapshot;
      setActivity(next);
    } catch {
      /* mantém último estado */
    }
  }, [userId]);

  useEffect(() => {
    refresh();

    const fastBoot = setInterval(refresh, 2000);
    const stopFast = setTimeout(() => clearInterval(fastBoot), 30_000);

    const interval = setInterval(refresh, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refresh();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(fastBoot);
      clearTimeout(stopFast);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refresh]);

  if (!activity) return null;

  return (
    <div
      className={
        isHeader ? "profile-activity profile-activity--header" : "profile-activity"
      }
    >
      <ActivityIcon
        src={activity.iconUrl}
        kind={activity.kind}
        alt={activity.text}
      />
      <span className="profile-activity-text">{activity.text}</span>
    </div>
  );
}
