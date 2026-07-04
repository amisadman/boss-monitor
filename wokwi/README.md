# Wokwi Hardware Simulation Guide

This folder contains the complete schematics and firmware files to simulate the hardware nodes for **Drawing Room**, **Work Room 1**, and **Work Room 2** using the ESP32 devkit on [Wokwi](https://wokwi.com/).

---

## 1. Files Structure
*   **Firmwares (C++ Code):**
    *   [room1.ino](file:///d:/Coading/hackathon/boss-monitor/wokwi/room1.ino) (Work Room 1 Firmware)
    *   [room2.ino](file:///d:/Coading/hackathon/boss-monitor/wokwi/room2.ino) (Work Room 2 Firmware)
    *   [drawing.ino](file:///d:/Coading/hackathon/boss-monitor/wokwi/drawing.ino) (Drawing Room Firmware)
*   **Schematics (Wokwi Canvas Layouts):**
    *   [room1_diagram.json](file:///d:/Coading/hackathon/boss-monitor/wokwi/room1_diagram.json) (Work Room 1 Schematic)
    *   [room2_diagram.json](file:///d:/Coading/hackathon/boss-monitor/wokwi/room2_diagram.json) (Work Room 2 Schematic)
    *   [drawing_diagram.json](file:///d:/Coading/hackathon/boss-monitor/wokwi/drawing_diagram.json) (Drawing Room Schematic)

---

## 2. Pinout Configuration
All rooms utilize the exact same GPIO pin configuration on the ESP32 DevKit V4:
*   **Fan 1 Relay Control:** `GPIO 16`
*   **Fan 2 Relay Control:** `GPIO 17`
*   **Light 1 Relay Control:** `GPIO 18`
*   **Light 2 Relay Control:** `GPIO 19`
*   **Light 3 Relay Control:** `GPIO 21`
*   **Simulated ACS712 Current Sensor Input:** `GPIO 34 (VP)`

---

## 3. How to Simulate a Room in Wokwi
1.  Go to [Wokwi.com](https://wokwi.com/) and create a new **ESP32** project.
2.  Open the **`diagram.json`** tab in the Wokwi code editor, clear it, and copy-paste the contents of the room's diagram file (e.g., `room1_diagram.json`).
3.  Open the main code tab (e.g., `sketch.ino`), clear it, and copy-paste the contents of the matching `.ino` code file (e.g., `room1.ino`).
4.  Click the **Play/Start Simulation** button to run the ESP32.

---

## 4. Features & Wiring Standards
*   **Left-Aligned Labels:** The visual LEDs have clear uppercase tags placed on their left side (`FAN 1 (G16)`, `LIGHT 1 (G18)`, etc.) for professional and readable presentations.
*   **Standard Wiring Colors:**
    *   Supply Power lines: **Red** (VCC) / **Black** (GND).
    *   Simulated AC Live lines: **Brown** (COM rails / NO loads).
    *   Simulated AC Neutral returns: **Blue** (LED return lines).
    *   Analog inputs: **Gray** (Potentiometer slider).
