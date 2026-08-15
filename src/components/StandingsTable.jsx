import { useState } from "react";
import { getStandings } from "../data/standings.js";
import { SCHOOL_BY_ID } from "../data/schools.js";
import { SchoolLogo } from "./SchoolLogo.jsx";
import { TeamDetails } from "./TeamDetails.jsx";

export function StandingsTable({ sport, throughMatchday }) {
  const [selectedTeam, setSelectedTeam] = useState(null);
  const standings = getStandings(sport.id, throughMatchday);

  return (
    <section className="panel standings-panel" aria-labelledby="standings-heading">
      <div className="panel__heading">
        <div>
          <h2 id="standings-heading">Standings</h2>
          <p>Season 2026–27</p>
        </div>
        <span className="table-key"><strong>PTS</strong> Points</span>
      </div>
      <div className="table-scroll" tabIndex="0" aria-label="Scrollable standings table">
        <table>
          <thead>
            <tr>
              <th scope="col"><span className="sr-only">Position</span>#</th>
              <th scope="col">Team</th>
              <th scope="col" title="Points">PTS</th>
              <th scope="col" title="Played">P</th>
              <th scope="col" title="Won">W</th>
              <th scope="col" title="Drawn">D</th>
              <th scope="col" title="Lost">L</th>
              <th scope="col" title="Goal difference">GD</th>
              <th scope="col" title="Red cards">RC</th>
            </tr>
          </thead>
          <tbody>
            {standings.map((row) => (
              <tr key={row.team} className={`${row.team === "HCAS" ? "is-hcas" : ""}${selectedTeam === row.team ? " is-selected" : ""}`}>
                <td><span className="position">{row.position}</span></td>
                <th scope="row">
                  <button
                    className="team-cell"
                    type="button"
                    aria-expanded={selectedTeam === row.team}
                    onClick={() => setSelectedTeam((current) => current === row.team ? null : row.team)}
                  >
                    <SchoolLogo school={SCHOOL_BY_ID[row.team]} size="tiny" decorative />
                    {SCHOOL_BY_ID[row.team]?.displayName ?? row.team}
                  </button>
                </th>
                <td className="points">{row.points}</td>
                <td>{row.played}</td>
                <td>{row.won}</td>
                <td>{row.drawn}</td>
                <td>{row.lost}</td>
                <td>{row.goalDifference > 0 ? `+${row.goalDifference}` : row.goalDifference}</td>
                <td className={row.redCards > 0 ? "discipline" : ""}>{row.redCards}</td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      {selectedTeam ? <TeamDetails sport={sport} teamId={selectedTeam} onClose={() => setSelectedTeam(null)} /> : null}
    </section>
  );
}
