import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as alertService from './alert.service';
import { QueryBuilder } from '../../utils/queryBuilder';
import { Alert } from './alert.model';

export const getAlerts = catchAsync(async (req: Request, res: Response) => {
  const alertsQuery = new QueryBuilder(Alert.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const alerts = await alertsQuery.modelQuery;
  
  return sendResponse(res, 200, true, 'Alerts retrieved successfully', alerts);
});

export const acknowledgeAlert = catchAsync(async (req: Request, res: Response) => {
  const { id } = req.params;
  const updatedAlert = await alertService.acknowledgeAlert(id);
  
  if (!updatedAlert) {
    return sendResponse(res, 404, false, 'Alert not found');
  }
  
  return sendResponse(res, 200, true, 'Alert acknowledged successfully', updatedAlert);
});
