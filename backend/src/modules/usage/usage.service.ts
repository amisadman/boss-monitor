import { UsageHistory, IUsageHistory } from './usage.model';
import { Device } from '../device/device.model';

export interface UsageSummary {
  totalWattsNow: number;
  perRoomWatts: {
    DrawingRoom: number;
    WorkRoom1: number;
    WorkRoom2: number;
  };
  estimatedKwhToday: number;
  estimatedCostToday: number;
}

export const getUsageSummary = async (simulatedTime: Date): Promise<UsageSummary> => {
  const devices = await Device.find();

  let totalWattsNow = 0;
  const perRoomWatts = {
    DrawingRoom: 0,
    WorkRoom1: 0,
    WorkRoom2: 0,
  };

  devices.forEach((device) => {
    if (device.status === 'on') {
      totalWattsNow += device.wattage;
      if (device.room === 'DrawingRoom') perRoomWatts.DrawingRoom += device.wattage;
      else if (device.room === 'WorkRoom1') perRoomWatts.WorkRoom1 += device.wattage;
      else if (device.room === 'WorkRoom2') perRoomWatts.WorkRoom2 += device.wattage;
    }
  });

  // Calculate simulated hours passed today (since simulated midnight 00:00)
  const hours = simulatedTime.getHours();
  const minutes = simulatedTime.getMinutes();
  const hoursSinceMidnight = hours + minutes / 60;

  // If midnight, use a small fraction to avoid 0 kWh or use baseline
  const hoursForCalculation = hoursSinceMidnight > 0 ? hoursSinceMidnight : 0.01;

  // E.g., if totalWattsNow is 500W, running for 10 hours = 5000Wh = 5 kWh
  const estimatedKwhToday = Number(((totalWattsNow * hoursForCalculation) / 1000).toFixed(3));

  // Tariff rate: 12 BDT per kWh
  const tariffRate = 12;
  const estimatedCostToday = Number((estimatedKwhToday * tariffRate).toFixed(2));

  return {
    totalWattsNow,
    perRoomWatts,
    estimatedKwhToday,
    estimatedCostToday,
  };
};

export const saveUsageSnapshot = async (
  totalWatts: number,
  perRoomWatts: { DrawingRoom: number; WorkRoom1: number; WorkRoom2: number },
  timestamp: Date
): Promise<IUsageHistory> => {
  const snapshot = new UsageHistory({
    timestamp,
    totalWatts,
    perRoomWatts,
  });
  return await snapshot.save();
};

export const getUsageHistory = async (): Promise<IUsageHistory[]> => {
  // Return the last 50 snapshots for the frontend line chart
  return await UsageHistory.find().sort({ timestamp: -1 }).limit(50).then((docs) => docs.reverse());
};
