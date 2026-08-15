export const RESULTS_BY_SPORT = {};

export function getMatchdayResults(
  sportId,
  matchdayNumber,
  resultsBySport = RESULTS_BY_SPORT,
) {
  return resultsBySport[sportId]?.[matchdayNumber] ?? [];
}

export function getMatchResult(
  sportId,
  matchdayNumber,
  home,
  away,
  resultsBySport = RESULTS_BY_SPORT,
) {
  return getMatchdayResults(sportId, matchdayNumber, resultsBySport)
    .find((result) => result.home === home && result.away === away) ?? null;
}

export function getResultsThroughMatchday(
  sportId,
  throughMatchday = Number.POSITIVE_INFINITY,
  resultsBySport = RESULTS_BY_SPORT,
) {
  const sportResults = resultsBySport[sportId] ?? {};

  return Object.entries(sportResults)
    .filter(([matchdayNumber]) => Number(matchdayNumber) <= throughMatchday)
    .flatMap(([matchdayNumber, results]) => (
      results.map((result) => ({ ...result, matchday: Number(matchdayNumber) }))
    ));
}
