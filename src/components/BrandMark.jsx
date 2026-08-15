export function BrandMark({ compact = false }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-hidden="true">
      <img src="/brand/islt-main.png" alt="" />
    </span>
  );
}
