import { useState } from "react";
import { ArrowRight, ChevronDown, Newspaper } from "lucide-react";
import { GAME_DETAILS, SPORTS_BY_GAME } from "../data/sports.js";
import { toBrowserPath } from "../lib/appPaths.js";
import { formatMatchdayDate, getUpcomingMatchday } from "../lib/schedule.js";
import { SchoolDirectory } from "./SchoolDirectory.jsx";
import { SportLogo } from "./SportLogo.jsx";

export function HomePage({ onNavigate }) {
  const nextMatchday = getUpcomingMatchday();
  const [selectedGame, setSelectedGame] = useState(null);
  const selectedSports = selectedGame ? SPORTS_BY_GAME[selectedGame] : [];

  return (
    <div className="page page--home">
      <header className="home-heading">
        <div>
          <h1>HZISL Competitions</h1>
          <p>Hsinchu–Zhubei International Schools League · 2026–27</p>
        </div>
        <div className="next-date" aria-label={`Next games ${formatMatchdayDate(nextMatchday.date)}`}>
          <span>Next games</span>
          <strong>{formatMatchdayDate(nextMatchday.date, { weekday: "short" })}</strong>
        </div>
      </header>

      <section className="home-news" aria-labelledby="news-heading">
        <div className="section-heading">
          <div><h2 id="news-heading">News</h2><p>League updates</p></div>
        </div>
        <div className="news-placeholder">
          <Newspaper size={20} aria-hidden="true" />
          <span>News coming soon</span>
        </div>
      </section>

      <section className="home-sports" aria-labelledby="sports-heading">
        <div className="section-heading">
          <div><h2 id="sports-heading">Sports</h2><p>Choose a competition</p></div>
        </div>

        <div className="home-sport-logos">
          {Object.keys(SPORTS_BY_GAME).map((game) => {
            const isOpen = selectedGame === game;
            return (
              <button
                className={`home-sport-logo${isOpen ? " is-open" : ""}`}
                type="button"
                key={game}
                aria-expanded={isOpen}
                aria-controls="home-sport-menu"
                onClick={() => setSelectedGame((current) => current === game ? null : game)}
              >
                <SportLogo game={game} size="home" decorative />
                <span className="sr-only">{`Show ${GAME_DETAILS[game].label} competitions`}</span>
                <ChevronDown size={17} aria-hidden="true" />
              </button>
            );
          })}
        </div>

        {selectedGame ? (
          <div className="home-sport-menu" id="home-sport-menu" aria-live="polite">
            {selectedSports.map((sport) => (
              <a
                className="division-link"
                href={toBrowserPath(`/sports/${sport.id}`)}
                key={sport.id}
                onClick={(event) => {
                  event.preventDefault();
                  onNavigate(`/sports/${sport.id}`);
                }}
              >
                <span className="level-badge">{sport.level}</span>
                <span>
                  <strong>{sport.gender}</strong>
                  <small>{GAME_DETAILS[selectedGame].label}</small>
                </span>
                <ArrowRight size={18} aria-hidden="true" />
              </a>
            ))}
          </div>
        ) : null}
      </section>

      <SchoolDirectory onNavigate={onNavigate} />
    </div>
  );
}
