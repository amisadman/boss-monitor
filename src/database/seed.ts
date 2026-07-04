import mongoose from 'mongoose';
import { Device } from '../modules/device/device.model';
import { UsageHistory } from '../modules/usage/usage.model';
import { connectDB } from '../config/db';
import dotenv from 'dotenv';

dotenv.config();

const initialDevices = [
  // Drawing Room
  { deviceId: 'drawing-fan-1', type: 'fan', room: 'DrawingRoom', label: 'Drawing Fan 1', status: 'off', wattage: 60, lastChanged: new Date(), onSince: null },
  { deviceId: 'drawing-fan-2', type: 'fan', room: 'DrawingRoom', label: 'Drawing Fan 2', status: 'off', wattage: 60, lastChanged: new Date(), onSince: null },
  { deviceId: 'drawing-light-1', type: 'light', room: 'DrawingRoom', label: 'Drawing Light 1', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
  { deviceId: 'drawing-light-2', type: 'light', room: 'DrawingRoom', label: 'Drawing Light 2', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
  { deviceId: 'drawing-light-3', type: 'light', room: 'DrawingRoom', label: 'Drawing Light 3', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },

  // Work Room 1
  { deviceId: 'work1-fan-1', type: 'fan', room: 'WorkRoom1', label: 'Work1 Fan 1', status: 'off', wattage: 60, lastChanged: new Date(), onSince: null },
  { deviceId: 'work1-fan-2', type: 'fan', room: 'WorkRoom1', label: 'Work1 Fan 2', status: 'off', wattage: 60, lastChanged: new Date(), onSince: null },
  { deviceId: 'work1-light-1', type: 'light', room: 'WorkRoom1', label: 'Work1 Light 1', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
  { deviceId: 'work1-light-2', type: 'light', room: 'WorkRoom1', label: 'Work1 Light 2', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
  { deviceId: 'work1-light-3', type: 'light', room: 'WorkRoom1', label: 'Work1 Light 3', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },

  // Work Room 2
  { deviceId: 'work2-fan-1', type: 'fan', room: 'WorkRoom2', label: 'Work2 Fan 1', status: 'off', wattage: 60, lastChanged: new Date(), onSince: null },
  { deviceId: 'work2-fan-2', type: 'fan', room: 'WorkRoom2', label: 'Work2 Fan 2', status: 'off', wattage: 60, lastChanged: new Date(), onSince: null },
  { deviceId: 'work2-light-1', type: 'light', room: 'WorkRoom2', label: 'Work2 Light 1', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
  { deviceId: 'work2-light-2', type: 'light', room: 'WorkRoom2', label: 'Work2 Light 2', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
  { deviceId: 'work2-light-3', type: 'light', room: 'WorkRoom2', label: 'Work2 Light 3', status: 'off', wattage: 15, lastChanged: new Date(), onSince: null },
];

export const seedDevices = async (): Promise<void> => {
  try {
    const count = await Device.countDocuments();

    // Check if there are legacy room names in the DB
    const hasLegacyRooms = await Device.findOne({
      room: { $in: ['drawing', 'work1', 'work2'] },
    });

    if (count === 0 || hasLegacyRooms) {
      if (hasLegacyRooms) {
        console.log('Legacy room names detected. Clearing and re-seeding database...');
        await Device.deleteMany({});
      }
      console.log('No devices found in DB. Seeding initial 15 devices...');
      await Device.insertMany(initialDevices);
      console.log('Successfully seeded 15 devices.');
    } else {
      console.log(`DB already contains ${count} devices. Skipping seeding.`);
    }

    // Check if there are legacy snapshots in UsageHistory
    const hasLegacySnapshots = await UsageHistory.findOne({
      $or: [
        { 'perRoomWatts.drawing': { $exists: true } },
        { 'perRoomWatts.work1': { $exists: true } },
        { 'perRoomWatts.work2': { $exists: true } }
      ]
    });

    if (hasLegacySnapshots) {
      console.log('Legacy usage snapshots detected. Clearing UsageHistory collection...');
      await UsageHistory.deleteMany({});
    }
  } catch (error) {
    console.error('Error seeding devices:', error);
    throw error;
  }
};

// If run directly via node/ts-node
if (require.main === module) {
  const runStandalone = async () => {
    await connectDB();
    // Clean seed
    await Device.deleteMany({});
    console.log('Cleared existing devices.');
    await seedDevices();
    await mongoose.connection.close();
    console.log('Connection closed.');
  };
  runStandalone();
}
