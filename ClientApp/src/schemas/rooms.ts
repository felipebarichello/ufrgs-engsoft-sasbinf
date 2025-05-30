import * as v from 'valibot';

export const AvailableRoomsSchema =
  v.object({
    availableRoomsIDs: v.array(v.pipe(v.number(), v.integer()))
  });

export type AvailableRooms = v.InferInput<typeof AvailableRoomsSchema>;

export type BookRequest = {
  day: string,
  startTime: string,
  endTime: string,
};

export type Room = {
  id: number,
  name: `Sala 104${string}`,

};
