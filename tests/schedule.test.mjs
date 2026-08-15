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
import { SPORTS } from "../src/data/sports.js";
import { getSchoolCompetitionOverview, getTeamSchedule } from "../src/lib/teamData.js";

test("builds 14 matchdays with four fixtures each", () => {
  assert.equal(MATCHDAYS.length, 14);
  for (const matchday of MATCHDAYS) assert.equal(matchday.fixtures.length, 4);
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
  assert.equal(getKickoff("MS"), "08:00");
  assert.equal(getKickoff("HS"), "09:30");
  assert.deepEqual(
    msFixtures.map(({ home, away, venue }) => ({ home, away, venue })),
    hsFixtures.map(({ home, away, venue }) => ({ home, away, venue })),
  );
});

test("plans Finals Day one Saturday after Matchday 14 with seeded quarter-finals", () => {
  const lastMatchday = MATCHDAYS.at(-1);
  const lastDate = new Date(`${lastMatchday.date}T12:00:00+08:00`);
  const finalsDate = new Date(`${FINALS_DAY.date}T12:00:00+08:00`);

  assert.equal(finalsDate.getUTCDay(), 6);
  assert.equal((finalsDate - lastDate) / 86_400_000, 7);
  assert.deepEqual(FINALS_DAY.matchups, [
    { seedA: 1, seedB: 8 },
    { seedA: 2, seedB: 7 },
    { seedA: 3, seedB: 6 },
    { seedA: 4, seedB: 5 },
  ]);
});

test("provides recent and upcoming fixtures for a selected team", () => {
  const schedule = getTeamSchedule(SPORTS[0], "HCAS");

  assert.equal(schedule.completed.length, 3);
  assert.equal(schedule.upcoming.length, 3);
  assert.ok(schedule.completed.every((match) => match.opponent !== "HCAS"));
  assert.ok(schedule.upcoming.every((match) => match.opponent !== "HCAS"));
});

test("provides one ranking and next match for every school division", () => {
  const overview = getSchoolCompetitionOverview("TES");

  assert.equal(overview.length, SPORTS.length);
  assert.ok(overview.every(({ position, nextMatch }) => position >= 1 && nextMatch.opponent));
});
