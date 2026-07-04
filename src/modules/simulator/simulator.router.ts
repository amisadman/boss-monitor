import { Router } from 'express';
import { manualToggleDevice, setSimulatorHour } from './simulator.service';
import { sendResponse } from '../../utils/response';

const router = Router();

router.post('/device', async (req, res) => {
  try {
    const { deviceId, status } = req.body;
    if (!deviceId || !status || (status !== 'on' && status !== 'off')) {
      return sendResponse(res, 400, false, "Required fields: deviceId, status ('on' | 'off')");
    }

    const updatedDevice = await manualToggleDevice(deviceId, status);
    return sendResponse(res, 200, true, 'Device status updated successfully', updatedDevice);
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message || 'Internal server error');
  }
});

router.post('/time', async (req, res) => {
  try {
    const { hour } = req.body;
    if (hour === undefined || typeof hour !== 'number' || hour < 0 || hour > 23) {
      return sendResponse(res, 400, false, 'Required field: hour (number between 0 and 23)');
    }

    const updatedTime = await setSimulatorHour(hour);
    return sendResponse(res, 200, true, 'Virtual time updated successfully', { simulatedTime: updatedTime });
  } catch (error: any) {
    return sendResponse(res, 500, false, error.message || 'Internal server error');
  }
});

export const simulatorRouter = router;
