import { publicAsset } from "./appPaths.js";
import { GAME_DETAILS } from "../data/sports.js";

function filenamePart(value) {
  return String(value).trim().replace(/[^A-Za-z0-9-]+/g, "_").replace(/^_+|_+$/g, "");
}

export function getMatchReportFilename(sport, matchday, fixture) {
  const game = GAME_DETAILS[sport.game]?.label ?? filenamePart(sport.game);
  const number = String(matchday.number).padStart(2, "0");
  const stem = [
    "HZISL",
    game,
    sport.level,
    sport.gender,
    `MD${number}`,
    matchday.date,
    `${fixture.home}_vs_${fixture.away}`,
    "Official_Match_Report_2026-27",
  ].map(filenamePart).join("_");
  return `${stem}.docx`;
}

export function getMatchReportLogicalPath(sport, matchday, fixture) {
  return `/documents/matches/${sport.id}/${getMatchReportFilename(sport, matchday, fixture)}`;
}

export function getMatchReportUrl(sport, matchday, fixture) {
  return publicAsset(getMatchReportLogicalPath(sport, matchday, fixture));
}
