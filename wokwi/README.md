# Wokwi Hardware Simulation Guide

This folder contains the complete schematics and firmware files to simulate the hardware nodes for **Drawing Room**, **Work Room 1**, and **Work Room 2** using the ESP32 devkit on [Wokwi](https://wokwi.com/).

---

## 1. Live Wokwi Projects

You can open the pre-configured simulations directly from these links:

| Room | Wokwi Project Link |
| :--- | :--- |
| **Drawing Room** | [https://wokwi.com/projects/468547829392730113](https://wokwi.com/projects/468547829392730113) |
| **Work Room 1** | [https://wokwi.com/projects/468601813237379073](https://wokwi.com/projects/468601813237379073) |
| **Work Room 2** | [https://wokwi.com/projects/468602256710643713](https://wokwi.com/projects/468602256710643713) |

---

## 2. Files Structure

These files are maintained on the **`backend` branch** of the GitHub repository:

*   **Firmwares (C++ Code):**
    *   [room1.ino](https://github.com/amisadman/boss-monitor/blob/backend/wokwi/room1.ino) — Drawing Room Firmware
    *   [room2.ino](https://github.com/amisadman/boss-monitor/blob/backend/wokwi/room2.ino) — Work Room 1 Firmware
    *   [drawing.ino](https://github.com/amisadman/boss-monitor/blob/backend/wokwi/drawing.ino) — Work Room 2 Firmware
*   **Schematics (Wokwi Canvas Layouts):**
    *   [room1_diagram.json](https://github.com/amisadman/boss-monitor/blob/backend/wokwi/room1_diagram.json) — Drawing Room Schematic
    *   [room2_diagram.json](https://github.com/amisadman/boss-monitor/blob/backend/wokwi/room2_diagram.json) — Work Room 1 Schematic
    *   [drawing_diagram.json](https://github.com/amisadman/boss-monitor/blob/backend/wokwi/drawing_diagram.json) — Work Room 2 Schematic

---

## 3. Pinout Configuration
All rooms utilize the exact same GPIO pin configuration on the ESP32 DevKit V4:
*   **Fan 1 Relay Control:** `GPIO 16`
*   **Fan 2 Relay Control:** `GPIO 17`
*   **Light 1 Relay Control:** `GPIO 18`
*   **Light 2 Relay Control:** `GPIO 19`
*   **Light 3 Relay Control:** `GPIO 21`
*   **Simulated ACS712 Current Sensor Input:** `GPIO 34 (VP)`

---

## 4. How to Import into an Existing Wokwi Project
If you want to use the project files from GitHub to update an existing Wokwi project:
1.  Go to your Wokwi project and open the **`diagram.json`** tab.
2.  Clear the contents and paste the JSON from the matching diagram file on GitHub (e.g., `room1_diagram.json`).
3.  Open the main code tab (e.g., `sketch.ino`), clear it, and paste the contents of the matching `.ino` firmware file.
4.  Click **Play/Start Simulation** to run.

---

## 5. Serial Monitor Output (JSON)
Each firmware outputs a structured JSON payload to the Serial Monitor every **5 seconds**:
```json
{
  "room": "DrawingRoom",
  "devices": [
    { "deviceId": "drawing-fan-1",   "status": "on" },
    { "deviceId": "drawing-fan-2",   "status": "off" },
    { "deviceId": "drawing-light-1", "status": "on" },
    { "deviceId": "drawing-light-2", "status": "off" },
    { "deviceId": "drawing-light-3", "status": "off" }
  ],
  "currentAmps": 0.63,
  "totalWatts": 138.60
}
```

---

## 6. Features & Wiring Standards
*   **Left-Aligned Labels:** The visual LEDs have clear uppercase tags placed on their left side (`FAN 1 (G16)`, `LIGHT 1 (G18)`, etc.) for professional and readable presentations.
*   **Standard Wiring Colors:**
    *   Supply Power lines: **Red** (VCC) / **Black** (GND).
    *   Simulated AC Live lines: **Brown** (COM rails / NO loads).
    *   Simulated AC Neutral returns: **Blue** (LED return lines).
    *   Analog inputs: **Gray** (Potentiometer slider).
