import { Device, IDevice } from '../device/device.model';
import { Alert } from '../alert/alert.model';
import { triggerAlert, resolveAlert, setSuppressSocketEmissions } from '../alert/alert.service';
import { saveUsageSnapshot, getUsageSummary } from '../usage/usage.service';
import { UsageHistory } from '../usage/usage.model';
import { getIO } from '../../utils/socket';
import { logger } from '../../utils/logger';
import { simulatorConfig } from './simulator.config';

let simulatedTime = new Date();
simulatedTime.setHours(8, 0, 0, 0); // Start at 8:00 AM today

let simulatorInterval: NodeJS.Timeout | null = null;
let wasOfficeHours: boolean | null = null;
let isFastForwarding = false;

export const getSimulatedTime = (): Date => {
  return simulatedTime;
};

// For testing purposes
export const setSimulatedTime = (time: Date): void => {
  simulatedTime = time;
  // Reset transitions on manual time set
  wasOfficeHours = null;
};

export const runSimulationTick = async (): Promise<void> => {
  try {
    // 1. Advance simulated time
    // TICK_RATE_MS is usually 10000ms. Speed multiplier is 120.
    // 10s * 120 = 1200 seconds = 20 minutes
    const tickRateMs = Number(process.env.SIMULATOR_TICK_RATE_MS) || 10000;
    const multiplier = Number(process.env.SIMULATOR_CLOCK_SPEED) || 120;
    const timeToAdvanceMs = tickRateMs * multiplier;
    
    simulatedTime = new Date(simulatedTime.getTime() + timeToAdvanceMs);
    
    const hour = simulatedTime.getHours();
    const isOfficeHours = hour >= simulatorConfig.officeStartHour && hour < simulatorConfig.officeEndHour;
    
    // Transition detection
    const transitionToAfterHours = wasOfficeHours === true && !isOfficeHours;
    wasOfficeHours = isOfficeHours;

    logger.info(`Simulator Tick - Virtual Time: ${simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${isOfficeHours ? 'Office Hours' : 'After Hours'})`);

    // 2. Fetch all devices
    const devices = await Device.find();
    if (devices.length === 0) {
      logger.warn('No devices found in DB. Skip simulation tick.');
      return;
    }

    // 3. Mutate device states (Parallel DB Writes)
    const savePromises = devices.map(async (device) => {
      let shouldBeOn = device.status === 'on';

      // Special Demo Rule: Force Work Room 1 devices to stay ON between 10:00 AM and 1:00 PM
      // to trigger the prolonged-on alert (on for >2 hours).
      if (device.room === 'WorkRoom1' && hour >= 10 && hour < 13) {
        shouldBeOn = true;
      } else if (isOfficeHours) {
        // Office hours: sticky transitions to prevent rapid toggling
        if (device.status === 'on') {
          // 90% chance to stay ON
          shouldBeOn = Math.random() < 0.90;
        } else {
          // 20% chance to turn ON (80% chance to stay OFF)
          shouldBeOn = Math.random() < 0.20;
        }
      } else if (transitionToAfterHours) {
        // Evening close transition (at 5:00 PM close)
        if (device.status === 'on') {
          // 15% chance to stay ON (85% chance to turn OFF)
          shouldBeOn = Math.random() < 0.15;
        } else {
          shouldBeOn = false;
        }
      } else {
        // Overnight hold (5:00 PM - 9:00 AM): Lock current state
        shouldBeOn = device.status === 'on';
      }

      const nextStatus = shouldBeOn ? 'on' : 'off';

      if (device.status !== nextStatus) {
        device.status = nextStatus;
        device.lastChanged = simulatedTime;
        device.onSince = nextStatus === 'on' ? simulatedTime : null;
        await device.save();
      }
    });

    await Promise.all(savePromises);

    // Special Demo Rule: After-hours guarantee
    // Ensure at least 1-2 devices remain ON during after-hours in some room
    // so judges can observe the after-hours alert.
    if (!isOfficeHours) {
      const activeDevices = devices.filter((d) => d.status === 'on');
      if (activeDevices.length === 0) {
        logger.info('After hours: No devices are ON. Forcing 1-2 devices ON for alert demonstration.');
        const countToTurnOn = Math.floor(Math.random() * 2) + 1; // 1 or 2
        const forcePromises = [];
        for (let i = 0; i < countToTurnOn; i++) {
          const randomIndex = Math.floor(Math.random() * devices.length);
          const device = devices[randomIndex];
          device.status = 'on';
          device.lastChanged = simulatedTime;
          device.onSince = simulatedTime;
          forcePromises.push(device.save());
        }
        await Promise.all(forcePromises);
      }
    }

    // Refetch mutated devices
    const updatedDevices = await Device.find();

    // 4. Run Alert Evaluation Engine
    await evaluateAlerts(updatedDevices);

    // Get usage summary for broadcast
    const summary = await getUsageSummary(simulatedTime);

    // 6. Broadcast snapshot to dashboard clients via Socket.io IMMEDIATELY
    if (!isFastForwarding) {
      try {
        const io = getIO();
        io.emit('device:update', {
          devices: updatedDevices,
          simulatedTime,
          ...summary,
        });
      } catch (err) {
        // Socket.io not initialized
      }
    }

    // 5. Save usage snapshot in background (asynchronously, do not block)
    saveUsageSnapshot(summary.totalWattsNow, summary.perRoomWatts, simulatedTime)
      .catch((error) => logger.error('Error saving usage snapshot in background:', error));

  } catch (error) {
    logger.error('Error running simulation tick:', error);
  }
};

const evaluateAlerts = async (devices: IDevice[]): Promise<void> => {
  const hour = simulatedTime.getHours();
  const isOfficeHours = hour >= simulatorConfig.officeStartHour && hour < simulatorConfig.officeEndHour;

  // Rule 1: After-hours Alerts
  if (!isOfficeHours) {
    // If after-hours, any device that is ON triggers an after-hours alert
    for (const device of devices) {
      if (device.status === 'on') {
        const message = `${device.label} left ON in ${device.room} room after hours.`;
        await triggerAlert('after-hours', device.deviceId, message, simulatedTime);
      } else {
        // Resolve if device is now turned OFF
        await resolveAlert('after-hours', device.deviceId, simulatedTime);
      }
    }
  } else {
    // If it is office hours, resolve all active after-hours alerts
    const activeAfterHoursAlerts = await Alert.find({ type: 'after-hours', resolvedAt: null });
    for (const alert of activeAfterHoursAlerts) {
      await resolveAlert('after-hours', alert.scope, simulatedTime);
    }
  }

  // Rule 2: Prolonged-on Alerts
  // A room where ALL devices have been continuously on for >2 hours
  const rooms = ['DrawingRoom', 'WorkRoom1', 'WorkRoom2'];
  for (const room of rooms) {
    const roomDevices = devices.filter((d) => d.room === room);
    const allOn = roomDevices.every((d) => d.status === 'on');
    
    let isProlongedOn = false;
    if (allOn) {
      // Check if for all devices in the room, the onSince is older than 2 simulated hours
      const twoHoursAgoMs = simulatedTime.getTime() - 2 * 60 * 60 * 1000;
      isProlongedOn = roomDevices.every(
        (d) => d.onSince && d.onSince.getTime() <= twoHoursAgoMs
      );
    }

    if (isProlongedOn) {
      const message = `All devices in ${room} room have been ON for more than 2 hours.`;
      await triggerAlert('prolonged-on', room, message, simulatedTime);
    } else {
      // If not prolonged on, resolve any active alert for this room
      await resolveAlert('prolonged-on', room, simulatedTime);
    }
  }
};

export const startSimulator = async (): Promise<void> => {
  const tickRateMs = Number(process.env.SIMULATOR_TICK_RATE_MS) || 10000;
  
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
  }
  
  logger.info(`Starting Simulator Service - Tick Rate: ${tickRateMs}ms`);

  try {
    const historyCount = await UsageHistory.countDocuments();
    if (historyCount < 72) {
      logger.info(`Usage history count is ${historyCount}. Initiating 24-hour fast-forward catch-up...`);
      isFastForwarding = true;
      setSuppressSocketEmissions(true);

      // Clear existing partial history
      await UsageHistory.deleteMany({});

      // Set simulator time to 24 hours ago
      const nowTime = new Date();
      const startTime = new Date(nowTime.getTime() - 24 * 60 * 60 * 1000);
      setSimulatedTime(startTime);

      // Run 72 ticks to simulate 24 hours of activity (20 mins per tick)
      for (let i = 0; i < 72; i++) {
        await runSimulationTick();
      }

      isFastForwarding = false;
      setSuppressSocketEmissions(false);
      logger.info('24-hour fast-forward catch-up completed successfully.');
    }
  } catch (err) {
    logger.error('Error during simulator fast-forward catch-up:', err);
    isFastForwarding = false;
    setSuppressSocketEmissions(false);
  }
  
  // Run first regular tick immediately
  await runSimulationTick();
  
  simulatorInterval = setInterval(runSimulationTick, tickRateMs);
};

export const stopSimulator = (): void => {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
    logger.info('Simulator Service stopped.');
  }
};

export const manualToggleDevice = async (deviceId: string, status: 'on' | 'off'): Promise<IDevice> => {
  const device = await Device.findOne({ deviceId });
  if (!device) {
    throw new Error(`Device not found: ${deviceId}`);
  }

  device.status = status;
  device.lastChanged = simulatedTime;
  device.onSince = status === 'on' ? simulatedTime : null;
  await device.save();

  // Refetch all devices for alert evaluation and broadcast
  const allDevices = await Device.find();
  await evaluateAlerts(allDevices);

  // Broadcast state instantly via socket
  const summary = await getUsageSummary(simulatedTime);
  try {
    const io = getIO();
    io.emit('device:update', {
      devices: allDevices,
      simulatedTime,
      ...summary,
    });
  } catch (err) {
    // Socket.io not initialized
  }

  // Save snapshot in background
  saveUsageSnapshot(summary.totalWattsNow, summary.perRoomWatts, simulatedTime)
    .catch((error) => logger.error('Error saving usage snapshot in background:', error));

  return device;
};

export const setSimulatorHour = async (hour: number): Promise<Date> => {
  if (hour < 0 || hour > 23) {
    throw new Error('Hour must be between 0 and 23');
  }

  const nextTime = new Date(simulatedTime);
  nextTime.setHours(hour, 0, 0, 0);
  simulatedTime = nextTime;

  // Reset wasOfficeHours so transition triggers are re-evaluated next tick
  wasOfficeHours = null;

  // Trigger a simulator tick immediately to evaluate status and alerts for the new hour
  await runSimulationTick();

  return simulatedTime;
};
