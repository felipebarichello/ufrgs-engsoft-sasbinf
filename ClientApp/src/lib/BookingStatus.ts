export const BookingStatus = {
    BOOKED: "BOOKED",
    CLAIMED: "CLAIMED",
    MISSED: "MISSED",
    CANCELLED: "CANCELLED",
    WITHDRAWN: "WITHDRAWN",
    TRANSFERRING: "TRANSFERRING",
} as const;

export type BookingStatusType = typeof BookingStatus[keyof typeof BookingStatus];
