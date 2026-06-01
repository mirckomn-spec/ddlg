"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import ActivityIcon from "./ActivityIcon";

const POLL_INTERVAL_MS = 15_000;

type PresenceActivity = {
  kind: string;
  text: string;
  iconUrl: string | null;
};

type UserPresence = {
  status: string;
  activity: PresenceActivity | null;
};

type PresenceApiResponse = {
  presence: UserPresence | null;
  ready: boolean;
};

type ActivityState = {
  text: string;
  iconUrl: string | null;
  kind: string;
};

type DiscordActivityProps = {
  discordId: string;
  placement?: "default" | "header";
};

function activitySnapshot(activity: ActivityState | null): string {
  if (!activity) return "";
  return `${activity.kind}|${activity.text}|${activity.iconUrl ?? ""}`;
}

export default function DiscordActivity({
  discordId,
  placement = "default",
}: DiscordActivityProps) {
  const [activity, setActivity] = useState<ActivityState | null>(null);
  const lastSnapshotRef = useRef("");

  const isHeader = placement === "header";

  const refreshPresence = useCallback(async () => {
    try {
      const response = await fetch(`/api/discord/presence/${discordId}`, {
        cache: "no-store",
      });

      if (!response.ok) return;

      const data = (await response.json()) as PresenceApiResponse;

      if (!data.ready) return;

      const next = data.presence?.activity;

      if (!next?.text) {
        if (lastSnapshotRef.current !== "") {
          lastSnapshotRef.current = "";
          setActivity(null);
        }
        return;
      }

      const snapshot = activitySnapshot({
        text: next.text,
        iconUrl: next.iconUrl ?? null,
        kind: next.kind,
      });

      if (snapshot === lastSnapshotRef.current) return;

      lastSnapshotRef.current = snapshot;
      setActivity({
        text: next.text,
        iconUrl: next.iconUrl ?? null,
        kind: next.kind,
      });
    } catch {
      /* mantém último estado */
    }
  }, [discordId]);

  useEffect(() => {
    refreshPresence();

    const fastBoot = setInterval(refreshPresence, 2000);
    const stopFast = setTimeout(() => clearInterval(fastBoot), 30_000);

    const interval = setInterval(refreshPresence, POLL_INTERVAL_MS);

    const onVisible = () => {
      if (document.visibilityState === "visible") {
        refreshPresence();
      }
    };

    document.addEventListener("visibilitychange", onVisible);

    return () => {
      clearInterval(fastBoot);
      clearTimeout(stopFast);
      clearInterval(interval);
      document.removeEventListener("visibilitychange", onVisible);
    };
  }, [refreshPresence]);

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
