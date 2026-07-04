import { z } from 'zod';

export const getRoomDevicesSchema = z.object({
  params: z.object({
    room: z.enum(['DrawingRoom', 'WorkRoom1', 'WorkRoom2'], {
      errorMap: () => ({ message: "Room must be one of: 'DrawingRoom', 'WorkRoom1', or 'WorkRoom2'" }),
    }),
  }),
});
