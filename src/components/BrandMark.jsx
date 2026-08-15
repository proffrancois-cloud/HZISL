export function BrandMark({ compact = false }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-hidden="true">
      <span>IS</span>
      <span>LT</span>
    </span>
  );
}
