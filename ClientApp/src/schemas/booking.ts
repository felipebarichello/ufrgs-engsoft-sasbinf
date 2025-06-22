import * as v from "valibot";

export type Booking = v.InferInput<typeof BookingSchema>;
export const BookingSchema = v.object({
  bookingId: v.number(),
  userId: v.number(),
  userName: v.string(),
  roomId: v.number(),
  roomName: v.string(),
  startDate: v.string(),
  endDate: v.string(),
  status: v.string(),
});

export type BookingIdArray = v.InferInput<typeof BookingIdArraySchema>;
export const BookingIdArraySchema = v.array(v.number());
