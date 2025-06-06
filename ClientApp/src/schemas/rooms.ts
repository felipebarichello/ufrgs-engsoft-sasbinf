import * as v from "valibot";

export const AvailableRoomsSchema = v.object({
  availableRoomsIDs: v.array(v.pipe(v.number(), v.integer())),
});

export type AvailableRooms = v.InferInput<typeof AvailableRoomsSchema>;

export type BookRequest = {
  day: string;
  startTime: string;
  endTime: string;
  roomId: number;
};

export type Rooms = v.InferInput<typeof RoomsSchema>;
export const RoomsSchema = v.array(
  v.object({
    roomId: v.number(),
    capacity: v.number(),
    isActive: v.boolean(),
    name: v.string(),
  })
);
