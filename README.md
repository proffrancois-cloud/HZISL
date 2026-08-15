# HZISL

A Vite + React site for the Hsinchu–Zhubei International Schools League football, basketball, and volleyball divisions.

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
- Match results by sport and matchday: `src/data/results.js`
- Standings calculation: `src/data/standings.js`
- Organization content: `src/data/organization.js`
- HZISL visual identity: `public/brand/hzisl-main.png`, `hzisl-football.png`, `hzisl-basketball.png`, and the volleyball mark in `public/brand/hzisl-sports-library/`
- Additional sport artwork used by the sidebar empty states: `public/brand/hzisl-sports-library/`

The complete 2026–27 DOCX library lives under `public/documents/`. Sport pages download the relevant rules directly, and the Organization page lists all league documents and forms.

Each scheduled fixture has its own prefilled form under `public/documents/matches/<division>/`. Replace the placeholder coach and official names in `scripts/match_report_people.json`, then regenerate the schedule manifest and all 360 forms after editing teams, dates, or contacts:

```bash
npm run documents:manifest
python scripts/generate_match_reports.py
```

Use `python scripts/build_hzisl_documents.py --only football-rules basketball-rules volleyball-rules` to regenerate only the sport rules without replacing the retained organization annexes.

School identity research and the remaining mascot confirmations are documented in `SCHOOL_SOURCES.md`.

The season starts with empty results, so all standings statistics are zero. Add a result under its sport and matchday in `src/data/results.js`; selecting that matchday will show its score and recalculate the table through that date.

## Deploy on Vercel

Import this folder from GitHub in Vercel. The included `vercel.json` keeps direct links such as `/sports/football-ms-boys` working.
