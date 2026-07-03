import { z } from 'zod';

export const getRoomDevicesSchema = z.object({
  params: z.object({
    room: z.enum(['drawing', 'work1', 'work2'], {
      errorMap: () => ({ message: "Room must be one of: 'drawing', 'work1', or 'work2'" }),
    }),
  }),
});
