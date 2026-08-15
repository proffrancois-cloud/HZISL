import { useState } from "react";
import {
  ArrowLeft,
  CalendarDays,
  Clock3,
  ExternalLink,
  FileText,
  Repeat2,
} from "lucide-react";
import { getUpcomingMatchday, MATCHDAYS } from "../lib/schedule.js";
import { MatchdayPanel } from "./MatchdayPanel.jsx";
import { StandingsTable } from "./StandingsTable.jsx";

function RulesAction({ sport, onNotice }) {
  if (sport.rulesUrl) {
    return (
      <a className="rules-action" href={sport.rulesUrl} target="_blank" rel="noreferrer">
        <span>Rules PDF</span><ExternalLink size={15} aria-hidden="true" />
      </a>
    );
  }

  return (
    <button
      className="rules-action"
      type="button"
      onClick={() => onNotice(`${sport.game === "football" ? "Football" : "Basketball"} rules PDF coming soon.`)}
    >
      <span>Rules PDF</span><FileText size={15} aria-hidden="true" />
    </button>
  );
}

export function SportPage({ sport, onNavigate, onNotice }) {
  const [selectedMatchday, setSelectedMatchday] = useState(getUpcomingMatchday(MATCHDAYS).number);
  const isFootball = sport.game === "football";

  return (
    <div className="page page--sport">
      <a
        className="back-link"
        href="/"
        onClick={(event) => {
          event.preventDefault();
          onNavigate("/");
        }}
      >
        <ArrowLeft size={16} aria-hidden="true" /> All sports
      </a>

      <header className="sport-heading">
        <div>
          <span className={`sport-icon sport-icon--${sport.game}`} aria-hidden="true">
            {isFootball ? "F" : "B"}
          </span>
          <div>
            <p>{sport.level === "MS" ? "Middle School" : "High School"} · {sport.gender}</p>
            <h1>{sport.game === "football" ? "Football" : "Basketball"}</h1>
          </div>
        </div>
        <RulesAction sport={sport} onNotice={onNotice} />
      </header>

      <div className="competition-grid">
        <StandingsTable sportId={sport.id} />
        <MatchdayPanel
          selectedNumber={selectedMatchday}
          sport={sport}
          onSelect={setSelectedMatchday}
        />
      </div>

      <section className="competition-facts" aria-label="Competition format">
        <div>
          <CalendarDays size={19} aria-hidden="true" />
          <span><small>Schedule</small><strong>Saturday mornings</strong></span>
        </div>
        <div>
          <Clock3 size={19} aria-hidden="true" />
          <span><small>Start</small><strong>{sport.level === "MS" ? "08:00" : "09:30"}</strong></span>
        </div>
        <div>
          <Repeat2 size={19} aria-hidden="true" />
          <span><small>Season</small><strong>Home & away · 14 matchdays</strong></span>
        </div>
        <div>
          <span className="fact-symbol" aria-hidden="true">{isFootball ? "2×" : "4×"}</span>
          <span>
            <small>Game format</small>
            <strong>{isFootball ? "40 min · 10 min break" : "8 min · Q 4 min · HT 10 min"}</strong>
          </span>
        </div>
      </section>
    </div>
  );
}
