import { GAME_DETAILS } from "../data/sports.js";

export function SportLogo({ game, size = "default", decorative = false }) {
  const details = GAME_DETAILS[game];

  if (!details) return null;

  return (
    <span className={`sport-logo sport-logo--${size}`}>
      <img
        src={details.logoUrl}
        alt={decorative ? "" : `${details.label} logo`}
      />
    </span>
  );
}
