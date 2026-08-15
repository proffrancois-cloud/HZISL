export const TEAMS = ["HCAS", "HIS", "HAS", "LIFT", "TES", "TAS", "AST", "KCIS"];
export const SEASON_START = "2026-09-05";

const VENUE_AREAS = {
  football: { Boys: "Main Field", Girls: "Field 2" },
  basketball: { Boys: "Court 1", Girls: "Court 2" },
};

function addDays(dateISO, days) {
  const date = new Date(`${dateISO}T12:00:00+08:00`);
  date.setUTCDate(date.getUTCDate() + days);
  return date.toISOString().slice(0, 10);
}

export function buildRoundRobin(teams = TEAMS, seasonStart = SEASON_START) {
  if (teams.length % 2 !== 0) {
    throw new Error("The schedule requires an even number of teams.");
  }

  let rotation = [...teams];
  const firstLeg = [];

  for (let roundIndex = 0; roundIndex < teams.length - 1; roundIndex += 1) {
    const fixtures = [];

    for (let pairIndex = 0; pairIndex < teams.length / 2; pairIndex += 1) {
      const first = rotation[pairIndex];
      const second = rotation[rotation.length - 1 - pairIndex];
      const reverseHome = (roundIndex + pairIndex) % 2 === 1;
      fixtures.push({
        home: reverseHome ? second : first,
        away: reverseHome ? first : second,
      });
    }

    firstLeg.push({
      number: roundIndex + 1,
      date: addDays(seasonStart, roundIndex * 7),
      leg: "First leg",
      fixtures,
    });

    rotation = [rotation[0], rotation.at(-1), ...rotation.slice(1, -1)];
  }

  const secondLeg = firstLeg.map((round, index) => ({
    number: index + teams.length,
    date: addDays(seasonStart, (index + teams.length - 1) * 7),
    leg: "Return leg",
    fixtures: round.fixtures.map(({ home, away }) => ({ home: away, away: home })),
  }));

  return [...firstLeg, ...secondLeg];
}

export const MATCHDAYS = buildRoundRobin();

export function getKickoff(level) {
  return level === "MS" ? "08:00" : "09:30";
}

export function getVenue(homeTeam, game, gender) {
  return `${homeTeam} · ${VENUE_AREAS[game][gender]}`;
}

export function getFixturesForDivision(matchday, division) {
  return matchday.fixtures.map((fixture) => ({
    ...fixture,
    kickoff: getKickoff(division.level),
    venue: getVenue(fixture.home, division.game, division.gender),
  }));
}

export function getUpcomingMatchday(matchdays = MATCHDAYS, now = new Date()) {
  const today = new Intl.DateTimeFormat("en-CA", {
    timeZone: "Asia/Taipei",
    year: "numeric",
    month: "2-digit",
    day: "2-digit",
  }).format(now);

  return matchdays.find((matchday) => matchday.date >= today) ?? matchdays.at(-1);
}

export function formatMatchdayDate(dateISO, options = {}) {
  return new Intl.DateTimeFormat("en-GB", {
    timeZone: "Asia/Taipei",
    weekday: "long",
    day: "numeric",
    month: "short",
    ...options,
  }).format(new Date(`${dateISO}T12:00:00+08:00`));
}
