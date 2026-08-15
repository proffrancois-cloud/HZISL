import { CalendarDays, Clock3, MapPin, X } from "lucide-react";
import { SCHOOL_BY_ID } from "../data/schools.js";
import { getTeamSchedule } from "../lib/teamData.js";
import { SchoolLogo } from "./SchoolLogo.jsx";

export function TeamDetails({ sport, teamId, onClose }) {
  const school = SCHOOL_BY_ID[teamId];
  const schedule = getTeamSchedule(sport, teamId);

  return (
    <div className="team-details" aria-live="polite">
      <header>
        <div>
          <SchoolLogo school={school} />
          <span><strong>{school.id} {school.mascot}</strong><small>{sport.title}</small></span>
        </div>
        <button className="icon-button" type="button" aria-label={`Close ${school.id} details`} onClick={onClose}>
          <X size={18} aria-hidden="true" />
        </button>
      </header>

      <div className="team-details__grid">
        <section>
          <h3>Recent results</h3>
          <div className="team-match-list">
            {schedule.completed.map((match) => (
              <div className="team-result" key={match.matchday}>
                <span className={`result-badge result-badge--${match.outcome.toLowerCase()}`}>{match.outcome}</span>
                <span><strong>{match.homeAway === "Home" ? "vs" : "@"} {match.opponent}</strong><small>MD {match.matchday} · {match.dateLabel}</small></span>
                <strong className="team-result__score">{match.score}</strong>
              </div>
            ))}
          </div>
        </section>
        <section>
          <h3>Upcoming</h3>
          <div className="team-match-list">
            {schedule.upcoming.map((match) => (
              <div className="team-upcoming" key={match.matchday}>
                <CalendarDays size={16} aria-hidden="true" />
                <span><strong>{match.homeAway === "Home" ? "vs" : "@"} {match.opponent}</strong><small>MD {match.matchday} · {match.dateLabel}</small></span>
                <span className="team-upcoming__meta"><small><Clock3 size={12} /> {match.kickoff}</small><small><MapPin size={12} /> {match.venue}</small></span>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
}
