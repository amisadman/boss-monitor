import { Request, Response, NextFunction } from 'express';
import { AnyZodObject } from 'zod';
import { sendResponse } from '../utils/response';

export const validate = (schema: AnyZodObject) => {
  return async (req: Request, res: Response, next: NextFunction): Promise<void> => {
    try {
      await schema.parseAsync({
        body: req.body,
        query: req.query,
        params: req.params,
      });
      next();
    } catch (error: any) {
      sendResponse(
        res,
        400,
        false,
        'Validation error',
        error.errors || error.message
      );
    }
  };
};
