import { getSchoolDisplayName } from "../data/schools.js";

export const TEAMS = ["HCAS", "HIA", "PAS", "HIS", "HAS", "KA"];
export const SEASON_START = "2026-09-05";
export const CURRENT_MATCHDAY_NUMBER = 1;

const VENUE_AREAS = {
  football: { Boys: "Main Field", Girls: "Field 2" },
  basketball: { Boys: "Court 1", Girls: "Court 2" },
  volleyball: { Boys: "Volleyball Court 1", Girls: "Volleyball Court 2" },
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

export const FINALS_DAY = {
  date: addDays(SEASON_START, MATCHDAYS.length * 7),
  title: "HZISL Finals Day",
  status: "Planning",
  note: "6-school knockout format to confirm",
};

export function getKickoff(level) {
  return level === "MS" ? "09:00" : "10:30";
}

export function getVenue(homeTeam, game, gender) {
  return `${getSchoolDisplayName(homeTeam)} · ${VENUE_AREAS[game][gender]}`;
}

export function getFixturesForDivision(matchday, division) {
  return matchday.fixtures.map((fixture) => ({
    ...fixture,
    kickoff: getKickoff(division.level),
    venue: getVenue(fixture.home, division.game, division.gender),
  }));
}

export function getUpcomingMatchday(matchdays = MATCHDAYS, currentNumber = CURRENT_MATCHDAY_NUMBER) {
  return matchdays.find((matchday) => matchday.number === currentNumber) ?? matchdays.at(-1);
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
