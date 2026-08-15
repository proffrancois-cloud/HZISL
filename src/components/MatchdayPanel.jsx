import { CalendarDays, Clock3, FileDown, MapPin } from "lucide-react";
import { getMatchResult } from "../data/results.js";
import { SCHOOL_BY_ID, getSchoolDisplayName } from "../data/schools.js";
import {
  FINALS_DAY,
  formatMatchdayDate,
  getFixturesForDivision,
  getUpcomingMatchday,
  MATCHDAYS,
} from "../lib/schedule.js";
import { getMatchReportUrl } from "../lib/matchReports.js";
import { SchoolLogo } from "./SchoolLogo.jsx";

export function MatchdayPanel({ selectedNumber, sport, onSelect }) {
  const upcoming = getUpcomingMatchday();
  const isFinalsDay = selectedNumber === "finals";
  const matchday = isFinalsDay
    ? null
    : MATCHDAYS.find((item) => item.number === selectedNumber) ?? upcoming;
  const fixtures = matchday ? getFixturesForDivision(matchday, sport) : [];

  return (
    <section className="panel matchday-panel" aria-labelledby="matchday-heading">
      <div className="panel__heading matchday-panel__heading">
        <div>
          <h2 id="matchday-heading">{isFinalsDay ? "Finals Day" : `Matchday ${matchday.number}`}</h2>
          <p>{isFinalsDay ? FINALS_DAY.status : matchday.leg}</p>
        </div>
        <label className="matchday-select">
          <span className="sr-only">Choose a matchday</span>
          <select
            value={isFinalsDay ? "finals" : matchday.number}
            onChange={(event) => onSelect(event.target.value === "finals" ? "finals" : Number(event.target.value))}
          >
            {MATCHDAYS.map((item) => (
              <option value={item.number} key={item.number}>
                Matchday {item.number}
              </option>
            ))}
            <option value="finals">Finals Day · TBC</option>
          </select>
        </label>
      </div>

      <div className="matchday-date">
        <CalendarDays size={19} aria-hidden="true" />
        <div>
          <strong>{formatMatchdayDate(isFinalsDay ? FINALS_DAY.date : matchday.date)}</strong>
          <span>{isFinalsDay ? `After Matchday ${MATCHDAYS.length}` : `Matchday ${matchday.number} of ${MATCHDAYS.length}`}</span>
        </div>
      </div>

      {isFinalsDay ? (
        <div className="finals-dropdown-content">
          <strong>One-day knockout event</strong>
          <span>{FINALS_DAY.note}</span>
          <small><MapPin size={13} aria-hidden="true" /> Times and venue TBC</small>
        </div>
      ) : (
        <div className="fixtures-list">
          {fixtures.map((fixture) => {
            const result = getMatchResult(
              sport.id,
              matchday.number,
              fixture.home,
              fixture.away,
            );

            return (
              <article className="fixture" key={`${fixture.home}-${fixture.away}`}>
                <time dateTime={`${matchday.date}T${fixture.kickoff}:00+08:00`}>
                  <Clock3 size={14} aria-hidden="true" />
                  {fixture.kickoff}
                </time>
                <div className="fixture__teams">
                  <span className="fixture__team fixture__team--home">
                    <SchoolLogo school={SCHOOL_BY_ID[fixture.home]} size="fixture" decorative />
                    <span><strong>{getSchoolDisplayName(fixture.home)}</strong><small>Home</small></span>
                  </span>
                  <span className={`fixture__versus${result ? " fixture__score" : ""}`}>
                    {result ? `${result.homeScore}–${result.awayScore}` : "vs"}
                  </span>
                  <span className="fixture__team fixture__team--away">
                    <span><strong>{getSchoolDisplayName(fixture.away)}</strong><small>Away</small></span>
                    <SchoolLogo school={SCHOOL_BY_ID[fixture.away]} size="fixture" decorative />
                  </span>
                </div>
                <div className="fixture__meta">
                  <span className="fixture__venue">
                    <MapPin size={14} aria-hidden="true" />
                    {fixture.venue}
                  </span>
                  <a
                    className="fixture__report"
                    href={getMatchReportUrl(sport, matchday, fixture)}
                    download
                    title={`Download prefilled match report for ${fixture.home} vs ${fixture.away}`}
                  >
                    <FileDown size={14} aria-hidden="true" />
                    Download DOCX
                  </a>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </section>
  );
}
