# Design System

## Theme

Bright, restrained product UI for fast use on Saturday mornings. True white and cool blue-gray surfaces carry the interface; HCAS navy is the main action and selection color, with school gold used sparingly for live or upcoming emphasis. Red is reserved for disciplinary data and errors.

## Color

- Canvas: `oklch(0.985 0.004 255)`
- Surface: `oklch(1 0 0)`
- Soft surface: `oklch(0.965 0.008 255)`
- Ink: `oklch(0.24 0.045 260)`
- Muted ink: `oklch(0.47 0.025 255)`
- HCAS navy: `oklch(0.36 0.135 264)`
- HCAS navy dark: `oklch(0.285 0.115 264)`
- HCAS gold: `oklch(0.84 0.145 92)`
- Discipline red: `oklch(0.56 0.2 25)`
- Success: `oklch(0.54 0.13 155)`

## Typography

Use Inter when available, then the system sans-serif stack. Keep one type family throughout. Page titles use 30px/700 on desktop and 26px on mobile. UI labels use 12px/700 only when short. Tables use 13–14px with tabular numerals.

## Layout

- Desktop: 248px fixed navigation rail and a flexible content pane.
- Mobile: compact top bar and an off-canvas navigation drawer.
- Content width: 1440px maximum.
- Sport overview: two grouped lists, not an identical tile grid.
- Competition page: standings and matchday panel in a 3:2 split, stacking below 1000px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48.

## Components

- Navigation rows are 44px minimum with a clear selected state.
- Buttons and selects are 40px minimum, 10px radius, and use a strong focus ring.
- Panels use either a quiet border or a compact shadow, never both.
- Tables keep the team column sticky on narrow screens and allow horizontal scroll.
- Match rows use typographic alignment and a small time block instead of decorative cards.
- Rules and organization actions use text-and-icon chips with explicit labels.

## Motion

Use 160–200ms ease-out transitions for drawer, selection, and disclosure state only. Remove translation and smooth scrolling when reduced motion is requested.
