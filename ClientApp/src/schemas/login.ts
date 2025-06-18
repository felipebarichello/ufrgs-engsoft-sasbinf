import * as v from 'valibot';

export interface Login {
	user: string;
	password: string;
}

export const LoginResponseSchema = v.object({
	token: v.string(),
	expiration: v.string(),
});

export type LoginResponse = v.InferInput<typeof LoginResponseSchema>;
