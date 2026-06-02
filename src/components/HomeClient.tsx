"use client";

import { useCallback, useRef, useState, type ReactNode } from "react";
import Background from "@/components/Background";
import EntryGate from "@/components/EntryGate";
import MusicPlayer, { type MusicPlayerHandle } from "@/components/MusicPlayer";
import SideDecorations from "@/components/SideDecorations";

type HomeClientProps = {
  children: ReactNode;
};

export default function HomeClient({ children }: HomeClientProps) {
  const [entered, setEntered] = useState(false);
  const musicRef = useRef<MusicPlayerHandle>(null);

  const handleEnter = useCallback(() => {
    musicRef.current?.playFromUserGesture();
    setEntered(true);
  }, []);

  return (
    <div className="site-shell">
      <Background active={entered} />

      {!entered && <EntryGate onEnter={handleEnter} />}

      {entered && (
        <div className="site-content">
          <SideDecorations />
          {children}
        </div>
      )}

      <MusicPlayer ref={musicRef} visible={entered} />
    </div>
  );
}
