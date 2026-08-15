import { publicAsset } from "../lib/appPaths.js";

export const SCHOOLS = [
  {
    id: "HCAS",
    displayName: "HCAS",
    name: "Hsinchu County American School",
    mascot: "Lions",
    logoUrl: publicAsset("/schools/hcas.png"),
    logoSource: "https://www.hcas.tw/lion_pride/",
  },
  {
    id: "HIA",
    displayName: "HIA",
    name: "Hsinchu International Academy",
    mascot: "Hion the Lion",
    logoUrl: publicAsset("/schools/hia.png"),
    logoSource: "https://www.hia.com.tw/post/hia-hion-line-stickers-now-available",
  },
  {
    id: "PAS",
    displayName: "PAS",
    name: "Pacific American School",
    mascot: "Typhoons",
    logoUrl: publicAsset("/schools/pas.png"),
    logoSource: "https://www.pacificamerican.org/",
  },
  {
    id: "HIS",
    displayName: "HIS",
    name: "Hsinchu International School",
    mascot: "Bamboo Lions · TBC",
    logoUrl: publicAsset("/schools/his.png"),
    logoSource: "https://hdis.hc.edu.tw/",
  },
  {
    id: "HAS",
    displayName: "HAS",
    name: "Hsinchu American School",
    mascot: "Wolves",
    logoUrl: publicAsset("/schools/has.jpg"),
    logoSource: "https://has.hc.edu.tw/athletics",
  },
  {
    id: "KA",
    displayName: "Korrnell Academy",
    name: "Korrnell Academy",
    mascot: "Lions · TBC",
    logoUrl: publicAsset("/schools/korrnell.png"),
    logoSource: "https://www.korrnell.org/",
  },
];

export const SCHOOL_BY_ID = Object.fromEntries(SCHOOLS.map((school) => [school.id, school]));

export function getSchoolDisplayName(schoolId) {
  return SCHOOL_BY_ID[schoolId]?.displayName ?? schoolId;
}
