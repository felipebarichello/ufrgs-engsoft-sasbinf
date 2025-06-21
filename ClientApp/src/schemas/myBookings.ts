import * as v from 'valibot';

export enum BookingStatus {
  Booked = "BOOKED",
  Claimed = "CLAIMED",
  Missed = "MISSED",
  Cancelled = "CANCELLED",
  Withdrawn = "WITHDRAWN",
  Transfering = "TRANSFERING",
}

export const MyBookingSchema = v.object({
  bookingId: v.number(),
  roomName: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  status: v.enum(BookingStatus),
});

export const MyBookingsResponseSchema = v.array(MyBookingSchema);

export type MyBooking = v.InferInput<typeof MyBookingSchema>;
