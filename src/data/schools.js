export const SCHOOLS = [
  {
    id: "HCAS",
    name: "Hsinchu County American School",
    mascot: "Lions",
    logoUrl: null,
    logoSource: "https://www.hcas.tw/",
  },
  {
    id: "HIS",
    name: "Hsinchu International School",
    mascot: "Bamboo Lions",
    logoUrl: null,
    logoSource: "https://hdis.hc.edu.tw/",
  },
  {
    id: "HAS",
    name: "Hsinchu American School",
    mascot: "Wolves",
    logoUrl: null,
    logoSource: "https://has.hc.edu.tw/athletics",
  },
  {
    id: "LIFT",
    name: "Lycée International Français de Taipei",
    mascot: "Mascot TBC",
    logoUrl: null,
    logoSource: "https://lift.tw/",
  },
  {
    id: "TES",
    name: "Taipei European School",
    mascot: "Formosan Bears",
    logoUrl: null,
    logoSource: "https://www.tes.tp.edu.tw/student-life/sports",
  },
  {
    id: "TAS",
    name: "Taipei American School",
    mascot: "Tigers",
    logoUrl: null,
    logoSource: "https://www.tas.edu.tw/athletics",
  },
  {
    id: "AST",
    name: "American School in Taichung",
    mascot: "Eagles",
    logoUrl: null,
    logoSource: "https://www.astaichung.com/",
  },
  {
    id: "KCIS",
    name: "Kang Chiao International School",
    mascot: "Four Guardians · TBC",
    logoUrl: null,
    logoSource: "https://www.kcis.ntpc.edu.tw/_KangChiao/zh/Badge-Song.html",
  },
];

export const SCHOOL_BY_ID = Object.fromEntries(SCHOOLS.map((school) => [school.id, school]));
