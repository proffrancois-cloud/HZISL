import assert from "node:assert/strict";
import test from "node:test";
import {
  buildRoundRobin,
  getFixturesForDivision,
  getKickoff,
  MATCHDAYS,
  TEAMS,
} from "../src/lib/schedule.js";

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
