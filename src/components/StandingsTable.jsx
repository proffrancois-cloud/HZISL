import { getStandings } from "../data/standings.js";

export function StandingsTable({ sportId }) {
  const standings = getStandings(sportId);

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
              <tr key={row.team} className={row.team === "HCAS" ? "is-hcas" : ""}>
                <td><span className="position">{row.position}</span></td>
                <th scope="row">
                  <span className="team-cell">
                    <span className={`team-dot${row.team === "HCAS" ? " team-dot--hcas" : ""}`} aria-hidden="true" />
                    {row.team}
                  </span>
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
    </section>
  );
}
