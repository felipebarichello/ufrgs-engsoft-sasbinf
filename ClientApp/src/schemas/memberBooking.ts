import * as v from 'valibot';

export const MemberBookingResponseSchema = v.object({
  bookingId: v.number(),
  roomName: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  status: v.string(),
});
