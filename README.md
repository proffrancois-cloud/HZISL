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
- Schools, season start, matchdays, and venues: `src/lib/schedule.js`
- Standings sample data: `src/data/standings.js`
- Organization content: `src/data/organization.js`

Rules buttons are ready for PDF URLs. Add the PDFs under `public/rules/`, then set each sport's `rulesUrl` in `src/data/sports.js`.

## Deploy on Vercel

Import this folder from GitHub in Vercel. The included `vercel.json` keeps direct links such as `/sports/football-ms-boys` working.
