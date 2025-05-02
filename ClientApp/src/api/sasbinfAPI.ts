import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react'
import { Login } from '../schemas/login'

// Define a service using a base URL and expected endpoints
export const sasbinf = createApi({
    reducerPath: 'sasbinfAPI',
    baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
    endpoints: (build) => ({
      getHealth: build.query<{ message: string }, void>({  // Espera um objeto com a chave message
        query: () => "health",
      }),
      postLogin: build.mutation({
        query: (login:Login) => ({
          url: "login",
          method: "POST",
          body: login
        }),
      })
    }
  ),
  })

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetHealthQuery, usePostLoginMutation } = sasbinf