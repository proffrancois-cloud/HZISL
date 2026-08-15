export const SPORTS = [
  {
    id: "football-ms-boys",
    game: "football",
    level: "MS",
    gender: "Boys",
    title: "MS Boys Football",
    shortTitle: "MS Boys",
    rulesUrl: null,
  },
  {
    id: "football-hs-boys",
    game: "football",
    level: "HS",
    gender: "Boys",
    title: "HS Boys Football",
    shortTitle: "HS Boys",
    rulesUrl: null,
  },
  {
    id: "football-ms-girls",
    game: "football",
    level: "MS",
    gender: "Girls",
    title: "MS Girls Football",
    shortTitle: "MS Girls",
    rulesUrl: null,
  },
  {
    id: "football-hs-girls",
    game: "football",
    level: "HS",
    gender: "Girls",
    title: "HS Girls Football",
    shortTitle: "HS Girls",
    rulesUrl: null,
  },
  {
    id: "basketball-ms-boys",
    game: "basketball",
    level: "MS",
    gender: "Boys",
    title: "MS Boys Basketball",
    shortTitle: "MS Boys",
    rulesUrl: null,
  },
  {
    id: "basketball-hs-boys",
    game: "basketball",
    level: "HS",
    gender: "Boys",
    title: "HS Boys Basketball",
    shortTitle: "HS Boys",
    rulesUrl: null,
  },
  {
    id: "basketball-ms-girls",
    game: "basketball",
    level: "MS",
    gender: "Girls",
    title: "MS Girls Basketball",
    shortTitle: "MS Girls",
    rulesUrl: null,
  },
  {
    id: "basketball-hs-girls",
    game: "basketball",
    level: "HS",
    gender: "Girls",
    title: "HS Girls Basketball",
    shortTitle: "HS Girls",
    rulesUrl: null,
  },
];

export const SPORTS_BY_GAME = SPORTS.reduce((groups, sport) => {
  const group = groups[sport.game] ?? [];
  return { ...groups, [sport.game]: [...group, sport] };
}, {});

export const getSport = (sportId) =>
  SPORTS.find((sport) => sport.id === sportId);
