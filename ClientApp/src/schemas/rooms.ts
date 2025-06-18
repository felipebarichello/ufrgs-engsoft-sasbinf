import * as v from 'valibot';

export const AvailableRoomsSchema = v.object({
	availableRooms: v.array(
		v.object({
			id: v.pipe(v.number(), v.integer()),
			name: v.string(),
		})
	),
});

export type AvailableRooms = v.InferInput<typeof AvailableRoomsSchema>;

export type BookRequest = {
	day: string;
	startTime: string;
	endTime: string;
	roomId: number;
};

export type Rooms = v.InferInput<typeof RoomArraySchema>;
export const RoomArraySchema = v.array(
	v.object({
		roomId: v.number(),
		capacity: v.number(),
		isActive: v.boolean(),
		name: v.string(),
	})
);
