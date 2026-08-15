import { SPORTS } from "../data/sports.js";
import { getStandings } from "../data/standings.js";
import { getSchoolDisplayName } from "../data/schools.js";
import { getMatchResult } from "../data/results.js";
import {
  CURRENT_MATCHDAY_NUMBER,
  formatMatchdayDate,
  getFixturesForDivision,
  MATCHDAYS,
} from "./schedule.js";

function fixtureForTeam(fixtures, teamId) {
  return fixtures.find((fixture) => fixture.home === teamId || fixture.away === teamId);
}

function resultForFixture(matchday, fixture, result, teamId) {
  const teamIsHome = fixture.home === teamId;
  const opponentId = teamIsHome ? fixture.away : fixture.home;
  const teamScore = teamIsHome ? result.homeScore : result.awayScore;
  const opponentScore = teamIsHome ? result.awayScore : result.homeScore;
  const outcome = teamScore === opponentScore ? "D" : teamScore > opponentScore ? "W" : "L";

  return {
    matchday: matchday.number,
    date: matchday.date,
    dateLabel: formatMatchdayDate(matchday.date, { weekday: "short" }),
    opponentId,
    opponent: getSchoolDisplayName(opponentId),
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
  const opponentId = teamIsHome ? fixture.away : fixture.home;

  return {
    matchday: matchday.number,
    date: matchday.date,
    dateLabel: formatMatchdayDate(matchday.date, { weekday: "short" }),
    opponentId,
    opponent: getSchoolDisplayName(opponentId),
    homeAway: teamIsHome ? "Home" : "Away",
    kickoff: details.kickoff,
    venue: details.venue,
  };
}

export function getTeamSchedule(sport, teamId) {
  const completed = MATCHDAYS
    .map((matchday) => {
      const fixture = fixtureForTeam(matchday.fixtures, teamId);
      const result = getMatchResult(sport.id, matchday.number, fixture.home, fixture.away);
      return result ? resultForFixture(matchday, fixture, result, teamId) : null;
    })
    .filter(Boolean)
    .slice(-3)
    .reverse();

  const upcoming = MATCHDAYS
    .filter((matchday) => matchday.number >= CURRENT_MATCHDAY_NUMBER)
    .map((matchday) => {
      const fixture = fixtureForTeam(matchday.fixtures, teamId);
      if (getMatchResult(sport.id, matchday.number, fixture.home, fixture.away)) return null;
      return upcomingForFixture(matchday, fixture, sport, teamId);
    })
    .filter(Boolean)
    .slice(0, 3);

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
