export const WELCOME_STEPS = [
  { time: "07:15", label: "Open the venue and check access" },
  { time: "07:30", label: "Prepare field, court, water, and first aid" },
  { time: "07:45", label: "Welcome teams and confirm changing areas" },
  { time: "08:00", label: "Start MS fixtures" },
  { time: "09:30", label: "Start HS fixtures" },
  { time: "After", label: "Confirm scores and disciplinary notes" },
];

export const CONTACTS = [
  { role: "ISLT coordinator", school: "ISLT", email: "TEST@isltcoordinator.com" },
  { role: "HCAS referent", school: "HCAS", email: "TEST@hcaslions.com" },
  { role: "HIS referent", school: "HIS", email: "TEST@hisbamboolions.com" },
  { role: "HAS referent", school: "HAS", email: "TEST@haswolves.com" },
  { role: "LIFT referent", school: "LIFT", email: "TEST@liftmascottbc.com" },
  { role: "TES referent", school: "TES", email: "TEST@tesformosanbears.com" },
  { role: "TAS referent", school: "TAS", email: "TEST@tastigers.com" },
  { role: "AST referent", school: "AST", email: "TEST@asteagles.com" },
  { role: "KCIS referent", school: "KCIS", email: "TEST@kcisfourguardians.com" },
];

export const DOCUMENTS = [
  "MS Football",
  "HS Football",
  "MS Basketball",
  "HS Basketball",
  "Host a game",
  "ISLT general rules",
  "ISLT agreement",
].map((title) => ({ title, url: null }));
