import { Router } from 'express';
import { manualToggleDevice, setSimulatorHour } from './simulator.service';

const router = Router();

// POST /api/simulator/device - Manually toggle device status
router.post('/device', async (req, res) => {
  try {
    const { deviceId, status } = req.body;
    if (!deviceId || !status || (status !== 'on' && status !== 'off')) {
      return res.status(400).json({ error: "Required fields: deviceId, status ('on' | 'off')" });
    }

    const updatedDevice = await manualToggleDevice(deviceId, status);
    return res.status(200).json({ success: true, device: updatedDevice });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

// POST /api/simulator/time - Fast-forward/reset virtual time to a specific hour
router.post('/time', async (req, res) => {
  try {
    const { hour } = req.body;
    if (hour === undefined || typeof hour !== 'number' || hour < 0 || hour > 23) {
      return res.status(400).json({ error: 'Required field: hour (number between 0 and 23)' });
    }

    const updatedTime = await setSimulatorHour(hour);
    return res.status(200).json({ success: true, simulatedTime: updatedTime });
  } catch (error: any) {
    return res.status(500).json({ error: error.message || 'Internal server error' });
  }
});

export const simulatorRouter = router;
