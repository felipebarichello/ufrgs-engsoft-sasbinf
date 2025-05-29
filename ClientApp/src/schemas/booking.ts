import * as v from 'valibot'

export const BookingSchema = v.object({
    bookingId: v.number(),
    userId: v.number(),
    startDate: v.string(),
    endDate: v.string(),
})

export const BookingArraySchema = v.object({ 
    history: v.array(BookingSchema),
})

export type Booking = v.InferInput<typeof BookingSchema>



