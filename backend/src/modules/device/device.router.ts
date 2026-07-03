import { Router } from 'express';
import * as deviceController from './device.controller';
import { validate } from '../../middleware/validateRequest';
import { getRoomDevicesSchema } from './device.validator';

const router = Router();

router.get('/', deviceController.getAllDevices);
router.get('/rooms/:room', validate(getRoomDevicesSchema), deviceController.getRoomDevices);

export const deviceRouter = router;
