# The Dream Team ⚽

A World Cup-themed party game designed to be projected on a big screen at a
social gathering. Players take turns entering their first name; the game gives
each a famous footballer surname, a national kit, a squad number, and slots them
into one of two teams (**LLO** and **BOS**) on a green pitch. Number `1` is the
golden ticket — those players are **Winners** and score a point for their team.

## Running locally

```bash
npm install
npm run dev      # http://localhost:5173
```

Open the URL on the machine driving the projector and press **F11** (or your
browser's fullscreen) for a clean kiosk display.

## How it plays

1. An overlay prompts **"Enter your name >"** — up to 12 letters, press **Enter**.
2. A football flies in from the left, swells to cover the screen, then falls away
   to the right revealing the new player on the pitch.
3. The player jogs side-to-side, then stops as a banner drops in:
   - normal number (2–22): **"Welcome <name>"**
   - number 1: bold **"WINNER"** + a **"Welcome <name>"** sub-banner + confetti,
     and the player's team scores a point.
4. The name overlay returns and the loop repeats.
5. Once both teams are full (22 players), each new player randomly **replaces**
   an existing one (with the same ball animation).

A crowd cheer (synthesised in-browser, no audio files needed) plays each time a
player lands on the pitch — louder for winners. Audio unlocks on the first
Enter press, per browser autoplay rules.

Game state persists to `localStorage`, so an accidental refresh won't wipe the
party — the teams and scores are restored exactly. To start over, press the
**circular-arrow reset button** in the bottom-right corner (it clears saved
state and restarts), or run `localStorage.clear()` in the browser console.

## Tuning

All the dials live in small, obvious files:

| What | Where |
| --- | --- |
| Winner odds (default 10%) | `src/game/types.ts` → `WINNER_ODDS` |
| Animation / banner timings | `src/game/timing.ts` |
| Footballer roster | `src/data/footballers.ts` |
| Country kit colours | `src/data/kits.ts` |
| Formation / positions | `src/game/formation.ts` |
| Team names & colours (LLOYDS / BOS) | `src/game/teams.ts` |
| Crowd cheer sound | `src/game/audio.ts` |

## Deploying

It's a static site — `npm run build` produces a `dist/` folder you can drop on
any static host (Cloudflare Pages, Vercel, Netlify, GitHub Pages).

### GitHub Pages (automated)

This repo ships a GitHub Actions workflow ([`.github/workflows/deploy.yml`](.github/workflows/deploy.yml))
that builds the app and publishes it to GitHub Pages on every push to `main`.
Vite's `base` is set to `./` (relative) in `vite.config.ts`, so it works under
the `username.github.io/<repo>/` sub-path with no repo-name hardcoding.

One-time setup:

1. Create a repo on GitHub and push this project to it:
   ```bash
   git remote add origin https://github.com/<you>/<repo>.git
   git branch -M main
   git push -u origin main
   ```
2. On GitHub: **Settings → Pages → Build and deployment → Source = GitHub Actions**.
3. The workflow runs automatically on that push (watch the **Actions** tab). When
   it finishes, your game is live at `https://<you>.github.io/<repo>/`.

After that, every `git push` to `main` rebuilds and redeploys. You can also
trigger it manually from the **Actions** tab (the workflow allows `workflow_dispatch`).

> Open the URL on the projector machine and press **F11** for fullscreen kiosk mode.

## Tech

React + Vite + TypeScript, Framer Motion (overlays/banners/ball),
`canvas-confetti` (celebrations), SVG players & pitch. No backend.
