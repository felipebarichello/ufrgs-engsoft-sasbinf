import * as v from "valibot";

export type Member = v.InferInput<typeof MembersSchema>;
export const MembersSchema = v.object({
  username: v.string(),
  memberId: v.number(),
  timedOutUntil: v.nullable(v.string()),
});

export type MemberArray = v.InferInput<typeof MemberArraySchema>;
export const MemberArraySchema = v.array(MembersSchema);
