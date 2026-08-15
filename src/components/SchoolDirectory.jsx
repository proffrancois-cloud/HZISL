import { useState } from "react";
import { CalendarDays, ChevronDown, MapPin, Trophy } from "lucide-react";
import { SCHOOLS } from "../data/schools.js";
import { getSchoolCompetitionOverview } from "../lib/teamData.js";
import { SchoolLogo } from "./SchoolLogo.jsx";

export function SchoolDirectory({ onNavigate }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const selectedSchool = SCHOOLS.find((school) => school.id === selectedSchoolId);
  const overview = selectedSchool ? getSchoolCompetitionOverview(selectedSchool.id) : [];

  return (
    <section className="school-directory" aria-labelledby="schools-heading">
      <div className="section-heading">
        <div>
          <h2 id="schools-heading">Schools</h2>
          <p>8 ISLT members</p>
        </div>
        <span className="plum-chip" aria-hidden="true">✿ Taiwan</span>
      </div>

      <div className="school-grid">
        {SCHOOLS.map((school) => (
          <button
            className={`school-button${selectedSchoolId === school.id ? " is-selected" : ""}`}
            type="button"
            key={school.id}
            aria-expanded={selectedSchoolId === school.id}
            onClick={() => setSelectedSchoolId((current) => current === school.id ? null : school.id)}
          >
            <SchoolLogo school={school} />
            <span>
              <strong>{school.id} {school.mascot}</strong>
              <small>{school.name}</small>
            </span>
            <ChevronDown size={17} aria-hidden="true" />
          </button>
        ))}
      </div>

      {selectedSchool ? (
        <div className="school-overview" aria-live="polite">
          <header>
            <div>
              <SchoolLogo school={selectedSchool} size="large" />
              <span><strong>{selectedSchool.id} {selectedSchool.mascot}</strong><small>Next fixtures · all divisions</small></span>
            </div>
            <span className="school-overview__count">8 teams</span>
          </header>
          <div className="school-team-list">
            {overview.map(({ sport, position, points, nextMatch }) => (
              <button
                className="school-team-row"
                type="button"
                key={sport.id}
                onClick={() => onNavigate(`/sports/${sport.id}`)}
              >
                <span className={`sport-mini sport-mini--${sport.game}`} aria-hidden="true">
                  {sport.game === "football" ? "F" : "B"}
                </span>
                <span className="school-team-row__sport"><strong>{sport.title}</strong><small>Matchday {nextMatch.matchday}</small></span>
                <span className="school-team-row__fixture"><strong>{nextMatch.homeAway === "Home" ? "vs" : "@"} {nextMatch.opponent}</strong><small><CalendarDays size={12} /> {nextMatch.dateLabel} · {nextMatch.kickoff}</small></span>
                <span className="school-team-row__venue"><MapPin size={13} /> {nextMatch.venue}</span>
                <span className="school-team-row__rank"><Trophy size={13} /><strong>#{position}</strong><small>{points} pts</small></span>
              </button>
            ))}
          </div>
        </div>
      ) : null}
    </section>
  );
}
