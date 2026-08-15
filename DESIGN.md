# Design System

## Theme

Bright, restrained product UI for fast use on Saturday mornings. Taiwan flag blue, red, and white carry the shared league identity. Small plum-blossom details add a friendly local note without turning the product into a themed illustration.

## Color

- Canvas: `oklch(0.985 0.008 255)`
- Surface: `oklch(1 0 0)`
- Soft surface: `oklch(0.965 0.017 255)`
- Ink: `oklch(0.24 0.045 260)`
- Muted ink: `oklch(0.47 0.025 255)`
- Taiwan blue: `oklch(0.39 0.18 264)`
- Taiwan blue dark: `oklch(0.29 0.145 264)`
- Taiwan red: `oklch(0.58 0.22 27)`
- Soft red: `oklch(0.955 0.04 27)`
- Success: `oklch(0.54 0.13 155)`

## Typography

Use Inter when available, then the system sans-serif stack. Keep one type family throughout. Page titles use 30px/700 on desktop and 26px on mobile. UI labels use 12px/700 only when short. Tables use 13–14px with tabular numerals.

## Layout

- Desktop: 248px fixed navigation rail and a flexible content pane.
- Mobile: compact top bar and an off-canvas navigation drawer.
- Content width: 1440px maximum.
- Home: News first, then logo-only Football and Basketball disclosure controls, then the school directory.
- Competition page: standings and matchday panel in a 3:2 split, stacking below 1000px.
- Spacing scale: 4, 8, 12, 16, 24, 32, 48.

## Components

- Navigation rows are 44px minimum with a clear selected state.
- Each sport name in the navigation opens its own category list; sports without a season show a plain, non-clickable empty state.
- Buttons and selects are 40px minimum, 10px radius, and use a strong focus ring.
- Panels use either a quiet border or a compact shadow, never both.
- Tables keep the team column sticky on narrow screens and allow horizontal scroll.
- Match rows use typographic alignment and a small time block instead of decorative cards.
- Rules and organization actions use text-and-icon chips with explicit labels.
- Contacts use a dedicated navigation item nested under Organization.
- Schools use a compact logo, acronym, and mascot row with a single expandable competition summary and a coordinator email link.
- Finals Day appears only as the final option in each matchday selector.
- The general HZISL mascot logo anchors the app shell and favicon; the football and basketball variants identify their competition groups and detail pages.

## Motion

Use 160–200ms ease-out transitions for drawer, selection, and disclosure state only. Remove translation and smooth scrolling when reduced motion is requested.
