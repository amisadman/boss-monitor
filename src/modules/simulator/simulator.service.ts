import { Device, IDevice } from '../device/device.model';
import { Alert } from '../alert/alert.model';
import { triggerAlert, resolveAlert } from '../alert/alert.service';
import { saveUsageSnapshot, getUsageSummary } from '../usage/usage.service';
import { getIO } from '../../utils/socket';
import { logger } from '../../utils/logger';
import { simulatorConfig } from './simulator.config';

let simulatedTime = new Date();
simulatedTime.setHours(8, 0, 0, 0); // Start at 8:00 AM today

let simulatorInterval: NodeJS.Timeout | null = null;

export const getSimulatedTime = (): Date => {
  return simulatedTime;
};

// For testing purposes
export const setSimulatedTime = (time: Date): void => {
  simulatedTime = time;
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
    
    logger.info(`Simulator Tick - Virtual Time: ${simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${isOfficeHours ? 'Office Hours' : 'After Hours'})`);

    // 2. Fetch all devices
    const devices = await Device.find();
    if (devices.length === 0) {
      logger.warn('No devices found in DB. Skip simulation tick.');
      return;
    }

    // 3. Mutate device states
    for (const device of devices) {
      let shouldBeOn = false;

      // Special Demo Rule: Force Work Room 1 devices to stay ON between 10:00 AM and 1:00 PM
      // to trigger the prolonged-on alert (on for >2 hours).
      if (device.room === 'work1' && hour >= 10 && hour < 13) {
        shouldBeOn = true;
      } else if (isOfficeHours) {
        // Office hours probability: 80% on
        shouldBeOn = Math.random() < simulatorConfig.officeHoursOnProbability;
      } else {
        // After hours probability: 10% on
        shouldBeOn = Math.random() < simulatorConfig.afterHoursOnProbability;
      }

      const nextStatus = shouldBeOn ? 'on' : 'off';

      if (device.status !== nextStatus) {
        device.status = nextStatus;
        device.lastChanged = simulatedTime;
        device.onSince = nextStatus === 'on' ? simulatedTime : null;
        await device.save();
      }
    }

    // Special Demo Rule: After-hours guarantee
    // Ensure at least 1-2 devices remain ON during after-hours in some room
    // so judges can observe the after-hours alert.
    if (!isOfficeHours) {
      const activeDevices = devices.filter((d) => d.status === 'on');
      if (activeDevices.length === 0) {
        logger.info('After hours: No devices are ON. Forcing 1-2 devices ON for alert demonstration.');
        const countToTurnOn = Math.floor(Math.random() * 2) + 1; // 1 or 2
        for (let i = 0; i < countToTurnOn; i++) {
          const randomIndex = Math.floor(Math.random() * devices.length);
          const device = devices[randomIndex];
          device.status = 'on';
          device.lastChanged = simulatedTime;
          device.onSince = simulatedTime;
          await device.save();
        }
      }
    }

    // Refetch mutated devices
    const updatedDevices = await Device.find();

    // 4. Run Alert Evaluation Engine
    await evaluateAlerts(updatedDevices);

    // 5. Save usage snapshot
    const summary = await getUsageSummary(simulatedTime);
    await saveUsageSnapshot(summary.totalWattsNow, summary.perRoomWatts, simulatedTime);

    // 6. Broadcast snapshot to dashboard clients via Socket.io
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
  const rooms = ['drawing', 'work1', 'work2'];
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

export const startSimulator = (): void => {
  const tickRateMs = Number(process.env.SIMULATOR_TICK_RATE_MS) || 10000;
  
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
  }
  
  logger.info(`Starting Simulator Service - Tick Rate: ${tickRateMs}ms`);
  
  // Run first tick immediately
  runSimulationTick();
  
  simulatorInterval = setInterval(runSimulationTick, tickRateMs);
};

export const stopSimulator = (): void => {
  if (simulatorInterval) {
    clearInterval(simulatorInterval);
    simulatorInterval = null;
    logger.info('Simulator Service stopped.');
  }
};
