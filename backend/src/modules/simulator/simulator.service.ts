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
    // Advance virtual time (e.g. 10 real seconds * 120 multiplier = 20 simulated minutes)
    const tickRateMs = Number(process.env.SIMULATOR_TICK_RATE_MS) || 10000;
    const multiplier = Number(process.env.SIMULATOR_CLOCK_SPEED) || 120;
    const timeToAdvanceMs = tickRateMs * multiplier;
    
    simulatedTime = new Date(simulatedTime.getTime() + timeToAdvanceMs);
    
    const hour = simulatedTime.getHours();
    const isOfficeHours = hour >= simulatorConfig.officeStartHour && hour < simulatorConfig.officeEndHour;
    
    const transitionToAfterHours = wasOfficeHours === true && !isOfficeHours;
    wasOfficeHours = isOfficeHours;

    logger.info(`Simulator Tick - Virtual Time: ${simulatedTime.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' })} (${isOfficeHours ? 'Office Hours' : 'After Hours'})`);

    const devices = await Device.find();
    if (devices.length === 0) {
      logger.warn('No devices found in DB. Skip simulation tick.');
      return;
    }
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

    // Demo Rule: Ensure active devices during after-hours to show alerts
    if (!isOfficeHours) {
      const activeDevices = devices.filter((d) => d.status === 'on');
      if (activeDevices.length === 0) {
        logger.info('After hours: No devices are ON. Forcing 1-2 devices ON for alert demonstration.');
        const countToTurnOn = Math.floor(Math.random() * 2) + 1;
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

    const updatedDevices = await Device.find();

    await evaluateAlerts(updatedDevices);

    const summary = await getUsageSummary(simulatedTime);

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
    for (const device of devices) {
      if (device.status === 'on') {
        const message = `${device.label} left ON in ${device.room} room after hours.`;
        await triggerAlert('after-hours', device.deviceId, message, simulatedTime);
      } else {
        await resolveAlert('after-hours', device.deviceId, simulatedTime);
      }
    }
  } else {
    const activeAfterHoursAlerts = await Alert.find({ type: 'after-hours', resolvedAt: null });
    for (const alert of activeAfterHoursAlerts) {
      await resolveAlert('after-hours', alert.scope, simulatedTime);
    }
  }

  // Rule 2: Prolonged-on Alerts
  const rooms = ['DrawingRoom', 'WorkRoom1', 'WorkRoom2'];
  for (const room of rooms) {
    const roomDevices = devices.filter((d) => d.room === room);
    const allOn = roomDevices.every((d) => d.status === 'on');
    
    let isProlongedOn = false;
    if (allOn) {
      const twoHoursAgoMs = simulatedTime.getTime() - 2 * 60 * 60 * 1000;
      isProlongedOn = roomDevices.every(
        (d) => d.onSince && d.onSince.getTime() <= twoHoursAgoMs
      );
    }

    if (isProlongedOn) {
      const message = `All devices in ${room} room have been ON for more than 2 hours.`;
      await triggerAlert('prolonged-on', room, message, simulatedTime);
    } else {
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

      await UsageHistory.deleteMany({});

      const nowTime = new Date();
      const startTime = new Date(nowTime.getTime() - 24 * 60 * 60 * 1000);
      setSimulatedTime(startTime);

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

  const allDevices = await Device.find();
  await evaluateAlerts(allDevices);

  const summary = await getUsageSummary(simulatedTime);
  try {
    const io = getIO();
    io.emit('device:update', {
      devices: allDevices,
      simulatedTime,
      ...summary,
    });
  } catch (err) {
  }

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

  wasOfficeHours = null;

  await runSimulationTick();

  return simulatedTime;
};
