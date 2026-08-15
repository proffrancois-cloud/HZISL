# ISLT

A Vite + React site for the International Schools League in Taiwan football and basketball divisions.

## Run locally

```bash
npm install
npm run dev
```

## Verify

```bash
npm run verify
```

## Edit the season

- Sports and labels: `src/data/sports.js`
- School names, mascots, and approved logos: `src/data/schools.js`
- Season start, current matchday, fixtures, venues, and Finals Day: `src/lib/schedule.js`
- Standings sample data: `src/data/standings.js`
- Organization content: `src/data/organization.js`
- ISLT visual identity: `public/brand/islt-main.png`, `islt-football.png`, and `islt-basketball.png`

Rules buttons are ready for PDF URLs. Add the PDFs under `public/rules/`, then set each sport's `rulesUrl` in `src/data/sports.js`.

School identity research is documented in `SCHOOL_SOURCES.md`. Keep `logoUrl` empty until each school has supplied or approved an asset for league use.

## Deploy on Vercel

Import this folder from GitHub in Vercel. The included `vercel.json` keeps direct links such as `/sports/football-ms-boys` working.
