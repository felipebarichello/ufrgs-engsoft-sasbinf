import * as v from 'valibot';

/*
* TODO: this is just a placeholder for future values. 
* We need to distinguish between notification types because transfers are confirmed through notification
*/
export const NotficationsSchema = v.array(v.object({
    description: v.string(),
    type: v.union([v.literal('TRANSFER_CONFIRMATION'), v.literal('SIMPLE')]),
    status: v.string(),
    id: v.pipe(v.number(), v.integer())
}));
export type Notifications = v.InferInput<typeof NotficationsSchema>;