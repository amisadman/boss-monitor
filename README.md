# Boss Monitor — Smart Office Energy Tracker

Boss Monitor is a real-time energy monitoring and alert system designed for modern smart offices. The project implements a unified Express + TypeScript backend that serves as the single source of truth, synchronizing a real-time React Dashboard and a Conversational Discord Bot.

---

## 1. System Architecture

```
┌─────────────────────┐
│  Simulator Module   │  (Runs inside backend on a 10s interval)
│  - virtual-time 120x│
│  - 15 devices state │
└──────────┬──────────┘
           │ Writes to
           ▼
┌─────────────────────┐        ┌──────────────────────┐
│   MongoDB           │◄──────►│  Express Backend API  │
│  (device states,    │        │  - REST Endpoints    │
│   alerts history,   │        │  - Socket.io Server  │
│   usage snapshots)  │        │  - Alert Engine      │
└─────────────────────┘        └───────┬──────┬───────┘
                                       │      │
                      Socket.io push   │      │   REST calls / polls
                                       ▼      ▼
                        ┌────────────────┐  ┌────────────────────┐
                        │React Dashboard │  │ Python Discord Bot │
                        │- Floorplan animation- !status command  │
                        │- Real-time power    - !usage command   │
                        │- Alerts panel        - Proactive alerts │
                        └────────────────┘  └────────────────────┘
```

---

## 2. Directory Structure

```
├── backend/
│   ├── src/
│   │   ├── app.ts                 # Express app configurations
│   │   ├── server.ts              # Server startup & socket connection
│   │   ├── config/                # Database connections
│   │   ├── database/              # Device seeding scripts
│   │   ├── middleware/            # Error handling & Zod validators
│   │   ├── modules/               # Modular features (device, alert, usage, simulator)
│   │   ├── scripts/               # verify-simulation integration test script
│   │   └── utils/                 # Socket, catchAsync, response helpers
│   ├── Dockerfile                 # Multi-stage production build
│   └── package.json
├── client/                        # React Frontend Dashboard
├── .gitignore                     # Root-level ignores
└── README.md                      # This documentation
```

---

## 3. Tech Stack

*   **Runtime:** Node.js (v20+)
*   **Language:** TypeScript
*   **Framework:** Express.js
*   **Real-time Communication:** Socket.io (v4)
*   **Database ODM:** Mongoose (MongoDB)
*   **Validation:** Zod
*   **Development Tools:** ts-node-dev, typescript compiler

---

## 4. Getting Started

### Local Installation
1.  **Prerequisites:** Ensure Node.js and MongoDB are installed locally.
2.  **Navigate to backend directory:**
    ```bash
    cd backend
    ```
3.  **Install dependencies:**
    ```bash
    npm install
    ```
4.  **Configure environment variables:**
    Create a `.env` file from `.env.example`:
    ```env
    PORT=5000
    MONGO_URI=mongodb://localhost:27017/boss-monitor
    SIMULATOR_CLOCK_SPEED=120
    SIMULATOR_TICK_RATE_MS=10000
    NODE_ENV=development
    ```
5.  **Run Development Server:**
    ```bash
    npm run dev
    ```
    *Note: The server will automatically seed the 15 initial devices into MongoDB on first startup.*

6.  **Run Automated Integration Tests:**
    ```bash
    npm run test:simulation
    ```

---

## 5. API Reference

*   **Production Live API Base URL:** [https://boss-monitor.onrender.com](https://boss-monitor.onrender.com)
*   **Local Development Base URL:** `http://localhost:5000`

All REST endpoints return standardized payloads in the following format:
```json
{
  "status": 200,
  "success": true,
  "message": "Description",
  "data": { ... }
}
```

### Endpoints

*   **`GET /`**
    Returns server details, client details, health status, and backend uptime.
*   **`GET /api/devices`**
    Fetches all 15 office devices (supports sorting/filtering via `QueryBuilder`).
*   **`GET /api/devices/rooms/:room`**
    Fetches all devices in a specific room (`DrawingRoom`, `WorkRoom1`, `WorkRoom2`).
*   **`GET /api/usage`**
    Fetches the live room-wise wattage breakdown, projected daily kWh, estimated daily costs (BDT), and current simulated clock time.
*   **`GET /api/usage/history`**
    Retrieves the last 50 usage snapshots (used to populate the main dashboard line chart).
*   **`GET /api/usage/hourly`**
    Retrieves aggregated room-by-room averages for the last 24 simulated hours (dynamically aligned to the simulator clock).
*   **`GET /api/alerts`**
    Fetches active and historical alerts (triggered by rule violations).
*   **`POST /api/alerts/:id/ack`**
    Acknowledges an alert to prevent Discord message notification spam.
*   **`POST /api/simulator/device`**
    Manually overrides a device status (`on` or `off`), triggers instant Socket.io updates, and re-evaluates rules.
    *   *Payload:* `{ "deviceId": "drawing-fan-1", "status": "on" }`
*   **`POST /api/simulator/time`**
    Jumps the simulator's virtual clock to a specific hour (0-23) to test transition rule changes.
    *   *Payload:* `{ "hour": 17 }`

---

## 6. Socket.io Events

*   **`device:update`**
    Emitted every `10s` (on every simulator tick). Sends the latest status of all 15 devices, current simulated time, and power consumption statistics.
*   **`alert:new`**
    Emitted immediately when an alert triggers (e.g. device left on after-hours).
*   **`alert:resolved`**
    Emitted immediately when an alert condition is resolved.

---

## 7. Simulator & Alert Logic

The simulator runs inside the backend process on an interval of `10 seconds` (real-time).
*   **Virtual Clock:** Accelerated at `120x` (1 real second = 120 simulated seconds; 30 real seconds = 1 simulated hour). Starts at **8:00 AM** on launch.
*   **Office Hours (9 AM - 5 PM):** Devices have an 80% baseline chance of being active.
*   **After Hours (5 PM - 9 AM):** Devices have a 10% baseline chance. The simulator guarantees at least 1-2 devices remain active in the office to ensure alerts fire for the demo.
*   **Special Demo Rule:** All devices in `work1` are forced to stay ON between 10:00 AM and 1:00 PM simulated time to guarantee that the `prolonged-on` alert (triggered when a room's devices are ON for >2 simulated hours) fires and resolves automatically during presentation runs.

---

## 8. Hardware / ESP32 Controller Simulations

For details on wiring standards, pinout configurations, and the C++ firmware, refer to the [Wokwi Hardware Simulation Guide](../wokwi/README.md).

### Live Wokwi Simulation Projects

| Room | Wokwi Project Simulation URL |
| :--- | :--- |
| **Drawing Room** | [Drawing Room Simulation](https://wokwi.com/projects/468547829392730113) |
| **Work Room 1** | [Work Room 1 Simulation](https://wokwi.com/projects/468601813237379073) |
| **Work Room 2** | [Work Room 2 Simulation](https://wokwi.com/projects/468602256710643713) |

### ESP32 Pin-Mapping (Standardized)

| Component | ESP32 GPIO | Description |
| :--- | :--- | :--- |
| **Fan 1 Relay** | `GPIO 16` | Active HIGH Relay Control |
| **Fan 2 Relay** | `GPIO 17` | Active HIGH Relay Control |
| **Light 1 Relay** | `GPIO 18` | Active HIGH Relay Control |
| **Light 2 Relay** | `GPIO 19` | Active HIGH Relay Control |
| **Light 3 Relay** | `GPIO 21` | Active HIGH Relay Control |
| **ACS712 Output** | `GPIO 34 (VP)` | Potentiometer input simulating analog current |

### Current Sensor Simulation Calculation
At 0 Amps, the simulated ACS712 current sensor outputs `1.65V` (half of Vcc). The firmware reads this analog voltage and calculates:
$$\text{Current (Amps)} = \frac{|\text{Sensor Voltage} - 1.65\text{V}|}{0.185\text{V/A}}$$
$$\text{Power (Watts)} = \text{Current (Amps)} \times 220\text{V (Bangladesh AC Mains)} $$
