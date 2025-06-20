import * as v from 'valibot';

// enum as an object because valibot
export enum NotificationKind {
    TimedOut,
    UntimedOut,
    RoomMaintenance,
    BookingTransfer,
    TransferAccepted,
    TransferRejected,
};

export const NotficationsSchema = v.array(v.object({
    body: v.string(),
    kind: v.enum(NotificationKind),
    notificationId: v.pipe(v.number(), v.integer()),
    memberId: v.pipe(v.number(), v.integer()),
    createdAt: v.string(),
}));
export type Notifications = v.InferInput<typeof NotficationsSchema>;

