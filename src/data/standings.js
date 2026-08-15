import { TEAMS } from "../lib/schedule.js";
import { getResultsThroughMatchday, RESULTS_BY_SPORT } from "./results.js";

function createEmptyRecord(team) {
  return {
    team,
    played: 0,
    won: 0,
    drawn: 0,
    lost: 0,
    goalsFor: 0,
    goalsAgainst: 0,
    redCards: 0,
  };
}

function applyResult(record, goalsFor, goalsAgainst, redCards) {
  record.played += 1;
  record.goalsFor += goalsFor;
  record.goalsAgainst += goalsAgainst;
  record.redCards += redCards ?? 0;

  if (goalsFor > goalsAgainst) record.won += 1;
  else if (goalsFor === goalsAgainst) record.drawn += 1;
  else record.lost += 1;
}

export function getStandings(
  sportId,
  throughMatchday = Number.POSITIVE_INFINITY,
  resultsBySport = RESULTS_BY_SPORT,
) {
  const records = new Map(TEAMS.map((team) => [team, createEmptyRecord(team)]));
  const results = getResultsThroughMatchday(sportId, throughMatchday, resultsBySport);

  for (const result of results) {
    const home = records.get(result.home);
    const away = records.get(result.away);
    if (!home || !away) continue;

    applyResult(home, result.homeScore, result.awayScore, result.homeRedCards);
    applyResult(away, result.awayScore, result.homeScore, result.awayRedCards);
  }

  return [...records.values()]
    .map((record) => ({
      ...record,
      points: record.won * 3 + record.drawn,
      goalDifference: record.goalsFor - record.goalsAgainst,
    }))
    .sort((first, second) => (
      second.points - first.points
      || second.goalDifference - first.goalDifference
      || second.goalsFor - first.goalsFor
      || TEAMS.indexOf(first.team) - TEAMS.indexOf(second.team)
    ))
    .map((record, index) => ({ ...record, position: index + 1 }));
}
