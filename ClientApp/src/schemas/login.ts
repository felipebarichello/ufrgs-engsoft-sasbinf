import * as v from 'valibot'

export const LoginSchema = v.object({
    user: v.string(),
    password: v.string(),
})

export type Login = v.InferInput<typeof LoginSchema>

export const LoginResponseSchema = v.object({
    token: v.string(),
    expiration: v.string(),
})

export type LoginResponse = v.InferInput<typeof LoginResponseSchema>

