export type Room = "drawing" | "work1" | "work2";
export type DeviceType = "fan" | "light";

export interface Device {
  _id: string;
  deviceId: string;
  type: DeviceType;
  room: Room;
  label: string;
  status: "on" | "off";
  wattage: number;
  lastChanged: string; // ISO date string over the wire
  onSince: string | undefined;
}

export interface Alert {
  _id: string;
  type: "after-hours" | "prolonged-on";
  scope: string;
  message: string;
  triggeredAt: string;
  resolvedAt: string | null;
  notifiedDiscord: boolean;
}

export interface UsageResponse {
  totalWattsNow: number;
  perRoomWatts: Record<Room, number>;
  estimatedKwhToday: number;
}
