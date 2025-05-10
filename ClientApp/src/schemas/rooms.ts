import * as v from 'valibot';

export const AvailableRoomsSchema =
  v.object({
    availableRoomsIDs: v.array(v.pipe(v.number(), v.integer()))
  });

export type AvailableRooms = v.InferInput<typeof AvailableRoomsSchema>

