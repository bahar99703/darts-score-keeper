# Darts Score Tracker

A browser-based darts score tracking app built with TypeScript. Supports two-player 301 and 501 games with editable turns and a full turn history.

## Features
- Two-player darts scoring for 301 and 501 games
- Turn-by-turn score tracking with running totals
- Edit previously entered scores or delete turns from history
- Automatic score calculation and validation to prevent negative scores
- Simple, responsive UI for web browsers

## Tech Stack
- Language: TypeScript
- Platform: Browser-based web app
- Build tools: TypeScript compiler (`tsc`)
- Package manager: npm
- Editor: VS Code (recommended)

## Prerequisites
- Node.js (v14+ recommended)
- npm or yarn

## Quick Start
1. Clone the repo and switch to the feature branch you're working on:
   - `git clone <repo-url>`
   - `git checkout feature/improvements` (or your feature branch)
2. Install dependencies:
   - `npm install`
3. Build:
   - `npm run build` (if configured)
4. Open `source.html` in your browser or use a simple static server.

## Scripts
(If `package.json` is updated these will be available)
- `npm run dev` : start a dev server (if added)
- `npm run build`: compile TypeScript to `dist/` (if configured)
- `npm start`    : production run (if applicable)
- `npm run lint` : run ESLint
- `npm run format`: run Prettier

## Project Files To Improve (Planned Improvements)
- `README.md`: convert to full markdown, add usage and planned changes (this file)
- `package.json`: add convenient `scripts` (`dev`, `build`, `start`, `lint`, `format`) and update `engines`/metadata
- `.gitignore` : add typical Node ignores (`node_modules/`, `dist/`, `.env`, etc.)
- `tsconfig.json`: tighten TypeScript settings (enable `strict`, set `outDir`, target `ES2019`/`ES2020`)
- `src/`:
  - `app.ts`: small refactors for clarity and stronger typings; ensure compiled output goes to `dist/`
  - Add small README or comments for key functions
- `styles.css` / `source.html`: minor UX/markup cleanup (accessibility, responsive tweaks)
- Lint & Format (optional): add `eslint` and `prettier` with configuration files and `devDependencies`
- CI (optional): add GitHub Actions workflow `.github/workflows/ci.yml` to run `npm ci`, `npm run build`, and `npm run lint` on PRs
- Tests (future): add a minimal test harness (Jest) for core scoring logic

## How You Can Help / Next Steps
- Confirm the branch to commit these docs to (you already created the branch — good).
- Confirm which planned improvements you want implemented now (I suggest: `package.json` scripts, `.gitignore`, `tsconfig.json`, and basic `eslint` + `prettier`).
- I will then prepare exact file diffs and the commands to apply, commit, and push changes.

## Contributing
- Create a branch for each significant change and open a PR.
- Keep changes small and focused (one feature/fix per branch).

## License
(If you want to add a license, tell me which one and I will add it.)

