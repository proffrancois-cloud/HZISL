import { useEffect, useState } from "react";
import { ArrowLeft, ClipboardCheck, FileText } from "lucide-react";
import { publicAsset, toBrowserPath } from "../lib/appPaths.js";
import { getUpcomingMatchday, MATCHDAYS } from "../lib/schedule.js";
import { MatchdayPanel } from "./MatchdayPanel.jsx";
import { StandingsTable } from "./StandingsTable.jsx";

function DocumentAction({ href, label, icon: Icon, unavailableMessage, onNotice }) {
  if (href) {
    return (
      <a className="rules-action" href={href} download aria-label={`Download ${label}`} title={`Download ${label}`}>
        <span>{label}</span><Icon size={15} aria-hidden="true" />
      </a>
    );
  }

  return (
    <button
      className="rules-action"
      type="button"
      aria-label={`${label} unavailable`}
      onClick={() => onNotice(unavailableMessage)}
    >
      <span>{label}</span><Icon size={15} aria-hidden="true" />
    </button>
  );
}

export function SportPage({ sport, onNavigate, onNotice }) {
  const [selectedMatchday, setSelectedMatchday] = useState(getUpcomingMatchday(MATCHDAYS).number);

  useEffect(() => {
    setSelectedMatchday(getUpcomingMatchday(MATCHDAYS).number);
  }, [sport.id]);

  return (
    <div className="page page--sport">
      <a
        className="back-link"
        href={toBrowserPath("/")}
        onClick={(event) => {
          event.preventDefault();
          onNavigate("/");
        }}
      >
        <ArrowLeft size={16} aria-hidden="true" /> All sports
      </a>

      <header className="sport-heading">
        <div>
          <img
            className="sport-brand-logo sport-brand-logo--heading"
            src={publicAsset(`/brand/hzisl-${sport.game}.png`)}
            alt=""
            aria-hidden="true"
          />
          <div>
            <p>{sport.level === "MS" ? "Middle School" : "High School"} · {sport.gender}</p>
            <h1>{sport.game === "football" ? "Football" : "Basketball"}</h1>
          </div>
        </div>
        <div className="sport-document-actions" aria-label="Competition documents">
          <DocumentAction
            href={sport.rulesUrl}
            label="Rules DOCX"
            icon={FileText}
            unavailableMessage="Competition rules are unavailable."
            onNotice={onNotice}
          />
          <DocumentAction
            href={sport.reportUrl}
            label="Match report"
            icon={ClipboardCheck}
            unavailableMessage="The official match report is unavailable."
            onNotice={onNotice}
          />
        </div>
      </header>

      <div className="competition-grid">
        <StandingsTable
          sport={sport}
          throughMatchday={selectedMatchday === "finals" ? MATCHDAYS.length : selectedMatchday}
        />
        <MatchdayPanel
          selectedNumber={selectedMatchday}
          sport={sport}
          onSelect={setSelectedMatchday}
        />
      </div>
    </div>
  );
}
