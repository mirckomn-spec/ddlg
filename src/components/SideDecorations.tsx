import { sideDecorations } from "@/lib/config";

export default function SideDecorations() {
  return (
    <>
      <aside className="side-decor side-decor--left" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sideDecorations.left.src}
          alt={sideDecorations.left.alt}
          className="side-decor-img"
          loading="lazy"
          decoding="async"
        />
      </aside>

      <aside className="side-decor side-decor--right" aria-hidden="true">
        {/* eslint-disable-next-line @next/next/no-img-element */}
        <img
          src={sideDecorations.right.src}
          alt={sideDecorations.right.alt}
          className="side-decor-img"
          loading="lazy"
          decoding="async"
        />
      </aside>
    </>
  );
}
