import mongoose from 'mongoose';
import { connectDB } from '../config/db';
import { Device } from '../modules/device/device.model';
import { Alert } from '../modules/alert/alert.model';
import { UsageHistory } from '../modules/usage/usage.model';
import { seedDevices } from '../database/seed';
import { setSimulatedTime, runSimulationTick } from '../modules/simulator/simulator.service';
import dotenv from 'dotenv';

dotenv.config();

// Override database name for test isolation
if (process.env.MONGO_URI) {
  process.env.MONGO_URI = process.env.MONGO_URI.replace(/\/boss-monitor(\?|$)/, '/boss-monitor-test$1');
} else {
  process.env.MONGO_URI = 'mongodb://localhost:27017/boss-monitor-test';
}

const assert = (condition: boolean, message: string) => {
  if (!condition) {
    console.error(`❌ ASSERTION FAILED: ${message}`);
    process.exit(1);
  }
  console.log(`✅ ASSERTION PASSED: ${message}`);
};

const runTest = async () => {
  try {
    console.log('Starting simulation integration test...');
    await connectDB();

    // 1. Reset collections
    await Device.deleteMany({});
    await Alert.deleteMany({});
    await UsageHistory.deleteMany({});
    console.log('Cleared existing data.');

    // 2. Seed devices
    await seedDevices();
    const seededCount = await Device.countDocuments();
    assert(seededCount === 15, 'Should seed 15 devices');

    // 3. Test after-hours alerts (8:00 AM is after-hours)
    console.log('\n--- Test After-Hours Alert (8:00 AM) ---');
    const time8 = new Date();
    time8.setHours(8, 0, 0, 0);
    setSimulatedTime(time8);
    
    await runSimulationTick();

    const activeDevices = await Device.find({ status: 'on' });
    console.log(`Number of devices ON after hours: ${activeDevices.length}`);
    console.log('ON Devices:', activeDevices.map((d) => d.deviceId));
    assert(activeDevices.length > 0, 'After-hours guarantee should turn at least 1 device ON');

    const afterHoursAlerts = await Alert.find({ type: 'after-hours', resolvedAt: null });
    console.log(`Number of active after-hours alerts: ${afterHoursAlerts.length}`);
    console.log('Active Alerts Scopes:', afterHoursAlerts.map((a) => a.scope));
    assert(afterHoursAlerts.length === activeDevices.length, 'Should have an active after-hours alert for each ON device');

    // 4. Test office hours transition (10:00 AM)
    console.log('\n--- Test Office Hours Transition (10:00 AM) ---');
    const time10 = new Date();
    time10.setHours(10, 0, 0, 0);
    setSimulatedTime(time10);

    await runSimulationTick();

    const activeAfterHoursAlerts = await Alert.find({ type: 'after-hours', resolvedAt: null });
    assert(activeAfterHoursAlerts.length === 0, 'All after-hours alerts should be resolved during office hours');

    const resolvedAfterHoursAlerts = await Alert.find({ type: 'after-hours', resolvedAt: { $ne: null } });
    assert(resolvedAfterHoursAlerts.length > 0, 'After-hours alerts should be resolved');

    const work1Devices = await Device.find({ room: 'WorkRoom1' });
    const allWork1On = work1Devices.every((d) => d.status === 'on');
    assert(allWork1On, 'Special Demo Rule: All WorkRoom1 devices must be ON at 10:00 AM');

    // 5. Test prolonged-on alerts (12:00 PM - after 2 hours of WorkRoom1 being ON)
    console.log('\n--- Test Prolonged-On Alert (12:00 PM) ---');
    const time12 = new Date();
    time12.setHours(12, 0, 0, 0);
    setSimulatedTime(time12);

    await runSimulationTick();

    const prolongedAlerts = await Alert.find({ type: 'prolonged-on', scope: 'WorkRoom1', resolvedAt: null });
    assert(prolongedAlerts.length === 1, 'Should trigger prolonged-on alert for room WorkRoom1 after 2 hours');

    // 6. Test prolonged-on resolution (1:00 PM - turn off one device)
    console.log('\n--- Test Prolonged-On Resolution (1:00 PM) ---');
    const time13 = new Date();
    time13.setHours(13, 0, 0, 0);
    setSimulatedTime(time13);

    // Turn off one device in WorkRoom1
    const deviceToTurnOff = work1Devices[0];
    deviceToTurnOff.status = 'off';
    deviceToTurnOff.onSince = null;
    deviceToTurnOff.lastChanged = time13;
    await deviceToTurnOff.save();

    await runSimulationTick();

    const activeProlongedAlerts = await Alert.find({ type: 'prolonged-on', scope: 'WorkRoom1', resolvedAt: null });
    assert(activeProlongedAlerts.length === 0, 'Prolonged-on alert should resolve when a device in WorkRoom1 is turned OFF');

    const resolvedProlongedAlerts = await Alert.find({ type: 'prolonged-on', scope: 'WorkRoom1', resolvedAt: { $ne: null } });
    assert(resolvedProlongedAlerts.length === 1, 'Prolonged-on alert should be resolved');

    // 7. Test manual toggle device override (turn work1-fan-1 ON manually at after-hours)
    console.log('\n--- Test Manual Device Override (After-Hours) ---');
    const time8Manual = new Date();
    time8Manual.setHours(8, 0, 0, 0);
    setSimulatedTime(time8Manual);

    const { manualToggleDevice, setSimulatorHour } = require('../modules/simulator/simulator.service');
    const overrideDevice = await manualToggleDevice('work1-fan-1', 'on');
    assert(overrideDevice.status === 'on', 'Device work1-fan-1 should be ON after manual override');

    const manualAlerts = await Alert.find({ type: 'after-hours', scope: 'work1-fan-1', resolvedAt: null });
    assert(manualAlerts.length === 1, 'Manual override to ON during after-hours should trigger an after-hours alert');

    // 8. Test virtual clock jumps (set simulator hour to 9:00 AM)
    console.log('\n--- Test Virtual Clock Jump to 9:00 AM ---');
    await setSimulatorHour(9);
    const resolvedManualAlerts = await Alert.find({ type: 'after-hours', scope: 'work1-fan-1', resolvedAt: { $ne: null } });
    assert(resolvedManualAlerts.length === 1, 'Jumping clock to 9:00 AM (office hours) should resolve manual after-hours alert');

    // 9. Test hourly usage aggregation history
    console.log('\n--- Test Hourly Usage Aggregation History ---');
    const { getHourlyUsageHistory } = require('../modules/usage/usage.service');
    const hourlySummary = await getHourlyUsageHistory();
    assert(Array.isArray(hourlySummary), 'Hourly usage history should return an array');
    assert(hourlySummary.length > 0, 'Hourly usage history should contain at least one hourly grouping');
    assert(hourlySummary[0].hour !== undefined, 'Hourly summary object should contain an hour field');
    assert(hourlySummary[0].averageWatts !== undefined, 'Hourly summary object should contain an averageWatts field');
    console.log('Hourly Usage History Result:', hourlySummary);

    console.log('\nAll simulation tests passed successfully! 🎉');
    await mongoose.connection.close();
    process.exit(0);
  } catch (error) {
    console.error('Error running simulation test:', error);
    process.exit(1);
  }
};

runTest();
