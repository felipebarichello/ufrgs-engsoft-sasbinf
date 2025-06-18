import * as v from 'valibot';

export const MyBookingSchema = v.object({
	bookingId: v.number(),
	roomName: v.string(),
	startTime: v.string(),
	endTime: v.string(),
});

export const MyBookingsResponseSchema = v.array(MyBookingSchema);

export type MyBooking = v.InferInput<typeof MyBookingSchema>;
