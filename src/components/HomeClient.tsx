"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import { recordSiteView } from "@/app/actions/site";
import Background from "@/components/Background";
import EntryGate from "@/components/EntryGate";
import MusicPlayer, { type MusicPlayerHandle } from "@/components/MusicPlayer";
import SideDecorations from "@/components/SideDecorations";
import ViewCounter from "@/components/ViewCounter";

type HomeClientProps = {
  children: ReactNode;
  initialViewCount: number;
};

const VIEW_SESSION_KEY = "ddlg-view-recorded";

export default function HomeClient({
  children,
  initialViewCount,
}: HomeClientProps) {
  const [entered, setEntered] = useState(false);
  const [viewCount, setViewCount] = useState(initialViewCount);
  const musicRef = useRef<MusicPlayerHandle>(null);
  const viewRecordedRef = useRef(false);

  const handleEnter = useCallback(() => {
    musicRef.current?.playFromUserGesture();
    setEntered(true);

    if (viewRecordedRef.current) return;

    try {
      if (sessionStorage.getItem(VIEW_SESSION_KEY)) {
        viewRecordedRef.current = true;
        return;
      }
      sessionStorage.setItem(VIEW_SESSION_KEY, "1");
    } catch {
      /* sessão indisponível */
    }

    viewRecordedRef.current = true;

    void recordSiteView().then((count) => {
      if (Number.isFinite(count) && count > 0) {
        setViewCount(count);
      }
    });
  }, []);

  return (
    <div className="site-shell">
      <Background />

      {!entered && <EntryGate onEnter={handleEnter} />}

      {entered && (
        <div className="site-content">
          <SideDecorations />
          {children}
        </div>
      )}

      <MusicPlayer ref={musicRef} visible={entered} />
      <ViewCounter count={viewCount} visible={entered} />
    </div>
  );
}
