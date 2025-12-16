# Darts Score Tracker

A browser-based darts score tracking app built with TypeScript. We've built support for two-player 301 and 501 games with editable turns and full turn history.

## Features
- Two-player darts scoring for 301 and 501 games
- Turn-by-turn score tracking with running totals
- Edit previously entered scores or delete turns from the history
- Automatic score calculation and validation to prevent negative scores
- Simple, responsive UI for web browsers, clear display on both small and large windows

## Tech Stack
- Language: TypeScript
- Platform: Browser-based web app
- Build tools/framework: Typescript compiler (tsc), Git, VS Code
- Package manager: npm

## Prerequisites
- npm or yarn (installed globally)
- node.js

## Scripts
- `npm run build`: compile TypeScript to `dist/`
- `npm run dev`: start a dev server with live-reload
- `npm run lint`: run ESLint
- `npm run format`: run Prettier

## Improvements We've Made
- Enhanced `package.json` with convenient npm scripts
- Added `.gitignore` for Node projects
- Tightened `tsconfig.json` compiler settings (ES2020, strict mode)
- Configured ESLint and Prettier for code quality
- Set up GitHub Actions CI workflow

## Contributing
We welcome contributions! Please create a feature branch, make focused changes, and open a pull request.
