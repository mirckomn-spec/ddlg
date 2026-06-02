"use client";

import type { KeyboardEvent } from "react";

type EntryGateProps = {
  onEnter: () => void;
};

export default function EntryGate({ onEnter }: EntryGateProps) {
  const handleClick = () => {
    onEnter();
  };

  const handleKeyDown = (e: KeyboardEvent) => {
    if (e.key === "Enter" || e.key === " ") {
      e.preventDefault();
      onEnter();
    }
  };

  return (
    <div
      className="entry-gate"
      role="button"
      tabIndex={0}
      onClick={handleClick}
      onKeyDown={handleKeyDown}
      aria-label="Clique para entrar no site"
    >
      <div className="entry-gate-vignette" aria-hidden="true" />
      <div className="entry-gate-content">
        <p className="entry-gate-label">clique para entrar</p>
        <span className="entry-gate-hint" aria-hidden="true">
          ▼
        </span>
      </div>
    </div>
  );
}
