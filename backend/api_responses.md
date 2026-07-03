# Boss Monitor API Responses

This file contains real JSON responses from the local Express + TypeScript backend endpoints.

## 1. GET `/api/devices`
```json
{
  "status": 200,
  "success": true,
  "message": "Devices retrieved successfully",
  "data": [
    {
      "_id": "6a47c629ffea9d04dad75d0e",
      "deviceId": "drawing-fan-2",
      "type": "fan",
      "room": "drawing",
      "label": "Drawing Fan 2",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T20:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:00.481Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d0f",
      "deviceId": "drawing-light-1",
      "type": "light",
      "room": "drawing",
      "label": "Drawing Light 1",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T20:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:00.483Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d10",
      "deviceId": "drawing-light-2",
      "type": "light",
      "room": "drawing",
      "label": "Drawing Light 2",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T21:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:10.484Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d11",
      "deviceId": "drawing-light-3",
      "type": "light",
      "room": "drawing",
      "label": "Drawing Light 3",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T15:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:22:30.454Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d12",
      "deviceId": "drawing-light-4",
      "type": "light",
      "room": "drawing",
      "label": "Drawing Light 4",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T20:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:00.484Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d13",
      "deviceId": "work1-fan-1",
      "type": "fan",
      "room": "work1",
      "label": "Work1 Fan 1",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T20:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:40.477Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d14",
      "deviceId": "work1-fan-2",
      "type": "fan",
      "room": "work1",
      "label": "Work1 Fan 2",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T19:20:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:20.475Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d15",
      "deviceId": "work1-light-1",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 1",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T17:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:23:30.475Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d16",
      "deviceId": "work1-light-2",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 2",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T19:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:10.478Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d17",
      "deviceId": "work1-light-3",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 3",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T18:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:00.480Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d18",
      "deviceId": "work1-light-4",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 4",
      "status": "on",
      "wattage": 15,
      "lastChanged": "2026-07-04T21:00:00.000Z",
      "onSince": "2026-07-04T21:00:00.000Z",
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:10.488Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d19",
      "deviceId": "work2-fan-1",
      "type": "fan",
      "room": "work2",
      "label": "Work2 Fan 1",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T19:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:10.480Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d1a",
      "deviceId": "work2-fan-2",
      "type": "fan",
      "room": "work2",
      "label": "Work2 Fan 2",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T12:20:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:20:50.447Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d1b",
      "deviceId": "work2-light-1",
      "type": "light",
      "room": "work2",
      "label": "Work2 Light 1",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T21:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:10.491Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d1c",
      "deviceId": "work2-light-2",
      "type": "light",
      "room": "work2",
      "label": "Work2 Light 2",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T19:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:10.481Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d1d",
      "deviceId": "work2-light-3",
      "type": "light",
      "room": "work2",
      "label": "Work2 Light 3",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T16:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:23:00.456Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d1e",
      "deviceId": "work2-light-4",
      "type": "light",
      "room": "work2",
      "label": "Work2 Light 4",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T19:20:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:20.477Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d0d",
      "deviceId": "drawing-fan-1",
      "type": "fan",
      "room": "drawing",
      "label": "Drawing Fan 1",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T20:20:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.580Z",
      "updatedAt": "2026-07-03T15:24:50.479Z"
    }
  ]
}
```

## 2. GET `/api/devices/rooms/work1`
```json
{
  "status": 200,
  "success": true,
  "message": "Devices for room work1 retrieved successfully",
  "data": [
    {
      "_id": "6a47c629ffea9d04dad75d13",
      "deviceId": "work1-fan-1",
      "type": "fan",
      "room": "work1",
      "label": "Work1 Fan 1",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T20:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:40.477Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d14",
      "deviceId": "work1-fan-2",
      "type": "fan",
      "room": "work1",
      "label": "Work1 Fan 2",
      "status": "off",
      "wattage": 60,
      "lastChanged": "2026-07-04T19:20:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:20.475Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d15",
      "deviceId": "work1-light-1",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 1",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T17:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:23:30.475Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d16",
      "deviceId": "work1-light-2",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 2",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T19:00:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:10.478Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d17",
      "deviceId": "work1-light-3",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 3",
      "status": "off",
      "wattage": 15,
      "lastChanged": "2026-07-04T18:40:00.000Z",
      "onSince": null,
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:24:00.480Z"
    },
    {
      "_id": "6a47c629ffea9d04dad75d18",
      "deviceId": "work1-light-4",
      "type": "light",
      "room": "work1",
      "label": "Work1 Light 4",
      "status": "on",
      "wattage": 15,
      "lastChanged": "2026-07-04T21:00:00.000Z",
      "onSince": "2026-07-04T21:00:00.000Z",
      "__v": 0,
      "createdAt": "2026-07-03T14:24:41.581Z",
      "updatedAt": "2026-07-03T15:25:10.488Z"
    }
  ]
}
```

## 3. GET `/api/usage`
```json
{
  "status": 200,
  "success": true,
  "message": "Usage summary retrieved successfully",
  "data": {
    "totalWattsNow": 15,
    "perRoomWatts": {
      "drawing": 0,
      "work1": 15,
      "work2": 0
    },
    "estimatedKwhToday": 0.045,
    "estimatedCostToday": 0.54
  }
}
```

## 4. GET `/api/usage/history`
```json
{
  "status": 200,
  "success": true,
  "message": "Usage history retrieved successfully",
  "data": [
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 180,
        "work2": 180
      },
      "_id": "6a47d26c2424c5950e8877f0",
      "timestamp": "2026-07-04T04:40:00.000Z",
      "totalWatts": 525,
      "createdAt": "2026-07-03T15:17:00.423Z",
      "updatedAt": "2026-07-03T15:17:00.423Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 180,
        "work2": 165
      },
      "_id": "6a47d2762424c5950e8877fc",
      "timestamp": "2026-07-04T05:00:00.000Z",
      "totalWatts": 510,
      "createdAt": "2026-07-03T15:17:10.419Z",
      "updatedAt": "2026-07-03T15:17:10.419Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 120,
        "work1": 180,
        "work2": 180
      },
      "_id": "6a47d2802424c5950e887808",
      "timestamp": "2026-07-04T05:20:00.000Z",
      "totalWatts": 480,
      "createdAt": "2026-07-03T15:17:20.424Z",
      "updatedAt": "2026-07-03T15:17:20.424Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 180,
        "work2": 150
      },
      "_id": "6a47d28a2424c5950e887815",
      "timestamp": "2026-07-04T05:40:00.000Z",
      "totalWatts": 495,
      "createdAt": "2026-07-03T15:17:30.424Z",
      "updatedAt": "2026-07-03T15:17:30.424Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 180,
        "work1": 180,
        "work2": 105
      },
      "_id": "6a47d2942424c5950e887823",
      "timestamp": "2026-07-04T06:00:00.000Z",
      "totalWatts": 465,
      "createdAt": "2026-07-03T15:17:40.422Z",
      "updatedAt": "2026-07-03T15:17:40.422Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 180,
        "work2": 150
      },
      "_id": "6a47d29e2424c5950e887831",
      "timestamp": "2026-07-04T06:20:00.000Z",
      "totalWatts": 495,
      "createdAt": "2026-07-03T15:17:50.434Z",
      "updatedAt": "2026-07-03T15:17:50.434Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 180,
        "work1": 180,
        "work2": 150
      },
      "_id": "6a47d2a82424c5950e88783d",
      "timestamp": "2026-07-04T06:40:00.000Z",
      "totalWatts": 510,
      "createdAt": "2026-07-03T15:18:00.425Z",
      "updatedAt": "2026-07-03T15:18:00.425Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 120,
        "work1": 165,
        "work2": 165
      },
      "_id": "6a47d2b22424c5950e88784a",
      "timestamp": "2026-07-04T07:00:00.000Z",
      "totalWatts": 450,
      "createdAt": "2026-07-03T15:18:10.426Z",
      "updatedAt": "2026-07-03T15:18:10.426Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 180,
        "work1": 105,
        "work2": 135
      },
      "_id": "6a47d2bc2424c5950e887859",
      "timestamp": "2026-07-04T07:20:00.000Z",
      "totalWatts": 420,
      "createdAt": "2026-07-03T15:18:20.439Z",
      "updatedAt": "2026-07-03T15:18:20.439Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 165,
        "work2": 180
      },
      "_id": "6a47d2c62424c5950e887869",
      "timestamp": "2026-07-04T07:40:00.000Z",
      "totalWatts": 510,
      "createdAt": "2026-07-03T15:18:30.444Z",
      "updatedAt": "2026-07-03T15:18:30.444Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 90,
        "work1": 105,
        "work2": 60
      },
      "_id": "6a47d2d02424c5950e887879",
      "timestamp": "2026-07-04T08:00:00.000Z",
      "totalWatts": 255,
      "createdAt": "2026-07-03T15:18:40.436Z",
      "updatedAt": "2026-07-03T15:18:40.436Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 180,
        "work1": 165,
        "work2": 180
      },
      "_id": "6a47d2da2424c5950e88788a",
      "timestamp": "2026-07-04T08:20:00.000Z",
      "totalWatts": 525,
      "createdAt": "2026-07-03T15:18:50.445Z",
      "updatedAt": "2026-07-03T15:18:50.445Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 135,
        "work2": 90
      },
      "_id": "6a47d2e42424c5950e887899",
      "timestamp": "2026-07-04T08:40:00.000Z",
      "totalWatts": 390,
      "createdAt": "2026-07-03T15:19:00.437Z",
      "updatedAt": "2026-07-03T15:19:00.437Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 120,
        "work1": 165,
        "work2": 180
      },
      "_id": "6a47d2ee2424c5950e8878a9",
      "timestamp": "2026-07-04T09:00:00.000Z",
      "totalWatts": 465,
      "createdAt": "2026-07-03T15:19:10.445Z",
      "updatedAt": "2026-07-03T15:19:10.445Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 165,
        "work1": 45,
        "work2": 165
      },
      "_id": "6a47d2f82424c5950e8878b9",
      "timestamp": "2026-07-04T09:20:00.000Z",
      "totalWatts": 375,
      "createdAt": "2026-07-03T15:19:20.443Z",
      "updatedAt": "2026-07-03T15:19:20.443Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 180,
        "work1": 150,
        "work2": 105
      },
      "_id": "6a47d3022424c5950e8878c9",
      "timestamp": "2026-07-04T09:40:00.000Z",
      "totalWatts": 435,
      "createdAt": "2026-07-03T15:19:30.455Z",
      "updatedAt": "2026-07-03T15:19:30.455Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 150,
        "work1": 120,
        "work2": 150
      },
      "_id": "6a47d30c2424c5950e8878db",
      "timestamp": "2026-07-04T10:00:00.000Z",
      "totalWatts": 420,
      "createdAt": "2026-07-03T15:19:40.453Z",
      "updatedAt": "2026-07-03T15:19:40.453Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 90,
        "work1": 180,
        "work2": 180
      },
      "_id": "6a47d3162424c5950e8878ec",
      "timestamp": "2026-07-04T10:20:00.000Z",
      "totalWatts": 450,
      "createdAt": "2026-07-03T15:19:50.449Z",
      "updatedAt": "2026-07-03T15:19:50.449Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 105,
        "work1": 180,
        "work2": 45
      },
      "_id": "6a47d3202424c5950e8878fb",
      "timestamp": "2026-07-04T10:40:00.000Z",
      "totalWatts": 330,
      "createdAt": "2026-07-03T15:20:00.446Z",
      "updatedAt": "2026-07-03T15:20:00.446Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 60,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d32a2424c5950e887928",
      "timestamp": "2026-07-04T11:00:00.000Z",
      "totalWatts": 75,
      "createdAt": "2026-07-03T15:20:10.496Z",
      "updatedAt": "2026-07-03T15:20:10.496Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 0,
        "work2": 30
      },
      "_id": "6a47d3342424c5950e88794f",
      "timestamp": "2026-07-04T11:20:00.000Z",
      "totalWatts": 45,
      "createdAt": "2026-07-03T15:20:20.498Z",
      "updatedAt": "2026-07-03T15:20:20.498Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 0,
        "work2": 60
      },
      "_id": "6a47d33e2424c5950e887975",
      "timestamp": "2026-07-04T11:40:00.000Z",
      "totalWatts": 75,
      "createdAt": "2026-07-03T15:20:30.503Z",
      "updatedAt": "2026-07-03T15:20:30.503Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 0,
        "work2": 60
      },
      "_id": "6a47d3482424c5950e887994",
      "timestamp": "2026-07-04T12:00:00.000Z",
      "totalWatts": 75,
      "createdAt": "2026-07-03T15:20:40.485Z",
      "updatedAt": "2026-07-03T15:20:40.485Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d3522424c5950e8879b5",
      "timestamp": "2026-07-04T12:20:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:20:50.496Z",
      "updatedAt": "2026-07-03T15:20:50.496Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 75,
        "work1": 60,
        "work2": 30
      },
      "_id": "6a47d35c2424c5950e8879e0",
      "timestamp": "2026-07-04T12:40:00.000Z",
      "totalWatts": 165,
      "createdAt": "2026-07-03T15:21:00.509Z",
      "updatedAt": "2026-07-03T15:21:00.509Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d3662424c5950e887a0a",
      "timestamp": "2026-07-04T13:00:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:21:10.492Z",
      "updatedAt": "2026-07-03T15:21:10.492Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 0,
        "work2": 15
      },
      "_id": "6a47d3702424c5950e887a2e",
      "timestamp": "2026-07-04T13:20:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:21:20.504Z",
      "updatedAt": "2026-07-03T15:21:20.504Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 30,
        "work1": 0,
        "work2": 0
      },
      "_id": "6a47d37a2424c5950e887a4f",
      "timestamp": "2026-07-04T13:40:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:21:30.499Z",
      "updatedAt": "2026-07-03T15:21:30.499Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 60,
        "work1": 0,
        "work2": 15
      },
      "_id": "6a47d3842424c5950e887a73",
      "timestamp": "2026-07-04T14:00:00.000Z",
      "totalWatts": 75,
      "createdAt": "2026-07-03T15:21:40.473Z",
      "updatedAt": "2026-07-03T15:21:40.473Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 60,
        "work2": 15
      },
      "_id": "6a47d38e2424c5950e887a9a",
      "timestamp": "2026-07-04T14:20:00.000Z",
      "totalWatts": 90,
      "createdAt": "2026-07-03T15:21:50.477Z",
      "updatedAt": "2026-07-03T15:21:50.477Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 15
      },
      "_id": "6a47d3982424c5950e887ac0",
      "timestamp": "2026-07-04T14:40:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:22:00.478Z",
      "updatedAt": "2026-07-03T15:22:00.478Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d3a22424c5950e887ade",
      "timestamp": "2026-07-04T15:00:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:22:10.469Z",
      "updatedAt": "2026-07-03T15:22:10.469Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 30,
        "work1": 0,
        "work2": 0
      },
      "_id": "6a47d3ac2424c5950e887b00",
      "timestamp": "2026-07-04T15:20:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:22:20.479Z",
      "updatedAt": "2026-07-03T15:22:20.479Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 0,
        "work2": 60
      },
      "_id": "6a47d3b62424c5950e887b21",
      "timestamp": "2026-07-04T15:40:00.000Z",
      "totalWatts": 60,
      "createdAt": "2026-07-03T15:22:30.487Z",
      "updatedAt": "2026-07-03T15:22:30.487Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 15
      },
      "_id": "6a47d3c02424c5950e887b43",
      "timestamp": "2026-07-04T16:00:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:22:40.479Z",
      "updatedAt": "2026-07-03T15:22:40.479Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 0,
        "work2": 15
      },
      "_id": "6a47d3ca2424c5950e887b64",
      "timestamp": "2026-07-04T16:20:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:22:50.491Z",
      "updatedAt": "2026-07-03T15:22:50.491Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 75,
        "work2": 15
      },
      "_id": "6a47d3d42424c5950e887b89",
      "timestamp": "2026-07-04T16:40:00.000Z",
      "totalWatts": 90,
      "createdAt": "2026-07-03T15:23:00.494Z",
      "updatedAt": "2026-07-03T15:23:00.494Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 0,
        "work2": 15
      },
      "_id": "6a47d3de2424c5950e887bac",
      "timestamp": "2026-07-04T17:00:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:23:10.481Z",
      "updatedAt": "2026-07-03T15:23:10.481Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d3e82424c5950e887bcb",
      "timestamp": "2026-07-04T17:20:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:23:20.493Z",
      "updatedAt": "2026-07-03T15:23:20.493Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 120,
        "work2": 0
      },
      "_id": "6a47d3f22424c5950e887bed",
      "timestamp": "2026-07-04T17:40:00.000Z",
      "totalWatts": 120,
      "createdAt": "2026-07-03T15:23:30.522Z",
      "updatedAt": "2026-07-03T15:23:30.522Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d3fc2424c5950e887c0e",
      "timestamp": "2026-07-04T18:00:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:23:40.516Z",
      "updatedAt": "2026-07-03T15:23:40.516Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 15,
        "work2": 45
      },
      "_id": "6a47d4062424c5950e887c39",
      "timestamp": "2026-07-04T18:20:00.000Z",
      "totalWatts": 75,
      "createdAt": "2026-07-03T15:23:50.534Z",
      "updatedAt": "2026-07-03T15:23:50.534Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 60,
        "work1": 75,
        "work2": 75
      },
      "_id": "6a47d4102424c5950e887c67",
      "timestamp": "2026-07-04T18:40:00.000Z",
      "totalWatts": 210,
      "createdAt": "2026-07-03T15:24:00.538Z",
      "updatedAt": "2026-07-03T15:24:00.538Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 60,
        "work2": 15
      },
      "_id": "6a47d41a2424c5950e887c8c",
      "timestamp": "2026-07-04T19:00:00.000Z",
      "totalWatts": 75,
      "createdAt": "2026-07-03T15:24:10.530Z",
      "updatedAt": "2026-07-03T15:24:10.530Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 0,
        "work2": 0
      },
      "_id": "6a47d4242424c5950e887cae",
      "timestamp": "2026-07-04T19:20:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:24:20.523Z",
      "updatedAt": "2026-07-03T15:24:20.523Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 60,
        "work2": 0
      },
      "_id": "6a47d42e2424c5950e887ccd",
      "timestamp": "2026-07-04T19:40:00.000Z",
      "totalWatts": 60,
      "createdAt": "2026-07-03T15:24:30.502Z",
      "updatedAt": "2026-07-03T15:24:30.502Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 60,
        "work1": 0,
        "work2": 0
      },
      "_id": "6a47d4382424c5950e887cec",
      "timestamp": "2026-07-04T20:00:00.000Z",
      "totalWatts": 60,
      "createdAt": "2026-07-03T15:24:40.495Z",
      "updatedAt": "2026-07-03T15:24:40.495Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 90,
        "work1": 0,
        "work2": 0
      },
      "_id": "6a47d4422424c5950e887d11",
      "timestamp": "2026-07-04T20:20:00.000Z",
      "totalWatts": 90,
      "createdAt": "2026-07-03T15:24:50.516Z",
      "updatedAt": "2026-07-03T15:24:50.516Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 15,
        "work1": 0,
        "work2": 15
      },
      "_id": "6a47d44c2424c5950e887d37",
      "timestamp": "2026-07-04T20:40:00.000Z",
      "totalWatts": 30,
      "createdAt": "2026-07-03T15:25:00.512Z",
      "updatedAt": "2026-07-03T15:25:00.512Z",
      "__v": 0
    },
    {
      "perRoomWatts": {
        "drawing": 0,
        "work1": 15,
        "work2": 0
      },
      "_id": "6a47d4562424c5950e887d59",
      "timestamp": "2026-07-04T21:00:00.000Z",
      "totalWatts": 15,
      "createdAt": "2026-07-03T15:25:10.548Z",
      "updatedAt": "2026-07-03T15:25:10.548Z",
      "__v": 0
    }
  ]
}
```

## 5. GET `/api/alerts`
```json
{
  "status": 200,
  "success": true,
  "message": "Alerts retrieved successfully",
  "data": [
    {
      "_id": "6a47d4562424c5950e887d4c",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T21:00:00.000Z",
      "resolvedAt": null,
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:25:10.523Z",
      "updatedAt": "2026-07-03T15:25:10.523Z",
      "__v": 0
    },
    {
      "_id": "6a47d44c2424c5950e887d2e",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T20:40:00.000Z",
      "resolvedAt": "2026-07-04T21:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:25:00.505Z",
      "updatedAt": "2026-07-03T15:25:10.531Z",
      "__v": 0
    },
    {
      "_id": "6a47d44c2424c5950e887d20",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T20:40:00.000Z",
      "resolvedAt": "2026-07-04T21:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:25:00.494Z",
      "updatedAt": "2026-07-03T15:25:10.505Z",
      "__v": 0
    },
    {
      "_id": "6a47d4422424c5950e887cff",
      "type": "after-hours",
      "scope": "drawing-light-4",
      "message": "Drawing Light 4 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T20:20:00.000Z",
      "resolvedAt": "2026-07-04T20:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:50.499Z",
      "updatedAt": "2026-07-03T15:25:00.497Z",
      "__v": 0
    },
    {
      "_id": "6a47d4422424c5950e887cfa",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T20:20:00.000Z",
      "resolvedAt": "2026-07-04T20:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:50.496Z",
      "updatedAt": "2026-07-03T15:25:00.493Z",
      "__v": 0
    },
    {
      "_id": "6a47d4422424c5950e887cf7",
      "type": "after-hours",
      "scope": "drawing-fan-2",
      "message": "Drawing Fan 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T20:20:00.000Z",
      "resolvedAt": "2026-07-04T20:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:50.494Z",
      "updatedAt": "2026-07-03T15:25:00.491Z",
      "__v": 0
    },
    {
      "_id": "6a47d4382424c5950e887cd4",
      "type": "after-hours",
      "scope": "drawing-fan-1",
      "message": "Drawing Fan 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T20:00:00.000Z",
      "resolvedAt": "2026-07-04T20:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:40.479Z",
      "updatedAt": "2026-07-03T15:24:50.492Z",
      "__v": 0
    },
    {
      "_id": "6a47d42e2424c5950e887cbc",
      "type": "after-hours",
      "scope": "work1-fan-1",
      "message": "Work1 Fan 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T19:40:00.000Z",
      "resolvedAt": "2026-07-04T20:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:30.489Z",
      "updatedAt": "2026-07-03T15:24:40.484Z",
      "__v": 0
    },
    {
      "_id": "6a47d4242424c5950e887c97",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T19:20:00.000Z",
      "resolvedAt": "2026-07-04T19:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:20.493Z",
      "updatedAt": "2026-07-03T15:24:30.484Z",
      "__v": 0
    },
    {
      "_id": "6a47d41a2424c5950e887c86",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T19:00:00.000Z",
      "resolvedAt": "2026-07-04T19:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:10.524Z",
      "updatedAt": "2026-07-03T15:24:20.514Z",
      "__v": 0
    },
    {
      "_id": "6a47d4102424c5950e887c5a",
      "type": "after-hours",
      "scope": "work2-fan-1",
      "message": "Work2 Fan 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T18:40:00.000Z",
      "resolvedAt": "2026-07-04T19:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:00.522Z",
      "updatedAt": "2026-07-03T15:24:10.513Z",
      "__v": 0
    },
    {
      "_id": "6a47d4102424c5950e887c54",
      "type": "after-hours",
      "scope": "work1-light-2",
      "message": "Work1 Light 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T18:40:00.000Z",
      "resolvedAt": "2026-07-04T19:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:00.513Z",
      "updatedAt": "2026-07-03T15:24:10.507Z",
      "__v": 0
    },
    {
      "_id": "6a47d4102424c5950e887c50",
      "type": "after-hours",
      "scope": "work1-fan-2",
      "message": "Work1 Fan 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T18:40:00.000Z",
      "resolvedAt": "2026-07-04T19:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:00.508Z",
      "updatedAt": "2026-07-03T15:24:20.501Z",
      "__v": 0
    },
    {
      "_id": "6a47d4102424c5950e887c47",
      "type": "after-hours",
      "scope": "drawing-fan-2",
      "message": "Drawing Fan 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T18:40:00.000Z",
      "resolvedAt": "2026-07-04T19:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:24:00.490Z",
      "updatedAt": "2026-07-03T15:24:10.491Z",
      "__v": 0
    },
    {
      "_id": "6a47d4062424c5950e887c33",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T18:20:00.000Z",
      "resolvedAt": "2026-07-04T18:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:50.526Z",
      "updatedAt": "2026-07-03T15:24:00.532Z",
      "__v": 0
    },
    {
      "_id": "6a47d4062424c5950e887c2f",
      "type": "after-hours",
      "scope": "work2-light-2",
      "message": "Work2 Light 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T18:20:00.000Z",
      "resolvedAt": "2026-07-04T19:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:50.521Z",
      "updatedAt": "2026-07-03T15:24:10.519Z",
      "__v": 0
    },
    {
      "_id": "6a47d4062424c5950e887c2c",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T18:20:00.000Z",
      "resolvedAt": "2026-07-04T18:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:50.517Z",
      "updatedAt": "2026-07-03T15:24:00.526Z",
      "__v": 0
    },
    {
      "_id": "6a47d4062424c5950e887c26",
      "type": "after-hours",
      "scope": "work1-light-3",
      "message": "Work1 Light 3 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T18:20:00.000Z",
      "resolvedAt": "2026-07-04T18:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:50.509Z",
      "updatedAt": "2026-07-03T15:24:00.517Z",
      "__v": 0
    },
    {
      "_id": "6a47d4062424c5950e887c1c",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T18:20:00.000Z",
      "resolvedAt": "2026-07-04T18:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:50.493Z",
      "updatedAt": "2026-07-03T15:24:00.498Z",
      "__v": 0
    },
    {
      "_id": "6a47d3fc2424c5950e887c00",
      "type": "after-hours",
      "scope": "work1-light-2",
      "message": "Work1 Light 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T18:00:00.000Z",
      "resolvedAt": "2026-07-04T18:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:40.497Z",
      "updatedAt": "2026-07-03T15:23:50.505Z",
      "__v": 0
    },
    {
      "_id": "6a47d3f22424c5950e887bdc",
      "type": "after-hours",
      "scope": "work1-fan-2",
      "message": "Work1 Fan 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T17:40:00.000Z",
      "resolvedAt": "2026-07-04T18:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:30.496Z",
      "updatedAt": "2026-07-03T15:23:40.493Z",
      "__v": 0
    },
    {
      "_id": "6a47d3f22424c5950e887bd9",
      "type": "after-hours",
      "scope": "work1-fan-1",
      "message": "Work1 Fan 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T17:40:00.000Z",
      "resolvedAt": "2026-07-04T18:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:30.491Z",
      "updatedAt": "2026-07-03T15:23:40.490Z",
      "__v": 0
    },
    {
      "_id": "6a47d3e82424c5950e887bbb",
      "type": "after-hours",
      "scope": "work1-light-1",
      "message": "Work1 Light 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T17:20:00.000Z",
      "resolvedAt": "2026-07-04T17:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:20.482Z",
      "updatedAt": "2026-07-03T15:23:30.499Z",
      "__v": 0
    },
    {
      "_id": "6a47d3de2424c5950e887ba4",
      "type": "after-hours",
      "scope": "work2-light-2",
      "message": "Work2 Light 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T17:00:00.000Z",
      "resolvedAt": "2026-07-04T17:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:10.476Z",
      "updatedAt": "2026-07-03T15:23:20.488Z",
      "__v": 0
    },
    {
      "_id": "6a47d3d42424c5950e887b7f",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T16:40:00.000Z",
      "resolvedAt": "2026-07-04T17:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:00.480Z",
      "updatedAt": "2026-07-03T15:23:10.475Z",
      "__v": 0
    },
    {
      "_id": "6a47d3d42424c5950e887b7a",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T16:40:00.000Z",
      "resolvedAt": "2026-07-04T17:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:00.477Z",
      "updatedAt": "2026-07-03T15:23:10.472Z",
      "__v": 0
    },
    {
      "_id": "6a47d3d42424c5950e887b74",
      "type": "after-hours",
      "scope": "work1-fan-2",
      "message": "Work1 Fan 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T16:40:00.000Z",
      "resolvedAt": "2026-07-04T17:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:23:00.471Z",
      "updatedAt": "2026-07-03T15:23:10.469Z",
      "__v": 0
    },
    {
      "_id": "6a47d3ca2424c5950e887b5d",
      "type": "after-hours",
      "scope": "work2-light-3",
      "message": "Work2 Light 3 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T16:20:00.000Z",
      "resolvedAt": "2026-07-04T16:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:50.485Z",
      "updatedAt": "2026-07-03T15:23:00.483Z",
      "__v": 0
    },
    {
      "_id": "6a47d3c02424c5950e887b3b",
      "type": "after-hours",
      "scope": "work2-light-2",
      "message": "Work2 Light 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T16:00:00.000Z",
      "resolvedAt": "2026-07-04T16:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:40.474Z",
      "updatedAt": "2026-07-03T15:22:50.482Z",
      "__v": 0
    },
    {
      "_id": "6a47d3c02424c5950e887b33",
      "type": "after-hours",
      "scope": "work1-light-3",
      "message": "Work1 Light 3 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T16:00:00.000Z",
      "resolvedAt": "2026-07-04T16:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:40.468Z",
      "updatedAt": "2026-07-03T15:22:50.475Z",
      "__v": 0
    },
    {
      "_id": "6a47d3b62424c5950e887b16",
      "type": "after-hours",
      "scope": "work2-fan-1",
      "message": "Work2 Fan 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T15:40:00.000Z",
      "resolvedAt": "2026-07-04T16:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:30.474Z",
      "updatedAt": "2026-07-03T15:22:40.470Z",
      "__v": 0
    },
    {
      "_id": "6a47d3ac2424c5950e887aec",
      "type": "after-hours",
      "scope": "drawing-light-3",
      "message": "Drawing Light 3 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T15:20:00.000Z",
      "resolvedAt": "2026-07-04T15:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:20.464Z",
      "updatedAt": "2026-07-03T15:22:30.464Z",
      "__v": 0
    },
    {
      "_id": "6a47d3ac2424c5950e887ae9",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T15:20:00.000Z",
      "resolvedAt": "2026-07-04T15:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:20.462Z",
      "updatedAt": "2026-07-03T15:22:30.461Z",
      "__v": 0
    },
    {
      "_id": "6a47d3982424c5950e887ab8",
      "type": "after-hours",
      "scope": "work2-light-3",
      "message": "Work2 Light 3 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T14:40:00.000Z",
      "resolvedAt": "2026-07-04T15:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:00.473Z",
      "updatedAt": "2026-07-03T15:22:10.465Z",
      "__v": 0
    },
    {
      "_id": "6a47d3982424c5950e887ab0",
      "type": "after-hours",
      "scope": "work1-light-3",
      "message": "Work1 Light 3 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T14:40:00.000Z",
      "resolvedAt": "2026-07-04T15:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:22:00.469Z",
      "updatedAt": "2026-07-03T15:22:20.472Z",
      "__v": 0
    },
    {
      "_id": "6a47d38e2424c5950e887a94",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T14:20:00.000Z",
      "resolvedAt": "2026-07-04T14:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:50.473Z",
      "updatedAt": "2026-07-03T15:22:00.475Z",
      "__v": 0
    },
    {
      "_id": "6a47d38e2424c5950e887a86",
      "type": "after-hours",
      "scope": "work1-fan-1",
      "message": "Work1 Fan 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T14:20:00.000Z",
      "resolvedAt": "2026-07-04T14:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:50.464Z",
      "updatedAt": "2026-07-03T15:22:00.465Z",
      "__v": 0
    },
    {
      "_id": "6a47d38e2424c5950e887a81",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T14:20:00.000Z",
      "resolvedAt": "2026-07-04T14:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:50.461Z",
      "updatedAt": "2026-07-03T15:22:00.463Z",
      "__v": 0
    },
    {
      "_id": "6a47d3842424c5950e887a6c",
      "type": "after-hours",
      "scope": "work2-light-3",
      "message": "Work2 Light 3 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T14:00:00.000Z",
      "resolvedAt": "2026-07-04T14:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:40.467Z",
      "updatedAt": "2026-07-03T15:21:50.472Z",
      "__v": 0
    },
    {
      "_id": "6a47d3842424c5950e887a58",
      "type": "after-hours",
      "scope": "drawing-fan-1",
      "message": "Drawing Fan 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T14:00:00.000Z",
      "resolvedAt": "2026-07-04T14:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:40.452Z",
      "updatedAt": "2026-07-03T15:21:50.457Z",
      "__v": 0
    },
    {
      "_id": "6a47d37a2424c5950e887a3b",
      "type": "after-hours",
      "scope": "drawing-light-3",
      "message": "Drawing Light 3 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T13:40:00.000Z",
      "resolvedAt": "2026-07-04T14:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:30.468Z",
      "updatedAt": "2026-07-03T15:21:40.458Z",
      "__v": 0
    },
    {
      "_id": "6a47d3702424c5950e887a25",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T13:20:00.000Z",
      "resolvedAt": "2026-07-04T13:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:20.492Z",
      "updatedAt": "2026-07-03T15:21:30.483Z",
      "__v": 0
    },
    {
      "_id": "6a47d3702424c5950e887a16",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T13:20:00.000Z",
      "resolvedAt": "2026-07-04T14:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:20.473Z",
      "updatedAt": "2026-07-03T15:21:40.456Z",
      "__v": 0
    },
    {
      "_id": "6a47d3662424c5950e8879f9",
      "type": "after-hours",
      "scope": "work1-light-1",
      "message": "Work1 Light 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T13:00:00.000Z",
      "resolvedAt": "2026-07-04T13:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:10.473Z",
      "updatedAt": "2026-07-03T15:21:20.482Z",
      "__v": 0
    },
    {
      "_id": "6a47d3662424c5950e8879f1",
      "type": "after-hours",
      "scope": "drawing-light-3",
      "message": "Drawing Light 3 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T13:00:00.000Z",
      "resolvedAt": "2026-07-04T13:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:10.464Z",
      "updatedAt": "2026-07-03T15:21:20.477Z",
      "__v": 0
    },
    {
      "_id": "6a47d35c2424c5950e8879d9",
      "type": "after-hours",
      "scope": "work2-light-3",
      "message": "Work2 Light 3 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T12:40:00.000Z",
      "resolvedAt": "2026-07-04T13:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:00.498Z",
      "updatedAt": "2026-07-03T15:21:10.485Z",
      "__v": 0
    },
    {
      "_id": "6a47d35c2424c5950e8879d5",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T12:40:00.000Z",
      "resolvedAt": "2026-07-04T13:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:00.493Z",
      "updatedAt": "2026-07-03T15:21:10.481Z",
      "__v": 0
    },
    {
      "_id": "6a47d35c2424c5950e8879ca",
      "type": "after-hours",
      "scope": "work1-fan-1",
      "message": "Work1 Fan 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T12:40:00.000Z",
      "resolvedAt": "2026-07-04T13:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:00.475Z",
      "updatedAt": "2026-07-03T15:21:10.469Z",
      "__v": 0
    },
    {
      "_id": "6a47d35c2424c5950e8879c7",
      "type": "after-hours",
      "scope": "drawing-light-4",
      "message": "Drawing Light 4 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T12:40:00.000Z",
      "resolvedAt": "2026-07-04T13:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:00.471Z",
      "updatedAt": "2026-07-03T15:21:10.466Z",
      "__v": 0
    },
    {
      "_id": "6a47d35c2424c5950e8879c1",
      "type": "after-hours",
      "scope": "drawing-fan-2",
      "message": "Drawing Fan 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T12:40:00.000Z",
      "resolvedAt": "2026-07-04T13:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:21:00.461Z",
      "updatedAt": "2026-07-03T15:21:10.458Z",
      "__v": 0
    },
    {
      "_id": "6a47d3522424c5950e8879a7",
      "type": "after-hours",
      "scope": "work1-light-3",
      "message": "Work1 Light 3 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T12:20:00.000Z",
      "resolvedAt": "2026-07-04T12:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:50.474Z",
      "updatedAt": "2026-07-03T15:21:00.484Z",
      "__v": 0
    },
    {
      "_id": "6a47d3482424c5950e88797e",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T12:00:00.000Z",
      "resolvedAt": "2026-07-04T12:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:40.451Z",
      "updatedAt": "2026-07-03T15:20:50.457Z",
      "__v": 0
    },
    {
      "_id": "6a47d33e2424c5950e887969",
      "type": "after-hours",
      "scope": "work2-fan-2",
      "message": "Work2 Fan 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T11:40:00.000Z",
      "resolvedAt": "2026-07-04T12:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:30.474Z",
      "updatedAt": "2026-07-03T15:20:50.480Z",
      "__v": 0
    },
    {
      "_id": "6a47d33e2424c5950e88795f",
      "type": "after-hours",
      "scope": "drawing-light-4",
      "message": "Drawing Light 4 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T11:40:00.000Z",
      "resolvedAt": "2026-07-04T12:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:30.460Z",
      "updatedAt": "2026-07-03T15:20:40.460Z",
      "__v": 0
    },
    {
      "_id": "6a47d3342424c5950e887948",
      "type": "after-hours",
      "scope": "work2-light-3",
      "message": "Work2 Light 3 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T11:20:00.000Z",
      "resolvedAt": "2026-07-04T11:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:20.487Z",
      "updatedAt": "2026-07-03T15:20:30.491Z",
      "__v": 0
    },
    {
      "_id": "6a47d3342424c5950e887944",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T11:20:00.000Z",
      "resolvedAt": "2026-07-04T11:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:20.481Z",
      "updatedAt": "2026-07-03T15:20:30.479Z",
      "__v": 0
    },
    {
      "_id": "6a47d3342424c5950e887936",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T11:20:00.000Z",
      "resolvedAt": "2026-07-04T11:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:20.460Z",
      "updatedAt": "2026-07-03T15:20:30.456Z",
      "__v": 0
    },
    {
      "_id": "6a47d32a2424c5950e88791a",
      "type": "after-hours",
      "scope": "work1-light-2",
      "message": "Work1 Light 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T11:00:00.000Z",
      "resolvedAt": "2026-07-04T11:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:10.477Z",
      "updatedAt": "2026-07-03T15:20:20.472Z",
      "__v": 0
    },
    {
      "_id": "6a47d32a2424c5950e88790f",
      "type": "after-hours",
      "scope": "drawing-fan-1",
      "message": "Drawing Fan 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T11:00:00.000Z",
      "resolvedAt": "2026-07-04T11:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:20:10.461Z",
      "updatedAt": "2026-07-03T15:20:20.452Z",
      "__v": 0
    },
    {
      "_id": "6a47d2942424c5950e88781f",
      "type": "prolonged-on",
      "scope": "work1",
      "message": "All devices in work1 room have been ON for more than 2 hours.",
      "triggeredAt": "2026-07-04T06:00:00.000Z",
      "resolvedAt": "2026-07-04T07:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:17:40.418Z",
      "updatedAt": "2026-07-03T15:18:10.421Z",
      "__v": 0
    },
    {
      "_id": "6a47d2302424c5950e887789",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T02:40:00.000Z",
      "resolvedAt": "2026-07-04T03:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:16:00.426Z",
      "updatedAt": "2026-07-03T15:16:10.431Z",
      "__v": 0
    },
    {
      "_id": "6a47d2302424c5950e887783",
      "type": "after-hours",
      "scope": "work2-fan-2",
      "message": "Work2 Fan 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T02:40:00.000Z",
      "resolvedAt": "2026-07-04T03:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:16:00.421Z",
      "updatedAt": "2026-07-03T15:16:10.428Z",
      "__v": 0
    },
    {
      "_id": "6a47d2302424c5950e887776",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T02:40:00.000Z",
      "resolvedAt": "2026-07-04T03:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:16:00.404Z",
      "updatedAt": "2026-07-03T15:16:10.424Z",
      "__v": 0
    },
    {
      "_id": "6a47d2302424c5950e887773",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T02:40:00.000Z",
      "resolvedAt": "2026-07-04T03:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:16:00.400Z",
      "updatedAt": "2026-07-03T15:16:10.421Z",
      "__v": 0
    },
    {
      "_id": "6a47d2262424c5950e887758",
      "type": "after-hours",
      "scope": "work1-light-2",
      "message": "Work1 Light 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T02:20:00.000Z",
      "resolvedAt": "2026-07-04T02:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:50.413Z",
      "updatedAt": "2026-07-03T15:16:00.415Z",
      "__v": 0
    },
    {
      "_id": "6a47d21c2424c5950e88773f",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T02:00:00.000Z",
      "resolvedAt": "2026-07-04T02:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:40.418Z",
      "updatedAt": "2026-07-03T15:15:50.424Z",
      "__v": 0
    },
    {
      "_id": "6a47d2122424c5950e88770f",
      "type": "after-hours",
      "scope": "drawing-fan-1",
      "message": "Drawing Fan 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T01:40:00.000Z",
      "resolvedAt": "2026-07-04T02:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:30.397Z",
      "updatedAt": "2026-07-03T15:15:40.392Z",
      "__v": 0
    },
    {
      "_id": "6a47d2082424c5950e887700",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T01:20:00.000Z",
      "resolvedAt": "2026-07-04T01:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:20.428Z",
      "updatedAt": "2026-07-03T15:15:30.431Z",
      "__v": 0
    },
    {
      "_id": "6a47d2082424c5950e8876f9",
      "type": "after-hours",
      "scope": "work2-fan-1",
      "message": "Work2 Fan 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T01:20:00.000Z",
      "resolvedAt": "2026-07-04T01:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:20.418Z",
      "updatedAt": "2026-07-03T15:15:30.421Z",
      "__v": 0
    },
    {
      "_id": "6a47d2082424c5950e8876ec",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T01:20:00.000Z",
      "resolvedAt": "2026-07-04T01:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:20.397Z",
      "updatedAt": "2026-07-03T15:15:30.402Z",
      "__v": 0
    },
    {
      "_id": "6a47d1fe2424c5950e8876d1",
      "type": "after-hours",
      "scope": "work1-light-1",
      "message": "Work1 Light 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T01:00:00.000Z",
      "resolvedAt": "2026-07-04T01:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:10.410Z",
      "updatedAt": "2026-07-03T15:15:20.408Z",
      "__v": 0
    },
    {
      "_id": "6a47d1f42424c5950e8876b3",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T00:40:00.000Z",
      "resolvedAt": "2026-07-04T01:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:00.425Z",
      "updatedAt": "2026-07-03T15:15:10.416Z",
      "__v": 0
    },
    {
      "_id": "6a47d1f42424c5950e8876a9",
      "type": "after-hours",
      "scope": "drawing-light-3",
      "message": "Drawing Light 3 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T00:40:00.000Z",
      "resolvedAt": "2026-07-04T01:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:15:00.405Z",
      "updatedAt": "2026-07-03T15:15:10.401Z",
      "__v": 0
    },
    {
      "_id": "6a47d1ea2424c5950e887694",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-04T00:20:00.000Z",
      "resolvedAt": "2026-07-04T00:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:50.428Z",
      "updatedAt": "2026-07-03T15:15:00.437Z",
      "__v": 0
    },
    {
      "_id": "6a47d1ea2424c5950e887680",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T00:20:00.000Z",
      "resolvedAt": "2026-07-04T00:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:50.395Z",
      "updatedAt": "2026-07-03T15:15:00.400Z",
      "__v": 0
    },
    {
      "_id": "6a47d1e02424c5950e887663",
      "type": "after-hours",
      "scope": "work1-fan-2",
      "message": "Work1 Fan 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-04T00:00:00.000Z",
      "resolvedAt": "2026-07-04T00:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:40.398Z",
      "updatedAt": "2026-07-03T15:15:00.413Z",
      "__v": 0
    },
    {
      "_id": "6a47d1e02424c5950e88765d",
      "type": "after-hours",
      "scope": "drawing-light-2",
      "message": "Drawing Light 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-04T00:00:00.000Z",
      "resolvedAt": "2026-07-04T00:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:40.390Z",
      "updatedAt": "2026-07-03T15:14:50.399Z",
      "__v": 0
    },
    {
      "_id": "6a47d1d62424c5950e887648",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T23:40:00.000Z",
      "resolvedAt": "2026-07-04T00:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:30.412Z",
      "updatedAt": "2026-07-03T15:14:50.421Z",
      "__v": 0
    },
    {
      "_id": "6a47d1d62424c5950e887644",
      "type": "after-hours",
      "scope": "work2-fan-1",
      "message": "Work2 Fan 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T23:40:00.000Z",
      "resolvedAt": "2026-07-04T00:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:30.407Z",
      "updatedAt": "2026-07-03T15:14:40.408Z",
      "__v": 0
    },
    {
      "_id": "6a47d1d62424c5950e887640",
      "type": "after-hours",
      "scope": "work1-light-3",
      "message": "Work1 Light 3 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T23:40:00.000Z",
      "resolvedAt": "2026-07-04T00:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:30.402Z",
      "updatedAt": "2026-07-03T15:14:50.413Z",
      "__v": 0
    },
    {
      "_id": "6a47d1cc2424c5950e887626",
      "type": "after-hours",
      "scope": "work2-light-3",
      "message": "Work2 Light 3 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T23:20:00.000Z",
      "resolvedAt": "2026-07-03T23:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:20.412Z",
      "updatedAt": "2026-07-03T15:14:30.419Z",
      "__v": 0
    },
    {
      "_id": "6a47d1c22424c5950e887601",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T23:00:00.000Z",
      "resolvedAt": "2026-07-03T23:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:10.411Z",
      "updatedAt": "2026-07-03T15:14:20.403Z",
      "__v": 0
    },
    {
      "_id": "6a47d1b82424c5950e8875e5",
      "type": "after-hours",
      "scope": "work2-light-2",
      "message": "Work2 Light 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T22:40:00.000Z",
      "resolvedAt": "2026-07-03T23:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:00.414Z",
      "updatedAt": "2026-07-03T15:14:10.421Z",
      "__v": 0
    },
    {
      "_id": "6a47d1b82424c5950e8875de",
      "type": "after-hours",
      "scope": "work1-light-3",
      "message": "Work1 Light 3 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T22:40:00.000Z",
      "resolvedAt": "2026-07-03T23:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:14:00.405Z",
      "updatedAt": "2026-07-03T15:14:10.407Z",
      "__v": 0
    },
    {
      "_id": "6a47d1ae2424c5950e8875b7",
      "type": "after-hours",
      "scope": "drawing-light-3",
      "message": "Drawing Light 3 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-03T22:20:00.000Z",
      "resolvedAt": "2026-07-03T22:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:50.392Z",
      "updatedAt": "2026-07-03T15:14:00.393Z",
      "__v": 0
    },
    {
      "_id": "6a47d1a42424c5950e8875a0",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T22:00:00.000Z",
      "resolvedAt": "2026-07-03T22:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:40.394Z",
      "updatedAt": "2026-07-03T15:13:50.413Z",
      "__v": 0
    },
    {
      "_id": "6a47d19a2424c5950e887574",
      "type": "after-hours",
      "scope": "drawing-light-1",
      "message": "Drawing Light 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-03T21:40:00.000Z",
      "resolvedAt": "2026-07-03T22:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:30.390Z",
      "updatedAt": "2026-07-03T15:13:40.380Z",
      "__v": 0
    },
    {
      "_id": "6a47d19a2424c5950e887570",
      "type": "after-hours",
      "scope": "drawing-fan-1",
      "message": "Drawing Fan 1 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-03T21:40:00.000Z",
      "resolvedAt": "2026-07-03T22:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:30.386Z",
      "updatedAt": "2026-07-03T15:13:40.377Z",
      "__v": 0
    },
    {
      "_id": "6a47d1902424c5950e88755e",
      "type": "after-hours",
      "scope": "work2-light-1",
      "message": "Work2 Light 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T21:20:00.000Z",
      "resolvedAt": "2026-07-03T21:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:20.411Z",
      "updatedAt": "2026-07-03T15:13:30.412Z",
      "__v": 0
    },
    {
      "_id": "6a47d1902424c5950e887558",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T21:20:00.000Z",
      "resolvedAt": "2026-07-03T21:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:20.402Z",
      "updatedAt": "2026-07-03T15:13:30.405Z",
      "__v": 0
    },
    {
      "_id": "6a47d1862424c5950e88753b",
      "type": "after-hours",
      "scope": "work2-fan-2",
      "message": "Work2 Fan 2 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T21:00:00.000Z",
      "resolvedAt": "2026-07-03T21:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:13:10.403Z",
      "updatedAt": "2026-07-03T15:13:20.407Z",
      "__v": 0
    },
    {
      "_id": "6a47d1722424c5950e8874fc",
      "type": "after-hours",
      "scope": "work1-light-1",
      "message": "Work1 Light 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T20:20:00.000Z",
      "resolvedAt": "2026-07-03T21:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:50.389Z",
      "updatedAt": "2026-07-03T15:13:10.392Z",
      "__v": 0
    },
    {
      "_id": "6a47d1682424c5950e8874dd",
      "type": "after-hours",
      "scope": "work2-fan-1",
      "message": "Work2 Fan 1 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T20:00:00.000Z",
      "resolvedAt": "2026-07-03T20:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:40.396Z",
      "updatedAt": "2026-07-03T15:12:50.397Z",
      "__v": 0
    },
    {
      "_id": "6a47d1682424c5950e8874d3",
      "type": "after-hours",
      "scope": "work1-fan-1",
      "message": "Work1 Fan 1 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T20:00:00.000Z",
      "resolvedAt": "2026-07-03T20:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:40.382Z",
      "updatedAt": "2026-07-03T15:12:50.384Z",
      "__v": 0
    },
    {
      "_id": "6a47d1682424c5950e8874cf",
      "type": "after-hours",
      "scope": "drawing-light-3",
      "message": "Drawing Light 3 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-03T20:00:00.000Z",
      "resolvedAt": "2026-07-03T20:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:40.377Z",
      "updatedAt": "2026-07-03T15:12:50.379Z",
      "__v": 0
    },
    {
      "_id": "6a47d15e2424c5950e8874ba",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T19:40:00.000Z",
      "resolvedAt": "2026-07-03T20:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:30.396Z",
      "updatedAt": "2026-07-03T15:12:40.405Z",
      "__v": 0
    },
    {
      "_id": "6a47d15e2424c5950e8874b2",
      "type": "after-hours",
      "scope": "work1-light-4",
      "message": "Work1 Light 4 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T19:40:00.000Z",
      "resolvedAt": "2026-07-03T20:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:30.385Z",
      "updatedAt": "2026-07-03T15:12:40.392Z",
      "__v": 0
    },
    {
      "_id": "6a47d15e2424c5950e8874ae",
      "type": "after-hours",
      "scope": "work1-light-2",
      "message": "Work1 Light 2 left ON in work1 room after hours.",
      "triggeredAt": "2026-07-03T19:40:00.000Z",
      "resolvedAt": "2026-07-03T20:00:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:30.379Z",
      "updatedAt": "2026-07-03T15:12:40.388Z",
      "__v": 0
    },
    {
      "_id": "6a47d1542424c5950e887484",
      "type": "after-hours",
      "scope": "drawing-fan-2",
      "message": "Drawing Fan 2 left ON in drawing room after hours.",
      "triggeredAt": "2026-07-03T19:20:00.000Z",
      "resolvedAt": "2026-07-03T19:40:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:20.357Z",
      "updatedAt": "2026-07-03T15:12:30.363Z",
      "__v": 0
    },
    {
      "_id": "6a47d14a2424c5950e887476",
      "type": "after-hours",
      "scope": "work2-light-4",
      "message": "Work2 Light 4 left ON in work2 room after hours.",
      "triggeredAt": "2026-07-03T19:00:00.000Z",
      "resolvedAt": "2026-07-03T19:20:00.000Z",
      "notifiedDiscord": false,
      "createdAt": "2026-07-03T15:12:10.385Z",
      "updatedAt": "2026-07-03T15:12:20.387Z",
      "__v": 0
    }
  ]
}
```

## 6. POST `/api/alerts/:id/ack`
```json
{
  "status": 200,
  "success": true,
  "message": "Alert acknowledged successfully",
  "data": {
    "_id": "6a47d4562424c5950e887d4c",
    "type": "after-hours",
    "scope": "work1-light-4",
    "message": "Work1 Light 4 left ON in work1 room after hours.",
    "triggeredAt": "2026-07-04T21:00:00.000Z",
    "resolvedAt": null,
    "notifiedDiscord": true,
    "createdAt": "2026-07-03T15:25:10.523Z",
    "updatedAt": "2026-07-03T15:25:14.378Z",
    "__v": 0
  }
}
```
