import { ArrowRight, CircleDot, Trophy } from "lucide-react";
import { SPORTS_BY_GAME } from "../data/sports.js";
import { formatMatchdayDate, getUpcomingMatchday, TEAMS } from "../lib/schedule.js";

const GROUP_DETAILS = {
  football: { label: "Football", icon: CircleDot },
  basketball: { label: "Basketball", icon: Trophy },
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
          const Icon = GROUP_DETAILS[game].icon;
          return (
            <section className="sport-group" key={game} aria-labelledby={`${game}-heading`}>
              <div className="sport-group__heading">
                <span className={`sport-icon sport-icon--${game}`}><Icon size={22} aria-hidden="true" /></span>
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

      <footer className="schools-strip" aria-label="Participating schools">
        <span>8 schools</span>
        <div>{TEAMS.map((team) => <span key={team}>{team}</span>)}</div>
      </footer>
    </div>
  );
}
