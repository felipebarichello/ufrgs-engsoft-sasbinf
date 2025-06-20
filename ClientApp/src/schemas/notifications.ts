import * as v from 'valibot';

/*
* TODO: this is just a placeholder for future values. 
* We need to distinguish between notification types because transfers are confirmed through notification
*/
export const NotficationsSchema = v.array(v.object({
    body: v.string(),
    kind: v.pipe(v.number(), v.integer()),
    notificationId: v.pipe(v.number(), v.integer()),
    memberId: v.pipe(v.number(), v.integer()),
    createdAt: v.string(),
}));
export type Notifications = v.InferInput<typeof NotficationsSchema>;