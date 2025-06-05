import * as v from "valibot";

export type Member = v.InferInput<typeof MemberSchema>;
export const MemberSchema = v.object({
  userName: v.string(),
  memberId: v.number(),
  timedOutUntil: v.date(),
});
