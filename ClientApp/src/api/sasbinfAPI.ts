import * as v from 'valibot';
import { createApi, fetchBaseQuery } from '@reduxjs/toolkit/query/react';
import { Login, LoginResponseSchema } from '../schemas/login';
import { RoomFilters } from '../components/RoomsForm';
import { AvailableRoomsSchema, BookRequest } from '../schemas/rooms';

// Define a service using a base URL and expected endpoints
export const sasbinf = createApi({
  reducerPath: 'sasbinfAPI',
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    getHealth: build.query<{ message: string; }, void>({  // Espera um objeto com a chave message
      query: () => "health",
    }),

    postLogin: build.mutation({
      query: (login: Login) => ({
        url: "login",
        method: "POST",
        body: login
      }),
      transformErrorResponse: () => ({ message: "Invalid credentials" }),
      transformResponse: (response) => {
        try {
          return v.parse(LoginResponseSchema, response);
        } catch {
          throw new Error("Invalid credentials");
        }
      }
    }),

    postAvailableRoomsSearch: build.query<number[], RoomFilters>({
      query: (filters: RoomFilters) => ({
        url: "availableRooms",
        method: "POST",
        body: filters
      }),
      transformErrorResponse: (e) => { console.log(e); return { message: "Failed to retrieve available rooms: " + e }; },
      transformResponse: (response) => {
        try {
          return v.parse(AvailableRoomsSchema, response).availableRoomsIDs;
        } catch (e) {
          throw new Error("Failed to parse response: " + e);
        }
      }
    }),

    postRoomBookRequest: build.mutation({
      query: (req: BookRequest) => ({
        url: "book",
        method: "POST",
        body: req
      }),
    })
  }
  ),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetHealthQuery, useLazyPostAvailableRoomsSearchQuery, usePostLoginMutation } = sasbinf;