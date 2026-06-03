type ViewCounterProps = {
  count: number;
  visible?: boolean;
};

function formatCount(value: number): string {
  return new Intl.NumberFormat("pt-BR").format(Math.max(0, value));
}

export default function ViewCounter({ count, visible = true }: ViewCounterProps) {
  if (!visible) return null;

  return (
    <p className="view-counter" aria-live="polite">
      <span className="view-counter-value">{formatCount(count)}</span>
      <span className="view-counter-label">
        {count === 1 ? "visualização" : "visualizações"}
      </span>
    </p>
  );
}
