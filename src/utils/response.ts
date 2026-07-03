import { Response } from 'express';

export interface ApiResponse<T = any> {
  status: number;
  success: boolean;
  message: string;
  data?: T;
}

export const sendResponse = <T>(
  res: Response,
  status: number,
  success: boolean,
  message: string,
  data?: T
): Response => {
  return res.status(status).json({
    status,
    success,
    message,
    data,
  } as ApiResponse<T>);
};
