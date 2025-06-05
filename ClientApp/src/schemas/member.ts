import * as v from "valibot";

export type Members = v.InferInput<typeof MembersSchema>;
export const MembersSchema = v.array(
  v.object({
    userName: v.string(),
    memberId: v.number(),
    timedOutUntil: v.date(),
  })
);
