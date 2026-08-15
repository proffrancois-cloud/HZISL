import { publicAsset } from "../lib/appPaths.js";

export const CONTACTS = [
  { role: "HZISL coordinator", school: "HZISL", email: "TEST@hzislcoordinator.com" },
  { role: "HCAS referent", school: "HCAS", email: "TEST@hcaslions.com" },
  { role: "HIA referent", school: "HIA", email: "TEST@hiahionthelion.com" },
  { role: "PAS referent", school: "PAS", email: "TEST@pastyphoons.com" },
  { role: "HIS referent", school: "HIS", email: "TEST@hisbamboolions.com" },
  { role: "HAS referent", school: "HAS", email: "TEST@haswolves.com" },
  { role: "Korrnell Academy referent", school: "KA", email: "TEST@korrnelllions.com" },
];

export const CONTACT_BY_SCHOOL = Object.fromEntries(
  CONTACTS.map((contact) => [contact.school, contact]),
);

export const DOCUMENTS = [
  {
    title: "Competition Handbook & Operating Statutes",
    type: "Handbook + annexes",
    url: publicAsset("/documents/HZISL_Competition_Handbook_2026-27.docx"),
  },
  {
    title: "Host a Game Guide",
    type: "Annex A",
    url: publicAsset("/documents/HZISL_Host_a_Game_Guide_2026-27.docx"),
  },
  {
    title: "School Participation Agreement",
    type: "Annex B",
    url: publicAsset("/documents/HZISL_School_Participation_Agreement_2026-27.docx"),
  },
  {
    title: "Team Roster & Eligibility Declaration",
    type: "Annex C",
    url: publicAsset("/documents/HZISL_Team_Roster_and_Eligibility_2026-27.docx"),
  },
  {
    title: "Official Match Report Template",
    type: "Annex D",
    url: publicAsset("/documents/HZISL_Official_Match_Report_Template_2026-27.docx"),
  },
  {
    title: "Incident, Injury & Disciplinary Report",
    type: "Operational form",
    url: publicAsset("/documents/HZISL_Incident_Injury_Disciplinary_Report_2026-27.docx"),
  },
];
