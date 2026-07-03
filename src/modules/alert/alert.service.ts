import { Alert, IAlert } from './alert.model';
import { getIO } from '../../utils/socket';

export const getAlerts = async (query: Record<string, any> = {}): Promise<IAlert[]> => {
  return await Alert.find(query);
};

export const acknowledgeAlert = async (id: string): Promise<IAlert | null> => {
  return await Alert.findByIdAndUpdate(id, { notifiedDiscord: true }, { new: true });
};

export const triggerAlert = async (
  type: 'after-hours' | 'prolonged-on',
  scope: string,
  message: string,
  simulatedTime: Date
): Promise<IAlert | null> => {
  // Check if there is already an active alert for the same type and scope
  const activeAlert = await Alert.findOne({ type, scope, resolvedAt: null });
  if (activeAlert) {
    return activeAlert;
  }

  const newAlert = new Alert({
    type,
    scope,
    message,
    triggeredAt: simulatedTime,
    resolvedAt: null,
    notifiedDiscord: false,
  });

  await newAlert.save();

  // Broadcast to all dashboard clients
  try {
    const io = getIO();
    io.emit('alert:new', newAlert);
  } catch (err) {
    // Socket io might not be initialized (e.g. during script validation tests)
  }

  return newAlert;
};

export const resolveAlert = async (
  type: 'after-hours' | 'prolonged-on',
  scope: string,
  simulatedTime: Date
): Promise<IAlert | null> => {
  const activeAlert = await Alert.findOne({ type, scope, resolvedAt: null });
  if (!activeAlert) return null;

  activeAlert.resolvedAt = simulatedTime;
  await activeAlert.save();

  try {
    const io = getIO();
    io.emit('alert:resolved', activeAlert);
  } catch (err) {
    // Socket io not initialized
  }

  return activeAlert;
};
