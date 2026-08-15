import { CalendarDays, Clock3, MapPin } from "lucide-react";
import {
  formatMatchdayDate,
  getFixturesForDivision,
  getUpcomingMatchday,
  MATCHDAYS,
} from "../lib/schedule.js";

export function MatchdayPanel({ selectedNumber, sport, onSelect }) {
  const upcoming = getUpcomingMatchday();
  const matchday = MATCHDAYS.find((item) => item.number === selectedNumber) ?? upcoming;
  const fixtures = getFixturesForDivision(matchday, sport);

  return (
    <section className="panel matchday-panel" aria-labelledby="matchday-heading">
      <div className="panel__heading matchday-panel__heading">
        <div>
          <h2 id="matchday-heading">Next matchday</h2>
          <p>{matchday.leg}</p>
        </div>
        <label className="matchday-select">
          <span className="sr-only">Choose a matchday</span>
          <select value={matchday.number} onChange={(event) => onSelect(Number(event.target.value))}>
            {MATCHDAYS.map((item) => (
              <option value={item.number} key={item.number}>
                {item.number === upcoming.number ? "Next · " : ""}Matchday {item.number}
              </option>
            ))}
          </select>
        </label>
      </div>

      <div className="matchday-date">
        <CalendarDays size={19} aria-hidden="true" />
        <div>
          <strong>{formatMatchdayDate(matchday.date)}</strong>
          <span>Matchday {matchday.number} of {MATCHDAYS.length}</span>
        </div>
      </div>

      <div className="fixtures-list">
        {fixtures.map((fixture) => (
          <article className="fixture" key={`${fixture.home}-${fixture.away}`}>
            <time dateTime={`${matchday.date}T${fixture.kickoff}:00+08:00`}>
              <Clock3 size={14} aria-hidden="true" />
              {fixture.kickoff}
            </time>
            <div className="fixture__teams">
              <span><strong>{fixture.home}</strong><small>Home</small></span>
              <span className="fixture__versus">vs</span>
              <span><strong>{fixture.away}</strong><small>Away</small></span>
            </div>
            <span className="fixture__venue">
              <MapPin size={14} aria-hidden="true" />
              {fixture.venue}
            </span>
          </article>
        ))}
      </div>
    </section>
  );
}
