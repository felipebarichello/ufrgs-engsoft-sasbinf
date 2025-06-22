export const BookingStatus = {
    Booked: "BOOKED",
    Claimed: "CLAIMED",
    Missed: "MISSED",
    Cancelled: "CANCELLED",
    Withdrawn: "WITHDRAWN",
    Transferring: "TRANSFERRING",
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];
