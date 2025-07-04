import * as v from "valibot";

export const AvailableRoomsSchema = v.object({
  availableRooms: v.array(
    v.object({
      id: v.pipe(v.number(), v.integer()),
      name: v.string(),
    })
  ),
});

export type AvailableRooms = v.InferInput<typeof AvailableRoomsSchema>;

export type Room = v.InferInput<typeof RoomSchema>;
export const RoomSchema = v.object({
  roomId: v.pipe(v.number(), v.integer()),
  capacity: v.pipe(v.number(), v.integer()),
  isActive: v.boolean(),
  name: v.string(),
});

export type Rooms = v.InferInput<typeof RoomArraySchema>;
export const RoomArraySchema = v.array(RoomSchema);

export type BookRequest = {
  day: string;
  startTime: string;
  endTime: string;
  roomId: number;
};
