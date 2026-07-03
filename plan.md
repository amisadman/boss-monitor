# Lights, Fans, Discord — Project Plan

**Team:** Sadman (backend), Samin (frontend), Thousif (Discord bot)
**Time budget:** 24 hours
**Repo:** single monorepo

---

## 1. Architecture Overview

```
┌─────────────────────┐
│  Simulator Module    │  (lives inside backend, runs on interval)
│  - time-of-day aware │
│  - mutates 18 devices│
└──────────┬───────────┘
           │ writes to
           ▼
┌─────────────────────┐        ┌──────────────────────┐
│   MongoDB             │◄──────►│   Express Backend API  │
│   (device state,      │        │   - REST endpoints    │
│    alert log)         │        │   - Socket.io server  │
└─────────────────────┘        │   - Alert evaluator    │
                                 └───────┬──────┬────────┘
                                         │      │
                        Socket.io push   │      │  REST polls / calls
                                         ▼      ▼
                          ┌─────────────────┐  ┌────────────────────┐
                          │ React Dashboard   │  │ Python Discord Bot   │
                          │ (Samin)           │  │ (Thousif)            │
                          │ - live panel      │  │ - !status !room !usage│
                          │ - power meter     │  │ - Groq LLM phrasing   │
                          │ - alerts panel    │  │ - proactive alert push │
                          │ - animated layout │  │                        │
                          └─────────────────┘  └────────────────────┘
```

**Single source of truth:** MongoDB, mutated only by the simulator + backend. Both the dashboard (via Socket.io) and the bot (via REST) read from the same Express API — never from each other, never with separate state.

**Why this shape:** it satisfies the doc's explicit requirement — `[Simulated Device Layer] → [Backend API] → [Web UI] && [Discord Bot]` — directly, and keeps alert-evaluation logic in exactly one place (backend), consumed by both frontend and bot, instead of duplicated.

---

## 2. Data Model

### `Device` (MongoDB collection, 18 documents, seeded once)

| Field | Type | Example |
|---|---|---|
| `_id` | ObjectId | auto |
| `deviceId` | string | `"drawing-fan-1"` |
| `type` | enum | `"fan"` \| `"light"` |
| `room` | enum | `"drawing"` \| `"work1"` \| `"work2"` |
| `label` | string | `"Fan 1"`, `"Light 3"` |
| `status` | enum | `"on"` \| `"off"` |
| `wattage` | number | fan: 60, light: 15 (drawn only when `status = "on"`) |
| `lastChanged` | ISODate | timestamp of last toggle |
| `onSince` | ISODate \| null | set when turned on, cleared when turned off — used for "on >2h" alert |

### `Alert` (MongoDB collection, append-only log)

| Field | Type | Notes |
|---|---|---|
| `_id` | ObjectId | |
| `type` | enum | `"after-hours"` \| `"prolonged-on"` |
| `scope` | string | device ID or room name |
| `message` | string | human-readable |
| `triggeredAt` | ISODate | |
| `resolvedAt` | ISODate \| null | null while still active |
| `notifiedDiscord` | boolean | dedup flag so the bot doesn't re-spam the same alert |

**Assumption (flag if wrong):** "resolved" means the underlying condition stopped being true (e.g., device turned off, or time moved back into office hours) — not manually dismissed. Confirm as a team; affects both the dashboard panel and the bot's dedup logic.

---

## 3. Simulator Design (time-of-day aware)

Runs as a `setInterval` inside the backend process (every 10–15s), not a separate service — simplest thing that works in 24 hours.

Logic sketch:
- Maintain a probability of a device being ON based on simulated "current time" (you can either use real wall-clock time, or — safer for demoing alerts on stage — a **simulated clock that runs faster than real time**, e.g. 1 simulated hour per 30 real seconds, so a 24h cycle plays out in ~12 minutes. **Decide this as a team before building** — real-time is more "honest" but means you may never see an after-hours alert during a 3-minute demo video unless you record at night. Recommend the accelerated simulated clock.)
- During "office hours" (9–5 simulated): higher probability of devices being ON, occasional toggles to look alive.
- After hours: most devices should trend toward OFF, but **deliberately leave 1–2 devices ON** in one room so the after-hours alert has something to catch on every demo run — otherwise your alert panel might be empty by chance and you lose that criterion's visible payoff.
- Every toggle updates `lastChanged` and `onSince`/clears it.
- After every simulation tick, run alert evaluation (see below) and emit a Socket.io `device:update` event with the full device list + power totals.

**Validation approach:** write one simple test script that runs the simulator for a compressed loop (e.g., simulate 48 hours in a few seconds) and asserts that at least one after-hours alert and one prolonged-on alert get generated — this de-risks "alerts panel is empty during the actual judged demo."

---

## 4. Alert Evaluation Logic (lives in backend, shared)

Two conditions, checked every tick:
1. **After-hours:** any device with `status = "on"` while simulated time is outside 9 AM–5 PM.
2. **Prolonged-on:** a room where *all* devices have been continuously on for >2 hours (`onSince` older than 2h for every device in that room).

Output: upsert into `Alert` collection (avoid duplicate open alerts for the same condition), emit `alert:new` over Socket.io, and expose `GET /api/alerts` for the bot to poll.

---

## 5. API Contract (backend owns this — Sadman drafts first, share by hour 3)

### REST
| Method | Path | Returns |
|---|---|---|
| GET | `/api/devices` | all 18 devices, grouped or flat (confirm shape with Samin) |
| GET | `/api/rooms/:room` | devices for one room (`drawing`, `work1`, `work2`) |
| GET | `/api/usage` | `{ totalWattsNow, perRoomWatts: {...}, estimatedKwhToday }` |
| GET | `/api/alerts` | active + recent alerts |

### Socket.io events (server → client)
| Event | Payload |
|---|---|
| `device:update` | full device snapshot, on every simulator tick |
| `alert:new` | single alert object, on trigger |

No client → server events needed for MVP (read-only dashboard). If you want manual device toggling as a stretch feature, add `device:toggle` — **not in scope per the doc**, skip unless time remains at the very end.

---

## 6. Discord Bot Commands (Thousif)

| Command | Backend call | LLM step |
|---|---|---|
| `!status` | `GET /api/devices` | Groq turns grouped counts into the friendly sentence from the doc example |
| `!room <name>` | `GET /api/rooms/:name` | same |
| `!usage` | `GET /api/usage` | same |

**Pattern:** fetch real data first, then pass a small structured summary (not raw JSON dump) into the Groq prompt with an instruction like "phrase this office status update in one friendly sentence, no markdown." This keeps the LLM call cheap (small token count → stays well inside free-tier TPM) and guarantees the numbers are real, not hallucinated.

**Proactive alerts:** background task (`discord.ext.tasks.loop`, e.g. every 30–60s) polling `GET /api/alerts` for alerts where `notifiedDiscord = false`; post to a designated channel, then PATCH/flag as notified (add a small `POST /api/alerts/:id/ack` endpoint, or simplest: bot tracks seen alert IDs in memory since it's a single bot instance for the demo).

**Fallback:** if Groq call fails/rate-limits, fall back to a plain f-string template — never let a command go silent during the demo.

---

## 7. Frontend (Samin)

- React + Socket.io-client, subscribe to `device:update` and `alert:new` on mount.
- Layout: SVG office floorplan (reuse doc's top-view style) with 18 device icons keyed by `deviceId`.
- motion.dev on each device icon: animate glow (light) or rotation (fan) driven by `status` from socket state — no local polling, purely reactive to pushed state.
- Live Device Status Panel: simple grouped list by room, redundant with the visual layout but required explicitly by the doc — keep it, judges may scan it faster than the graphic.
- Power meter: total + per-room, recomputed from the same socket payload (don't wait on a second fetch).
- Alerts panel: renders from `alert:new` events + an initial `GET /api/alerts` on load, timestamped.

---

## 8. Hardware/Electrical Schematic (Sadman + Thousif can split this, ~2hr task)

Not a live-data component — a standalone conceptual deliverable. Represent **one room** (say Work Room 1: 2 fans, 3 lights) on an ESP32.

**Design reasoning:**
- Lights and fans in a real office run on mains AC — an ESP32 GPIO can't switch them directly. Use a **relay module** per device (5 relays for one room) — ESP32 GPIO drives the relay's control pin (3.3V logic, most relay boards accept this), relay's NO/COM contacts switch the AC line to the device.
- To *sense* on/off state (not just command it), wire each relay's control line back to a GPIO configured as input, or use the relay module's status feedback if it has one — this is what lets the ESP32 report real state rather than assuming it matches the last command sent.
- For the optional current-sensing bonus, add one **ACS712** (or **INA219** for I2C simplicity) on the shared line feeding the room, giving actual wattage rather than a fixed assumed value.

**Example pin-mapping table (Work Room 1, ESP32):**

| Device | Relay control pin (ESP32 GPIO) | Notes |
|---|---|---|
| Fan 1 | GPIO 16 | drives relay 1 IN |
| Fan 2 | GPIO 17 | drives relay 2 IN |
| Light 1 | GPIO 18 | drives relay 3 IN |
| Light 2 | GPIO 19 | drives relay 4 IN |
| Light 3 | GPIO 21 | drives relay 5 IN |
| Current sensor (room total) | GPIO 34 (ADC) | ACS712 analog out, or GPIO 22/23 (SDA/SCL) if using INA219 |

All relay modules share ESP32 3.3V + GND for logic side; AC side wired through mains to each device, with the relay's COM/NO breaking the live wire — standard relay safety practice (never switch neutral only).

**Build this in Wokwi** (ESP32 + relay module components are both in its library): place the ESP32, 5 relay modules, and one ACS712, wire per the table above, and write minimal placeholder firmware that just toggles GPIOs on a timer so the simulation visibly shows relay clicks — you don't need it to talk to your real backend. Export a screenshot + the shareable Wokwi project link for the repo/report; per your constraints I won't generate the Wokwi JSON for you — build it directly in their browser editor using the table above, it's mostly drag-and-drop once the pins are decided.

---

## 9. System Diagram (deliverable #1, non-Mermaid)

Use draw.io / Excalidraw / a hand-drawn photo — anything but Mermaid. Should visually walk through exactly the flow in §1 of this doc: Simulated Device Layer → Backend (Mongo + Socket.io) → fan-out to Web UI and Discord Bot → end user in browser / end user in Discord. Include the Groq call as a labeled side-branch off the bot. This can be done by whoever finishes their core task first — good hour-20-ish filler task, don't front-load it.

---

## 10. Task Breakdown & 24-Hour Timeline

| Hours | Sadman (Backend) | Samin (Frontend) | Thousif (Bot) |
|---|---|---|---|
| 0–1 | Team aligns on API contract (§5) and data model (§2) together | | |
| 1–4 | Mongo schema + seed script (18 devices) | Scaffold React app, static layout with dummy JSON (no socket yet) | Scaffold discord.py bot, `.env` + Groq key test call |
| 4–8 | Simulator module + time-of-day logic (§3); add cost-estimate field (§12.4) to `/api/usage` | Build device status panel + power meter against static data | Implement `!status`, `!room`, `!usage` against **mocked** backend responses |
| 8–10 | Alert evaluator (§4) + REST endpoints live; append wattage snapshots for usage-history (§12.3) | Wire Socket.io client, swap static data for live feed | Point bot at real backend REST endpoints, wire Groq phrasing in + rich embeds (§12.1) |
| 10–13 | Socket.io server emitting `device:update`/`alert:new` | Alerts panel UI + SVG office layout skeleton | Proactive alert polling loop (§6); add `!ask <question>` command (§12.2) |
| 13–17 | Buffer / bugfixes, help frontend with socket edge cases | motion.dev animations on layout (glow/spin); usage-over-time chart (§12.3) if ahead of schedule | Bot alert dedup + fallback templating, polish message tone |
| 17–19 | **Integration testing** — all 3 pieces talking to one running backend, together in one room | | |
| 19–21 | System diagram + Wokwi schematic (split between Sadman/Thousif; Samin can start README) | | |
| 21–23 | README, setup instructions, repo cleanup, commit hygiene | | |
| 23–24 | Record 3-minute demo video | | |

**Buffer built in deliberately at hour 13–17 and 17–19** — integration bugs between three people's independently-mocked pieces are the single biggest risk in a 24h hackathon; don't skip that joint session even if each piece looks "done" solo.

---

## 11. Open Assumptions to Confirm as a Team (flagging per engineering process, not deciding unilaterally)

1. Simulated clock speed for the demo (real-time vs. accelerated) — recommend accelerated, confirm.
2. Alert "resolved" semantics (§2) — confirm auto-resolve vs. manual.
3. Whether `GET /api/devices` returns flat array or pre-grouped by room — decide once, before Samin and Thousif both start consuming it, to avoid a rework pass.
4. Whether the bot needs a persistent "seen alerts" store or in-memory is fine (in-memory is fine for a single-instance demo bot — confirm no one's planning to restart it mid-demo).

---

## 12. Stretch Goals (beyond required scope, prioritized by impact-per-hour)

Scope decision: **#7 (two-way device control) and #8 (occupancy-aware alerts) are explicitly cut** — both add new write paths / new simulator state and risk destabilizing the core deliverable this close to the deadline. The four below are cheap because they reuse pipes you're already building; slot them into the existing task blocks in §10 rather than treating them as a separate late-stage sprint.

### 13.1 Rich Discord embeds (Thousif, ~30 min, folded into hour 8–10)
Swap plain-text `channel.send()` calls for `discord.Embed` objects — color-coded by severity (green = all-off, red = active after-hours alert), one field per room. Near-zero marginal cost since the data's already structured; meaningfully raises perceived bot polish in the demo video.

### 13.2 `!ask <question>` free-form command (Thousif, ~30–45 min, folded into hour 10–13)
Reuses the same Groq call pattern as `!status`/`!usage` — stuff current device + usage JSON as context, let the user ask anything ("which room uses the most power?"). This is the strongest "wow" move for judges because it visibly demonstrates LLM reasoning over real data rather than templated phrasing. Same fallback rule applies: if Groq fails, respond with "couldn't process that right now, try `!status` or `!usage`" rather than going silent.

### 13.3 Usage-over-time chart (Samin, ~1hr, only if ahead of schedule at hour 13–17)
Backend appends each `device:update` tick's total wattage to an array or small Mongo collection (§10, folded into hour 8–10 backend work); frontend renders it with `recharts` as a line chart. Directly reinforces two graded criteria at once — dashboard visuals *and* "quality of dummy data simulation," since it makes the simulator's time-of-day behavior visibly demonstrable rather than just claimed in the README.

### 13.4 Cost estimate in local currency (Sadman, ~15 min, folded into hour 4–8)
Multiply `estimatedKwhToday` by a plausible BDT/kWh tariff, expose as an extra field on `/api/usage`, surface next to the kWh figure on the dashboard and in `!usage`. Trivial to build, strong narrative payoff — it's the number the boss character in the problem statement would actually care about.

**Not committing to (only if genuinely ahead of schedule after hour 19):**
- Daily AI-generated insight/summary ("Work Room 2 tends to leave lights on past closing") — needs persisted multi-day history, more than a one-liner.
- Alert-triggered flash/toast animation on the dashboard reusing motion.dev — nice, but only after §13.3 and core polish are done.

---

## 13. Repo Structure (recap)

```
/backend
/frontend
/discord-bot
/diagrams
README.md
plan.md   (this file)
```
