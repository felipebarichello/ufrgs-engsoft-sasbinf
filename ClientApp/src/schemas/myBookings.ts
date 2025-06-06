import * as v from 'valibot';

export const MyBookingsResponseSchema = v.object({
  bookingId: v.number(),
  roomName: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  status: v.string(),
});
