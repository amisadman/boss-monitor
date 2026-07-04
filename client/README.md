# Boss Monitor — Client

A single-page React + TypeScript client built with Vite for the Boss Monitor project. This app connects to the Boss Monitor backend to display office devices, usage graphs, and live alerts over WebSockets.

## Features

- Dashboard showing device list and statuses

- Real-time alerts via Socket.IO

- Usage graphs (hourly and aggregate) using Recharts

- Simulator controls (time travel) for demo data

- Visual representation of the environment in 2 modes - Furnished & Circuit

## Tech stack

- React 19 + TypeScript

- Vite for dev server and build

- Socket.IO client for realtime alerts

- Recharts for charts

- TailwindCSS + DaisyUI for styling

## Quick start

Prerequisites:

- Node.js 18+ (recommended)

- npm or yarn

Install and run locally:

```bash

cd  client

npm  install

npm  run  dev

```

Build for production:

```bash

cd  client

npm  run  build

npm  run  preview  # serve the built app locally

```

## Environment variables

The client reads Vite environment variables prefixed with `VITE_`. Create a `.env` file in the `client/` folder or set the variables in your CI/CD system.

Common variables used by the client:

- `VITE_API_URL` — Base URL for the backend (HTTP and Socket.IO). Default in repo: `https://boss-monitor.onrender.com`.

Example `client/.env`:

```env

VITE_API_URL="https://boss-monitor.onrender.com"

```

Notes:

- Vite exposes these variables as `import.meta.env.VITE_API_URL` in the code. Do not prefix with `REACT_APP` or `process.env` — use `VITE_`.

## Available scripts

Run these from the `client/` folder.

- `npm run dev` — Start Vite dev server with HMR

- `npm run build` — Type-check and build production bundle

- `npm run preview` — Preview production build locally

- `npm run lint` — Run ESLint across the codebase

You can run them with npm or yarn (e.g. `npm run dev`).

## How the client talks to the backend

- REST endpoints (examples used in the code):

- `${import.meta.env.VITE_API_URL}/api/devices` — device list

- `${import.meta.env.VITE_API_URL}/api/usage` — usage data

- `${import.meta.env.VITE_API_URL}/api/alerts` — alerts and ack endpoints

- `${import.meta.env.VITE_API_URL}/api/simulator/time` — simulator time control

- Socket.IO: `client/src/socket.ts` connects using `io(import.meta.env.VITE_API_URL)` to receive live alerts.

When developing locally, point `VITE_API_URL` to your running backend (for example `http://localhost:5000`).

## Developer notes

- Main entry: `src/main.tsx`

- Key components:

- `src/components/AlertsPanel.tsx` — alert list and acknowledgement

- `src/components/OfficeDevices.tsx` — visual device list (fans & lights) and statuses

- `src/components/UsageGraph.tsx` — charts for usage

- `src/socket.ts` — Socket.IO client singleton

- If you change TypeScript compiler options, `npm run build` runs `tsc -b` before building with Vite.

## Troubleshooting

- If the app cannot reach the API, verify `VITE_API_URL` and CORS settings on the backend.

- If real-time alerts don't arrive, confirm the backend Socket.IO server is reachable and using compatible Socket.IO versions.

- ESLint errors: run `npm run lint` and follow the fixes suggested by the linter.

## Contributing

1. Fork the repo and create a feature branch.

2. Follow existing code patterns and TypeScript types in `src/types.ts`.

3. Run the dev server and add tests or manual verification steps for UI changes.

4. Open a PR with a clear description and screenshots if applicable.

## License

This client follows the repository's license. Check the project root `README.md` for license details.

## Contact

If you need help running the client, open an issue in the main repository or reach out to the project maintainer.
