"use client";

import { useCallback, useState } from "react";
import Background from "@/components/Background";
import EntryGate from "@/components/EntryGate";
import MusicPlayer from "@/components/MusicPlayer";
import ProfileCard from "@/components/ProfileCard";
import SideDecorations from "@/components/SideDecorations";

const ENTER_EVENT = "ddlg-enter";

export default function HomeClient() {
  const [entered, setEntered] = useState(false);
  const [exiting, setExiting] = useState(false);

  const handleEnter = useCallback(() => {
    window.dispatchEvent(new CustomEvent(ENTER_EVENT));
    setExiting(true);
    window.setTimeout(() => {
      setEntered(true);
    }, 520);
  }, []);

  return (
    <div className={`site-shell${exiting ? " site-shell--exiting" : ""}`}>
      <Background />

      {!entered && <EntryGate onEnter={handleEnter} />}

      <div className={entered ? "site-content" : "site-content site-content--locked"}>
        <SideDecorations />
        <ProfileCard />
      </div>

      <MusicPlayer listenForEnter={!entered} canAutoplay={entered} hidden={!entered} />
    </div>
  );
}
