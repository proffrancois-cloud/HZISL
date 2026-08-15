import { publicAsset } from "../lib/appPaths.js";

const FOOTBALL_RULES = publicAsset("/documents/HZISL_Football_Rules_2026-27.docx");
const FOOTBALL_REPORT = publicAsset("/documents/HZISL_Official_Match_Report_Football_2026-27.docx");
const BASKETBALL_RULES = publicAsset("/documents/HZISL_Basketball_Rules_2026-27.docx");
const BASKETBALL_REPORT = publicAsset("/documents/HZISL_Official_Match_Report_Basketball_2026-27.docx");

export const SPORTS = [
  {
    id: "football-ms-boys",
    game: "football",
    level: "MS",
    gender: "Boys",
    title: "MS Boys Football",
    shortTitle: "MS Boys",
    rulesUrl: FOOTBALL_RULES,
    reportUrl: FOOTBALL_REPORT,
  },
  {
    id: "football-hs-boys",
    game: "football",
    level: "HS",
    gender: "Boys",
    title: "HS Boys Football",
    shortTitle: "HS Boys",
    rulesUrl: FOOTBALL_RULES,
    reportUrl: FOOTBALL_REPORT,
  },
  {
    id: "football-ms-girls",
    game: "football",
    level: "MS",
    gender: "Girls",
    title: "MS Girls Football",
    shortTitle: "MS Girls",
    rulesUrl: FOOTBALL_RULES,
    reportUrl: FOOTBALL_REPORT,
  },
  {
    id: "football-hs-girls",
    game: "football",
    level: "HS",
    gender: "Girls",
    title: "HS Girls Football",
    shortTitle: "HS Girls",
    rulesUrl: FOOTBALL_RULES,
    reportUrl: FOOTBALL_REPORT,
  },
  {
    id: "basketball-ms-boys",
    game: "basketball",
    level: "MS",
    gender: "Boys",
    title: "MS Boys Basketball",
    shortTitle: "MS Boys",
    rulesUrl: BASKETBALL_RULES,
    reportUrl: BASKETBALL_REPORT,
  },
  {
    id: "basketball-hs-boys",
    game: "basketball",
    level: "HS",
    gender: "Boys",
    title: "HS Boys Basketball",
    shortTitle: "HS Boys",
    rulesUrl: BASKETBALL_RULES,
    reportUrl: BASKETBALL_REPORT,
  },
  {
    id: "basketball-ms-girls",
    game: "basketball",
    level: "MS",
    gender: "Girls",
    title: "MS Girls Basketball",
    shortTitle: "MS Girls",
    rulesUrl: BASKETBALL_RULES,
    reportUrl: BASKETBALL_REPORT,
  },
  {
    id: "basketball-hs-girls",
    game: "basketball",
    level: "HS",
    gender: "Girls",
    title: "HS Girls Basketball",
    shortTitle: "HS Girls",
    rulesUrl: BASKETBALL_RULES,
    reportUrl: BASKETBALL_REPORT,
  },
];

export const GAME_DETAILS = {
  football: {
    label: "Football",
    logoUrl: publicAsset("/brand/hzisl-football.png"),
    hasCompetitions: true,
  },
  basketball: {
    label: "Basketball",
    logoUrl: publicAsset("/brand/hzisl-basketball.png"),
    hasCompetitions: true,
  },
  volleyball: {
    label: "Volleyball",
    logoUrl: publicAsset("/brand/hzisl-sports-library/hzisl-volleyball.png"),
    hasCompetitions: false,
  },
  "table-tennis": {
    label: "Ping Pong",
    logoUrl: publicAsset("/brand/hzisl-sports-library/hzisl-table-tennis.png"),
    hasCompetitions: false,
  },
  tennis: {
    label: "Tennis",
    logoUrl: publicAsset("/brand/hzisl-sports-library/hzisl-tennis.png"),
    hasCompetitions: false,
  },
  chess: {
    label: "Chess",
    logoUrl: publicAsset("/brand/hzisl-sports-library/hzisl-chess.png"),
    hasCompetitions: false,
  },
  badminton: {
    label: "Badminton",
    logoUrl: publicAsset("/brand/hzisl-sports-library/hzisl-badminton.png"),
    hasCompetitions: false,
  },
  baseball: {
    label: "Baseball",
    logoUrl: publicAsset("/brand/hzisl-sports-library/hzisl-baseball.png"),
    hasCompetitions: false,
  },
  fencing: {
    label: "Fencing",
    logoUrl: publicAsset("/brand/sports-library/islt-fencing.png"),
    hasCompetitions: false,
  },
};

export const SIDEBAR_GAMES = Object.keys(GAME_DETAILS);

export const SPORTS_BY_GAME = SPORTS.reduce((groups, sport) => {
  const group = groups[sport.game] ?? [];
  return { ...groups, [sport.game]: [...group, sport] };
}, {});

export const getSport = (sportId) =>
  SPORTS.find((sport) => sport.id === sportId);
