import { Router } from 'express';
import * as usageController from './usage.controller';

const router = Router();

router.get('/', usageController.getUsageSummary);
router.get('/history', usageController.getUsageHistory);
router.get('/hourly', usageController.getHourlyUsage);

export const usageRouter = router;
