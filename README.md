# PickFlow — ASML Warehouse Picking Simulation

A browser-based simulation tool for planning warehouse picking workload across machine build programs.

## Features

- **Picks per build matrix** — define how many picks each machine type requires per storage location
- **Non-machine baseline tasks** — fixed daily picks per storage type that always consume capacity
- **Work distribution** — spread picking demand across months following a machine start
- **Carry-over queue** — picks exceeding daily capacity automatically roll to the next day
- **Day-by-day simulation** — 365-day timeline with bar chart and heat map views
- **Backlog tracking** — see exactly when and where capacity is exceeded and by how much
- **Monthly overview** — aggregate demand, processed, backlog days per month

## Getting Started

### Prerequisites

- Node.js 18+
- npm 9+

### Install & run

```bash
npm install
npm run dev
```

Open [http://localhost:5173](http://localhost:5173) in your browser.

### Build for production

```bash
npm run build
```

Output goes to `dist/`. The `base: './'` setting in `vite.config.js` makes it work on GitLab Pages sub-paths.

## GitLab Pages deployment (optional)

Add `.gitlab-ci.yml` to the repo root:

```yaml
pages:
  image: node:20
  script:
    - npm ci
    - npm run build
    - mv dist public
  artifacts:
    paths:
      - public
  only:
    - main
```

Push to `main` → GitLab automatically deploys to `https://<group>.gitlab.io/<project>/`.

## Project structure

```
src/
  App.jsx              # Root component & layout
  main.jsx             # React entry point
  constants.js         # All default values
  simulation.js        # Pure simulation logic (no React)
  styles.js            # All CSS as a JS string
  hooks/
    useAppState.js     # All state management
  components/
    ConfigView.jsx     # Configuration tab
    SimView.jsx        # Simulation results tab
    Tooltip.jsx        # Floating tooltip
```

## Simulation logic

Each day, capacity is allocated in priority order:

1. **Baseline picks** (non-machine tasks) — always processed first
2. **Carried-over backlog** from previous days — cleared before new demand
3. **New machine picks** — filled with remaining capacity

Anything not processed that day is added to the next day's backlog.

## License

Internal ASML tool — not for distribution.
