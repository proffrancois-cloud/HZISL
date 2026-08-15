import { ArrowRight } from "lucide-react";
import { SPORTS_BY_GAME } from "../data/sports.js";
import { formatMatchdayDate, getUpcomingMatchday } from "../lib/schedule.js";
import { FinalsDayPanel } from "./FinalsDayPanel.jsx";
import { SchoolDirectory } from "./SchoolDirectory.jsx";

const GROUP_DETAILS = {
  football: { label: "Football", logo: "/brand/islt-football.png" },
  basketball: { label: "Basketball", logo: "/brand/islt-basketball.png" },
};

export function HomePage({ onNavigate }) {
  const nextMatchday = getUpcomingMatchday();

  return (
    <div className="page page--home">
      <header className="home-heading">
        <div>
          <h1>ISLT Competitions</h1>
          <p>International Schools League in Taiwan · 2026–27</p>
        </div>
        <div className="next-date" aria-label={`Next games ${formatMatchdayDate(nextMatchday.date)}`}>
          <span>Next games</span>
          <strong>{formatMatchdayDate(nextMatchday.date, { weekday: "short" })}</strong>
        </div>
      </header>

      <div className="sport-directory">
        {Object.entries(SPORTS_BY_GAME).map(([game, sports]) => {
          return (
            <section className="sport-group" key={game} aria-labelledby={`${game}-heading`}>
              <div className="sport-group__heading">
                <img
                  className="sport-brand-logo"
                  src={GROUP_DETAILS[game].logo}
                  alt=""
                  aria-hidden="true"
                />
                <div>
                  <h2 id={`${game}-heading`}>{GROUP_DETAILS[game].label}</h2>
                  <p>4 divisions</p>
                </div>
              </div>

              <div className="division-list">
                {sports.map((sport) => (
                  <a
                    className="division-link"
                    href={`/sports/${sport.id}`}
                    key={sport.id}
                    onClick={(event) => {
                      event.preventDefault();
                      onNavigate(`/sports/${sport.id}`);
                    }}
                  >
                    <span className="level-badge">{sport.level}</span>
                    <span>
                      <strong>{sport.gender}</strong>
                      <small>{GROUP_DETAILS[game].label}</small>
                    </span>
                    <ArrowRight size={18} aria-hidden="true" />
                  </a>
                ))}
              </div>
            </section>
          );
        })}
      </div>

      <FinalsDayPanel compact />
      <SchoolDirectory onNavigate={onNavigate} />
    </div>
  );
}
