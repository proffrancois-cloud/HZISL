import { SPORTS } from "../data/sports.js";
import { getStandings } from "../data/standings.js";
import {
  CURRENT_MATCHDAY_NUMBER,
  formatMatchdayDate,
  getFixturesForDivision,
  MATCHDAYS,
} from "./schedule.js";

function stableScore(key, max) {
  const value = [...key].reduce((total, character) => (total * 31 + character.charCodeAt(0)) % 9973, 7);
  return value % max;
}

function fixtureForTeam(fixtures, teamId) {
  return fixtures.find((fixture) => fixture.home === teamId || fixture.away === teamId);
}

function resultForFixture(matchday, fixture, sportId, teamId) {
  const homeScore = stableScore(`${sportId}-${matchday.number}-${fixture.home}`, 5);
  const awayScore = stableScore(`${sportId}-${matchday.number}-${fixture.away}-away`, 4);
  const teamIsHome = fixture.home === teamId;
  const teamScore = teamIsHome ? homeScore : awayScore;
  const opponentScore = teamIsHome ? awayScore : homeScore;
  const outcome = teamScore === opponentScore ? "D" : teamScore > opponentScore ? "W" : "L";

  return {
    matchday: matchday.number,
    date: matchday.date,
    dateLabel: formatMatchdayDate(matchday.date, { weekday: "short" }),
    opponent: teamIsHome ? fixture.away : fixture.home,
    homeAway: teamIsHome ? "Home" : "Away",
    score: `${teamScore}–${opponentScore}`,
    outcome,
  };
}

function upcomingForFixture(matchday, fixture, sport, teamId) {
  const [details] = getFixturesForDivision(
    { ...matchday, fixtures: [fixture] },
    sport,
  );
  const teamIsHome = fixture.home === teamId;

  return {
    matchday: matchday.number,
    date: matchday.date,
    dateLabel: formatMatchdayDate(matchday.date, { weekday: "short" }),
    opponent: teamIsHome ? fixture.away : fixture.home,
    homeAway: teamIsHome ? "Home" : "Away",
    kickoff: details.kickoff,
    venue: details.venue,
  };
}

export function getTeamSchedule(sport, teamId) {
  const completed = MATCHDAYS
    .filter((matchday) => matchday.number < CURRENT_MATCHDAY_NUMBER)
    .map((matchday) => {
      const fixture = fixtureForTeam(matchday.fixtures, teamId);
      return resultForFixture(matchday, fixture, sport.id, teamId);
    })
    .slice(-3)
    .reverse();

  const upcoming = MATCHDAYS
    .filter((matchday) => matchday.number >= CURRENT_MATCHDAY_NUMBER)
    .slice(0, 3)
    .map((matchday) => {
      const fixture = fixtureForTeam(matchday.fixtures, teamId);
      return upcomingForFixture(matchday, fixture, sport, teamId);
    });

  return { completed, upcoming };
}

export function getSchoolCompetitionOverview(teamId) {
  return SPORTS.map((sport) => {
    const standings = getStandings(sport.id);
    const standing = standings.find((row) => row.team === teamId);
    const nextMatch = getTeamSchedule(sport, teamId).upcoming[0];
    return { sport, position: standing.position, points: standing.points, nextMatch };
  });
}
