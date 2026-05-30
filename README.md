# Flight Companion AI

Track flights and know exactly when to leave for the airport to pick up arriving passengers.

## Tech Stack

- **Next.js 15** (App Router)
- **React 19** + **TypeScript**
- **Tailwind CSS** (mobile-first, dark mode)
- **AeroDataBox** via RapidAPI (live flight data)
- **Vercel** deployment ready

## Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Add your RapidAPI key

Create `.env.local` in the project root (or copy from `.env.example`):

```bash
cp .env.example .env.local
```

Edit `.env.local` and paste your key:

```env
RAPIDAPI_KEY=your_actual_rapidapi_key_here
```

Get a key at [AeroDataBox on RapidAPI](https://rapidapi.com/aedbx-aedbx/api/aerodatabox).

**Important:** Restart the dev server after saving `.env.local`:

```bash
npm run dev
```

### 3. Optional — AI Arrival Assistant

```env
OPENAI_API_KEY=your_openai_api_key_here
```

Uses a local fallback if unset.

## Flight search

Enter a flight number (e.g. `DL123`, `KE35`, `AA250`) and your home address. Live data comes from AeroDataBox.

## Features

- **Pickup Planning** — drive time, leave-home time, safety buffer
- **Favorite flights** — saved locally
- **Email & SMS reminders** — simulated notifications
- **Airport weather** — mock conditions + buffer adjustment
- **Enhanced pickup tips** — curbside, terminal, parking
- Interactive **Leaflet** map
- **AI Arrival Assistant** (OpenAI optional)

## Deploy on Vercel

1. Push to GitHub and import in [Vercel](https://vercel.com).
2. Add environment variable: `RAPIDAPI_KEY`
3. Optionally add `OPENAI_API_KEY`.
4. Deploy.
