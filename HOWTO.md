# The Dream Team — Tech Stack Explained

A complete tour of the technology underneath **The Dream Team**, from the
language up to how it gets served on the internet. For each piece: what it is,
*why* it's here, and *where* it's used in the codebase.

## The big picture

It's a **client-side static single-page application (SPA)**. That means:

- There is **no server** running the game logic and **no database**. Everything —
  the game rules, animations, sound, score-keeping — runs inside the visitor's
  web browser.
- The whole thing compiles down to three files: an `index.html`, one `.js`
  bundle, and one `.css` bundle. A static host just hands those files to the
  browser, and the browser does the rest.

This is why hosting is free and trivial: there's nothing to keep running.

```
Your TypeScript/React source ──(Vite build)──► dist/ (html + js + css) ──► GitHub Pages ──► Browser runs it
```

---

## 1. Language & type safety — TypeScript

**What it is:** TypeScript is JavaScript with a type system bolted on. You write
`.ts`/`.tsx` files; a compiler checks that data is used consistently, then strips
the types away to produce plain JavaScript that browsers understand.

**Why it's here:** It catches whole classes of bugs before the code ever runs.
For example, in `src/game/types.ts` we declare exactly what a `Player` is:

```ts
export interface Player {
  id: string;
  firstName: string;
  number: number;
  isWinner: boolean;
  team: TeamId;   // can only be "LLO" or "BOS"
  ...
}
```

Now if any code tries to read a property that doesn't exist, or assign a team
other than `"LLO"`/`"BOS"`, the compiler errors instead of silently misbehaving
at the party. The `npx tsc --noEmit` check is that compiler. It's configured in
`tsconfig.json` with `"strict": true`, the most rigorous setting.

---

## 2. Build tooling — Vite + npm

**npm** (Node Package Manager) downloads libraries (into `node_modules/`) and runs
scripts. `package.json` defines those:

- `npm run dev` → start the local development server
- `npm run build` → produce the deployable `dist/` folder
- The exact versions of every library are locked in `package-lock.json` so CI
  builds identically to your machine.

**Vite** (configured in `vite.config.ts`) is the build tool and dev server. It
does two jobs:

1. **In development:** serves the app instantly with **Hot Module Replacement** —
   saving a file updates the browser in milliseconds without a full reload.
2. **For production:** **bundles** all source files and libraries into one
   optimized, minified JavaScript file, "tree-shaking" away unused code (the
   `index-XXXX.js`, ~92 KB gzipped).

Under the hood Vite uses **esbuild** and **Rollup**; you don't interact with
those directly. `@vitejs/plugin-react` teaches Vite how to handle React's JSX.

The `base: "./"` line in `vite.config.ts` tells Vite to use **relative paths** for
assets, which is what makes it work under the `github.io/worldcup/` sub-folder.

---

## 3. The UI framework — React 18

**What it is:** React turns data into on-screen HTML and keeps the two in sync.
You write **components** (functions that return UI), and when data changes, React
efficiently re-renders only what changed.

**JSX** is the HTML-looking syntax inside the `.tsx` files (e.g.
`<div className="banner">`). It's not really HTML — it compiles to JavaScript
function calls. `react-dom` is the half of React that paints into the browser's
page; `src/main.tsx` attaches the app to the `<div id="root">`.

**How it's used here:** the app is a tree of components in `src/components/`:

```
App                       ← top-level orchestrator (src/App.tsx)
├── Pitch                 ← the green field + markings (SVG)
├── Player × up to 22     ← each footballer
├── Scoreboard            ← LLOYDS / BOS scores
├── Ball                  ← the flying football
├── Banner                ← welcome / winner banner
├── NameEntry             ← the input overlay
└── ResetButton           ← the corner reset
```

### State management — React's built-in `useReducer`

Rather than a separate state library (like Redux), the game uses React's own
**`useReducer`** hook. All game state — the players, scores, used numbers, current
phase — lives in one object, and a **reducer** function (`src/game/reducer.ts`) is
the *only* thing allowed to change it, via "actions" like `COMMIT` or `RESET`.
This makes the game's behaviour predictable and easy to reason about.

The game itself is a **state machine** (`src/App.tsx`) cycling through phases:
`NAME_ENTRY → BALL → RUNNING → BANNER → back to NAME_ENTRY`, with timers
(`setTimeout`) driving the transitions.

---

## 4. Animation & effects

### Framer Motion (`framer-motion`)

**What it is:** a React animation library. Instead of hand-writing animation
code, you use special `<motion.div>` elements and describe *states* — "start here,
animate to there" — and it handles the smooth motion, springs, and enter/exit
transitions.

**Where it's used:**

- The **ball** swelling across the screen (`src/components/Ball.tsx`) — its `x`,
  `y`, `scale`, and `rotate` are keyframed.
- The **banner** sliding down and fading (`src/components/Banner.tsx`).
- The **name panel** popping up from the bottom.
- `AnimatePresence` animates components *out* as they're removed — that's how the
  banner gracefully exits.

When the prompt sits idle for 20s with no name entered, an **idle showcase**
(driven by timers in `src/App.tsx`) re-runs the runner animation on random
players until someone types a name again.

### canvas-confetti (`canvas-confetti`)

**What it is:** a tiny, single-purpose library that draws confetti particles on an
HTML `<canvas>`. It's not React-aware — you just call a function.

**Where it's used:** `src/components/Banner.tsx` calls it in a loop when a
**winner** appears, raining coloured particles from the top of the screen.

### Plain CSS (`src/styles.css`)

Not everything needs a library. The pitch stripes, layout, the player's **running
leg animation**, and the reset button's **spinning arrow** are all hand-written
CSS (gradients, `@keyframes`, flexbox) — lightweight and run by the browser's
compositor.

---

## 5. Graphics — SVG (no library)

The players and the pitch aren't images — they're **SVG** (Scalable Vector
Graphics), drawn with shape primitives directly in the components.
`src/components/Player.tsx` builds each footballer from `<ellipse>` (head),
`<path>` (shirt), `<rect>` (shorts/legs), and `<text>` (the name and number on the
back).

**Why SVG matters here:** it's **resolution-independent**, so it stays razor-sharp
when projected on a big screen at any size. And because it's just markup, we can
**recolour the shirt** to each country's kit and **re-letter the back** instantly
per player — no need for dozens of pre-made images.

---

## 6. Sound — the Web Audio API + recorded samples

All sound is played through the browser's built-in **Web Audio API**
(`src/game/audio.ts`), which lets you build a signal chain from "nodes" (sample
players, gains, a compressor). Two real recorded samples drive it (both bundled
as `.ogg`, see `CREDITS.md`):

**Ambient crowd (always running).** A real **football-crowd recording**
(`src/assets/crowd.ogg`, CC BY 4.0) is decoded once and played on an endless
**loop** as the background bed. The recording's own dynamics provide the natural
swell and dissipation of a live match. It starts on the first interaction and runs
for the whole session.

**Vuvuzela fanfare (winners only).** When a **winner** lands, a real **vuvuzela
blast** (`src/assets/vuvuzela.ogg`, CC0) is played at its native pitch as a few
overlapping honks in two waves — so it sounds like a handful of fans blowing,
not a synthetic tone. (Non-winners just get the crowd.) Everything runs through a
compressor that acts as a soft limiter so the layers don't clip.

**Bundling the samples:** each `.ogg` is `import`ed in `audio.ts`, so Vite
fingerprints it and hands back a relative URL that works under the GitHub Pages
sub-path; the code `fetch`es and decodes it at startup.

One browser rule worth knowing: browsers **block audio until the user interacts**
with the page. That's why the sound "unlocks" on the first Enter keypress.

---

## 7. Other native browser APIs (no libraries)

- **localStorage** — the browser's small built-in key-value store. `src/App.tsx`
  saves the teams and scores there as text, so a page refresh restores the game.
  No database needed.
- **setTimeout / requestAnimationFrame** — standard browser timers that drive the
  phase transitions and the confetti loop.

---

## 8. Hosting & automation — GitHub Pages + GitHub Actions

- **GitHub Pages** is a free static file host. It serves the `dist/` folder over
  HTTPS at `mikeh7.github.io/worldcup/`.
- **GitHub Actions** (`.github/workflows/deploy.yml`) is the automation ("CI/CD")
  that, on every push, spins up a fresh Linux machine, runs `npm ci` +
  `npm run build`, and publishes the result to Pages.

---

## Dependency summary

From `package.json`. Note how few **runtime** dependencies there are — most of the
"stack" is build-time tooling that disappears before the browser ever sees it.

| Package | Role | Ships to the browser? |
|---|---|---|
| `react` + `react-dom` | UI framework | ✅ Yes |
| `framer-motion` | Animations | ✅ Yes |
| `canvas-confetti` | Confetti effect | ✅ Yes |
| `typescript` | Language / type-checking | ❌ Compiled away |
| `vite` + `@vitejs/plugin-react` | Build tool & dev server | ❌ Build-time only |
| `@types/*` | Type definitions for the above | ❌ Build-time only |

And the things that are **not** libraries at all — SVG, CSS, Web Audio,
localStorage — are built into every modern browser, which keeps the bundle small
and the hosting free.
