import * as v from 'valibot';

export type Booking = v.InferInput<typeof BookingSchema>;
export const BookingSchema = v.object({
	bookingId: v.number(),
	userId: v.number(),
	roomId: v.number(),
	startDate: v.string(),
	endDate: v.string(),
	status: v.string(),
});

export type BookingArray = v.InferInput<typeof BookingArraySchema>;
export const BookingArraySchema = v.array(BookingSchema);
