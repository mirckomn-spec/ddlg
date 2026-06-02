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
        <div className="side-decor-anchor">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sideDecorations.right.src}
            alt={sideDecorations.right.alt}
            className="side-decor-img"
            loading="lazy"
            decoding="async"
          />
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={sideDecorations.rightBelow.src}
            alt={sideDecorations.rightBelow.alt}
            className="side-decor-img side-decor-img--below"
            loading="lazy"
            decoding="async"
          />
        </div>
      </aside>
    </>
  );
}
