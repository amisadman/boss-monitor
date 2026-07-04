# Boss Monitor — React Frontend Dashboard

The user-facing client interface of the **Boss Monitor** office energy tracking system. It provides a real-time, interactive visual dashboard of the office rooms, device states, energy consumption, and policy alerts.

---

## Features

1. **Real-time Live Floorplan:**
   * Dynamic visual floorplan representing three rooms: **Drawing Room**, **Work Room 1**, and **Work Room 2**.
   * Instant color-coded indicators representing active/inactive relays (fans, lights) driven by WebSockets.
2. **Interactive Power Calculations:**
   * Live gauge showing current total power draw (Watts).
   * Daily aggregated energy metrics (kWh) and real-time cost projections (BDT).
3. **Historical Consumption Analytics:**
   * High-fidelity line/bar charts showing hourly consumption history over the past 24 simulated hours.
4. **Live Alerts Center:**
   * Proactive warning cards showing policy violations in real-time (e.g. after-hours active loads, prolonged-on rooms) pushed directly via Socket.io.

---

## Tech Stack

*   **Build Tool:** Vite (Fast Refresh & HMR)
*   **Language:** TypeScript
*   **UI Library:** React (v19)
*   **Styles:** Vanilla CSS (curated high-end typography and dark-theme aesthetics)
*   **WebSockets:** Socket.io-client

---

## Directory Structure

```
├── public/                # Static assets & icons
├── src/
│   ├── assets/            # SVG logos & layout assets
│   ├── App.css            # Custom responsive styles
│   ├── App.tsx            # Main dashboard component & WebSocket hook
│   ├── index.css          # Base style variables and resets
│   └── main.tsx           # React mounting configuration
├── package.json
└── tsconfig.json
```

---

## Getting Started

### Local Setup
1.  **Navigate to the client directory:**
    ```bash
    cd client
    ```
2.  **Install dependencies:**
    ```bash
    npm install
    ```
3.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    Open `http://localhost:5173` in your browser. The client will automatically connect to your locally running backend server (port 5000) and start rendering the real-time simulator ticks.
