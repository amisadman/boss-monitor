import { Router } from 'express';
import * as alertController from './alert.controller';
import { validate } from '../../middleware/validateRequest';
import { ackAlertSchema } from './alert.validator';

const router = Router();

router.get('/', alertController.getAlerts);
router.post('/:id/ack', validate(ackAlertSchema), alertController.acknowledgeAlert);

export const alertRouter = router;
