import * as v from "valibot";

export const BookingSchema = v.object({
  bookingId: v.number(),
  userId: v.number(),
  startDate: v.string(),
  endDate: v.string(),
  status: v.string(),
});

export const BookingArraySchema = v.array(BookingSchema);

export type BookingArray = v.InferInput<typeof BookingArraySchema>;
