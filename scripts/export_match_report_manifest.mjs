import { mkdir, writeFile } from "node:fs/promises";
import { fileURLToPath } from "node:url";
import path from "node:path";
import { SCHOOL_BY_ID } from "../src/data/schools.js";
import { SPORTS } from "../src/data/sports.js";
import { getMatchReportFilename } from "../src/lib/matchReports.js";
import { getFixturesForDivision, MATCHDAYS } from "../src/lib/schedule.js";

const scriptDirectory = path.dirname(fileURLToPath(import.meta.url));
const projectRoot = path.resolve(scriptDirectory, "..");
const outputDirectory = path.join(projectRoot, "public", "documents", "matches");
const outputPath = path.join(outputDirectory, "manifest.json");

const matches = SPORTS.flatMap((sport) => MATCHDAYS.flatMap((matchday) => (
  getFixturesForDivision(matchday, sport).map((fixture) => ({
    sportId: sport.id,
    sport: sport.game,
    level: sport.level,
    gender: sport.gender,
    competition: sport.title,
    matchday: matchday.number,
    leg: matchday.leg,
    date: matchday.date,
    kickoff: fixture.kickoff,
    venue: fixture.venue,
    home: fixture.home,
    homeSchool: SCHOOL_BY_ID[fixture.home]?.name ?? fixture.home,
    away: fixture.away,
    awaySchool: SCHOOL_BY_ID[fixture.away]?.name ?? fixture.away,
    filename: getMatchReportFilename(sport, matchday, fixture),
  }))
)));

await mkdir(outputDirectory, { recursive: true });
await writeFile(outputPath, `${JSON.stringify({ season: "2026-27", matches }, null, 2)}\n`, "utf8");
console.log(`Wrote ${matches.length} match reports to ${outputPath}`);
