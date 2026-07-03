import { z } from 'zod';
import mongoose from 'mongoose';

export const ackAlertSchema = z.object({
  params: z.object({
    id: z.string().refine((val) => mongoose.Types.ObjectId.isValid(val), {
      message: 'Invalid Alert ID format',
    }),
  }),
});
