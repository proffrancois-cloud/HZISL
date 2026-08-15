import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRoundRobin,
  FINALS_DAY,
  getFixturesForDivision,
  getKickoff,
  MATCHDAYS,
  TEAMS,
} from "../src/lib/schedule.js";
import { GAME_DETAILS, SIDEBAR_GAMES, SPORTS } from "../src/data/sports.js";
import { getStandings } from "../src/data/standings.js";
import { getSchoolCompetitionOverview, getTeamSchedule } from "../src/lib/teamData.js";

test("builds 10 matchdays with three fixtures each", () => {
  assert.equal(MATCHDAYS.length, 10);
  for (const matchday of MATCHDAYS) assert.equal(matchday.fixtures.length, 3);
});

test("each team meets every opponent once home and once away", () => {
  const meetings = new Map();

  for (const matchday of MATCHDAYS) {
    for (const fixture of matchday.fixtures) {
      const key = [fixture.home, fixture.away].sort().join("-");
      const record = meetings.get(key) ?? [];
      record.push(fixture);
      meetings.set(key, record);
    }
  }

  assert.equal(meetings.size, (TEAMS.length * (TEAMS.length - 1)) / 2);
  for (const fixtures of meetings.values()) {
    assert.equal(fixtures.length, 2);
    assert.equal(fixtures[0].home, fixtures[1].away);
    assert.equal(fixtures[0].away, fixtures[1].home);
  }
});

test("every matchday is a Saturday", () => {
  for (const matchday of MATCHDAYS) {
    const day = new Date(`${matchday.date}T12:00:00+08:00`).getUTCDay();
    assert.equal(day, 6);
  }
});

test("MS and HS pairings share the schedule and venue with a 90 minute offset", () => {
  const scheduleA = buildRoundRobin();
  const scheduleB = buildRoundRobin();
  const msFixtures = getFixturesForDivision(MATCHDAYS[0], {
    level: "MS",
    game: "football",
    gender: "Boys",
  });
  const hsFixtures = getFixturesForDivision(MATCHDAYS[0], {
    level: "HS",
    game: "football",
    gender: "Boys",
  });

  assert.deepEqual(scheduleA, scheduleB);
  assert.equal(getKickoff("MS"), "09:00");
  assert.equal(getKickoff("HS"), "10:30");
  assert.deepEqual(
    msFixtures.map(({ home, away, venue }) => ({ home, away, venue })),
    hsFixtures.map(({ home, away, venue }) => ({ home, away, venue })),
  );
});

test("plans Finals Day one Saturday after Matchday 10", () => {
  const lastMatchday = MATCHDAYS.at(-1);
  const lastDate = new Date(`${lastMatchday.date}T12:00:00+08:00`);
  const finalsDate = new Date(`${FINALS_DAY.date}T12:00:00+08:00`);

  assert.equal(finalsDate.getUTCDay(), 6);
  assert.equal((finalsDate - lastDate) / 86_400_000, 7);
  assert.match(FINALS_DAY.note, /6-school/);
});

test("keeps future sports in the navigation without competitions", () => {
  const futureGames = SIDEBAR_GAMES.filter((game) => !GAME_DETAILS[game].hasCompetitions);

  assert.deepEqual(futureGames, [
    "volleyball",
    "table-tennis",
    "tennis",
    "chess",
    "badminton",
    "baseball",
    "fencing",
  ]);
  assert.ok(futureGames.every((game) => GAME_DETAILS[game].logoUrl));
});

test("provides recent and upcoming fixtures for a selected team", () => {
  const schedule = getTeamSchedule(SPORTS[0], "HCAS");

  assert.equal(schedule.completed.length, 0);
  assert.equal(schedule.upcoming.length, 3);
  assert.ok(schedule.upcoming.every((match) => match.opponent !== "HCAS"));
});

test("starts every standings statistic at zero", () => {
  const standings = getStandings(SPORTS[0].id, 1);

  assert.equal(standings.length, TEAMS.length);
  for (const row of standings) {
    assert.equal(row.points, 0);
    assert.equal(row.played, 0);
    assert.equal(row.won, 0);
    assert.equal(row.drawn, 0);
    assert.equal(row.lost, 0);
    assert.equal(row.goalDifference, 0);
    assert.equal(row.redCards, 0);
  }
});

test("calculates standings only from results through the selected matchday", () => {
  const sportId = SPORTS[0].id;
  const results = {
    [sportId]: {
      1: [{ home: "HCAS", away: "HIA", homeScore: 2, awayScore: 1 }],
      2: [{ home: "PAS", away: "HCAS", homeScore: 0, awayScore: 0 }],
    },
  };

  const afterMatchdayOne = getStandings(sportId, 1, results);
  const afterMatchdayTwo = getStandings(sportId, 2, results);

  assert.equal(afterMatchdayOne.find((row) => row.team === "HCAS").points, 3);
  assert.equal(afterMatchdayOne.find((row) => row.team === "PAS").played, 0);
  assert.equal(afterMatchdayTwo.find((row) => row.team === "HCAS").points, 4);
  assert.equal(afterMatchdayTwo.find((row) => row.team === "PAS").played, 1);
});

test("provides one ranking and next match for every school division", () => {
  const overview = getSchoolCompetitionOverview("PAS");

  assert.equal(overview.length, SPORTS.length);
  assert.ok(overview.every(({ position, nextMatch }) => position >= 1 && nextMatch.opponent));
});
