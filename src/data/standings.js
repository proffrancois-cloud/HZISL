import { TEAMS } from "../lib/schedule.js";

const RECORDS = [
  { played: 6, won: 4, drawn: 1, lost: 1, goalsFor: 15, goalsAgainst: 7, redCards: 0 },
  { played: 6, won: 4, drawn: 0, lost: 2, goalsFor: 14, goalsAgainst: 8, redCards: 1 },
  { played: 6, won: 3, drawn: 2, lost: 1, goalsFor: 12, goalsAgainst: 7, redCards: 0 },
  { played: 6, won: 3, drawn: 1, lost: 2, goalsFor: 10, goalsAgainst: 8, redCards: 0 },
  { played: 6, won: 2, drawn: 2, lost: 2, goalsFor: 9, goalsAgainst: 9, redCards: 1 },
  { played: 6, won: 2, drawn: 0, lost: 4, goalsFor: 8, goalsAgainst: 12, redCards: 0 },
  { played: 6, won: 1, drawn: 1, lost: 4, goalsFor: 6, goalsAgainst: 14, redCards: 2 },
  { played: 6, won: 0, drawn: 1, lost: 5, goalsFor: 4, goalsAgainst: 13, redCards: 0 },
];

const TEAM_ORDERS = [
  ["HCAS", "TAS", "TES", "HIS", "AST", "KCIS", "HAS", "LIFT"],
  ["TAS", "HCAS", "HIS", "TES", "KCIS", "AST", "LIFT", "HAS"],
  ["TES", "HIS", "HCAS", "TAS", "AST", "HAS", "KCIS", "LIFT"],
  ["HCAS", "TES", "AST", "TAS", "HIS", "LIFT", "KCIS", "HAS"],
  ["HIS", "TAS", "HCAS", "KCIS", "TES", "AST", "HAS", "LIFT"],
  ["TAS", "TES", "HCAS", "AST", "HIS", "HAS", "LIFT", "KCIS"],
  ["HCAS", "AST", "TES", "HIS", "TAS", "KCIS", "LIFT", "HAS"],
  ["TES", "HCAS", "TAS", "HIS", "KCIS", "AST", "HAS", "LIFT"],
];

export function getStandings(sportId) {
  const seed = [...sportId].reduce((total, character) => total + character.charCodeAt(0), 0);
  const teamOrder = TEAM_ORDERS[seed % TEAM_ORDERS.length];

  return teamOrder.map((team, index) => {
    const record = RECORDS[index];
    return {
      position: index + 1,
      team,
      ...record,
      points: record.won * 3 + record.drawn,
      goalDifference: record.goalsFor - record.goalsAgainst,
    };
  }).filter((row) => TEAMS.includes(row.team));
}
