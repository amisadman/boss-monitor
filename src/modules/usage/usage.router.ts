import { Router } from 'express';
import * as usageController from './usage.controller';

const router = Router();

router.get('/', usageController.getUsageSummary);
router.get('/history', usageController.getUsageHistory);

export const usageRouter = router;
