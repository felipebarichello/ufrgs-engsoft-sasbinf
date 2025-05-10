import * as v from 'valibot';

export const AvailableRoomsSchema = v.array(
  v.pipe(
    v.number(),       // base schema: número
    v.integer()       // valida se é inteiro
  )
);

export type AvailableRooms = v.InferInput<typeof AvailableRoomsSchema>

