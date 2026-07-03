import { Device, IDevice } from './device.model';

export const getAllDevices = async (query: Record<string, any> = {}): Promise<IDevice[]> => {
  return await Device.find(query);
};

export const getDevicesByRoom = async (room: string): Promise<IDevice[]> => {
  return await Device.find({ room });
};

export const updateDeviceStatus = async (
  deviceId: string,
  status: 'on' | 'off',
  simulatedTime: Date
): Promise<IDevice | null> => {
  const device = await Device.findOne({ deviceId });
  if (!device) return null;

  if (device.status !== status) {
    device.status = status;
    device.lastChanged = simulatedTime;
    device.onSince = status === 'on' ? simulatedTime : null;
    await device.save();
  }
  
  return device;
};
