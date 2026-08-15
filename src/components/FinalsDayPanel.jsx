import { CalendarDays, Flag, MapPin } from "lucide-react";
import { FINALS_DAY, formatMatchdayDate } from "../lib/schedule.js";

export function FinalsDayPanel({ compact = false }) {
  return (
    <section className={`finals-day${compact ? " finals-day--compact" : ""}`} aria-labelledby={compact ? "home-finals-heading" : "finals-heading"}>
      <div className="finals-day__intro">
        <span className="finals-flower" aria-hidden="true">✿</span>
        <div>
          <span className="finals-day__status"><Flag size={13} /> {FINALS_DAY.status}</span>
          <h2 id={compact ? "home-finals-heading" : "finals-heading"}>{FINALS_DAY.title}</h2>
          <p><CalendarDays size={14} /> {formatMatchdayDate(FINALS_DAY.date)} · After Matchday 14</p>
        </div>
      </div>
      <div className="finals-matchups" aria-label="Planned quarter-finals">
        {FINALS_DAY.matchups.map((matchup, index) => (
          <div key={matchup.seedA}>
            <small>Quarter-final {index + 1}</small>
            <strong><span>#{matchup.seedA}</span> vs <span>#{matchup.seedB}</span></strong>
          </div>
        ))}
      </div>
      {!compact ? <span className="finals-day__tbc"><MapPin size={14} /> Times and venue TBC</span> : null}
    </section>
  );
}
