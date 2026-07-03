import { Request, Response } from 'express';
import { catchAsync } from '../../utils/catchAsync';
import { sendResponse } from '../../utils/response';
import * as deviceService from './device.service';
import { QueryBuilder } from '../../utils/queryBuilder';
import { Device } from './device.model';

export const getAllDevices = catchAsync(async (req: Request, res: Response) => {
  const devicesQuery = new QueryBuilder(Device.find(), req.query)
    .filter()
    .sort()
    .paginate();

  const devices = await devicesQuery.modelQuery;
  
  return sendResponse(res, 200, true, 'Devices retrieved successfully', devices);
});

export const getRoomDevices = catchAsync(async (req: Request, res: Response) => {
  const { room } = req.params;
  const devices = await deviceService.getDevicesByRoom(room);
  
  return sendResponse(res, 200, true, `Devices for room ${room} retrieved successfully`, devices);
});
