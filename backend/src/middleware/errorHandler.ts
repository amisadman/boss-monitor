import { Request, Response, NextFunction } from 'express';
import { sendResponse } from '../utils/response';
import { logger } from '../utils/logger';

export const errorHandler = (
  err: any,
  req: Request,
  res: Response,
  next: NextFunction
): void => {
  logger.error('Unhandled Error:', err);

  const status = err.statusCode || 500;
  const message = err.message || 'Internal Server Error';

  sendResponse(
    res,
    status,
    false,
    message,
    process.env.NODE_ENV === 'development' ? err.stack : undefined
  );
};
