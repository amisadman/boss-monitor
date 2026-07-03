import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as usageService from './usage.service';
import { getSimulatedTime } from '../simulator/simulator.service';

export const getUsageSummary = catchAsync(async (req: Request, res: Response) => {
  const simulatedTime = getSimulatedTime();
  const summary = await usageService.getUsageSummary(simulatedTime);
  
  return sendResponse(res, 200, true, 'Usage summary retrieved successfully', summary);
});

export const getUsageHistory = catchAsync(async (req: Request, res: Response) => {
  const history = await usageService.getUsageHistory();
  
  return sendResponse(res, 200, true, 'Usage history retrieved successfully', history);
});
