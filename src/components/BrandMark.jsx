import { publicAsset } from "../lib/appPaths.js";

export function BrandMark({ compact = false }) {
  return (
    <span className={`brand-mark${compact ? " brand-mark--compact" : ""}`} aria-hidden="true">
      <img src={publicAsset("/brand/hzisl-main.png")} alt="" />
    </span>
  );
}
