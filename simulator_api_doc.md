# Boss Monitor: Simulator Admin & Testing Utility APIs

This document outlines the REST API endpoints used to manually control and test the simulated environment. You can use these endpoints on the frontend to trigger specific states, toggle devices, or jump time ranges for demonstrations.

---

## Base URLs
*   **Local Development:** `http://localhost:5000`
*   **Production API:** `https://boss-monitor-api.onrender.com` *(Replace with your actual Render backend URL)*

---

## 1. Manually Toggle Device State (ON / OFF)
Use this endpoint to simulate physical changes or test manual overrides. It updates the database, re-evaluates active alerts, and broadcasts updates instantly to all Socket.io clients under `'device:update'`.

*   **Endpoint:** `POST /api/simulator/device`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "deviceId": "drawing-fan-1",
      "status": "on"  // Acceptable values: "on" | "off"
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "device": {
        "_id": "64a0b...",
        "deviceId": "drawing-fan-1",
        "type": "fan",
        "room": "DrawingRoom",
        "label": "Drawing Fan 1",
        "status": "on",
        "wattage": 60,
        "lastChanged": "2026-07-04T08:20:00.000Z",
        "onSince": "2026-07-04T08:20:00.000Z",
        "createdAt": "2026-07-04T08:00:00.000Z",
        "updatedAt": "2026-07-04T08:20:00.000Z"
      }
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Required fields: deviceId, status ('on' | 'off')"
    }
    ```

---

## 2. Jump/Reset Virtual Clock Time
Use this endpoint to fast-forward the simulator virtual clock to a specific hour. This allows instant demonstration of transition states (e.g. 5:00 PM evening shutdown and after-hours guarantees) without waiting for time to pass.

*   **Endpoint:** `POST /api/simulator/time`
*   **Headers:** `Content-Type: application/json`
*   **Request Body:**
    ```json
    {
      "hour": 17  // Integer between 0 and 23 (e.g. 9 for 9:00 AM, 17 for 5:00 PM)
    }
    ```
*   **Success Response (200 OK):**
    ```json
    {
      "success": true,
      "simulatedTime": "2026-07-04T17:00:00.000Z"
    }
    ```
*   **Error Response (400 Bad Request):**
    ```json
    {
      "error": "Required field: hour (number between 0 and 23)"
    }
    ```

---

## 3. Room Names Cheat Sheet
When referencing devices or querying per-room usage, ensure you use the exact updated casing for room names:
*   `DrawingRoom`
*   `WorkRoom1`
*   `WorkRoom2`
