import { useState } from "react";
import { CalendarDays, ChevronDown, Mail, MapPin, Trophy } from "lucide-react";
import { CONTACT_BY_SCHOOL } from "../data/organization.js";
import { SCHOOLS, SCHOOL_BY_ID } from "../data/schools.js";
import { getSchoolCompetitionOverview } from "../lib/teamData.js";
import { SchoolLogo } from "./SchoolLogo.jsx";
import { SportLogo } from "./SportLogo.jsx";

export function SchoolDirectory({ onNavigate }) {
  const [selectedSchoolId, setSelectedSchoolId] = useState(null);
  const selectedSchool = SCHOOLS.find((school) => school.id === selectedSchoolId);
  const overview = selectedSchool ? getSchoolCompetitionOverview(selectedSchool.id) : [];
  const selectedContact = selectedSchool ? CONTACT_BY_SCHOOL[selectedSchool.id] : null;

  return (
    <section className="school-directory" aria-labelledby="schools-heading">
      <div className="section-heading">
        <div>
          <h2 id="schools-heading">Schools</h2>
          <p>6 Hsinchu–Zhubei members</p>
        </div>
        <span className="plum-chip" aria-hidden="true">✿ Hsinchu · Zhubei</span>
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
              <strong>{school.displayName} {school.mascot}</strong>
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
              <span><strong>{selectedSchool.displayName} {selectedSchool.mascot}</strong><small>Next fixtures · all divisions</small></span>
            </div>
            <div className="school-overview__actions">
              {selectedContact ? (
                <a className="school-contact-link" href={`mailto:${selectedContact.email}`}>
                  <Mail size={13} aria-hidden="true" /> Contact coordinator
                </a>
              ) : null}
              <span className="school-overview__count">8 teams</span>
            </div>
          </header>
          <div className="school-team-list">
            {overview.map(({ sport, position, points, nextMatch }) => (
              <button
                className="school-team-row"
                type="button"
                key={sport.id}
                onClick={() => onNavigate(`/sports/${sport.id}`)}
              >
                <SportLogo game={sport.game} size="tiny" decorative />
                <span className="school-team-row__sport"><strong>{sport.title}</strong><small>Matchday {nextMatch.matchday}</small></span>
                <span className="school-team-row__fixture">
                  <span className="school-team-row__opponent"><SchoolLogo school={SCHOOL_BY_ID[nextMatch.opponentId]} size="tiny" decorative /><strong>{nextMatch.homeAway === "Home" ? "vs" : "@"} {nextMatch.opponent}</strong></span>
                  <small><CalendarDays size={12} /> {nextMatch.dateLabel} · {nextMatch.kickoff}</small>
                </span>
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
