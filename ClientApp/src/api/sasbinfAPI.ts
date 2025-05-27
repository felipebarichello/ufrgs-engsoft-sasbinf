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
        url: "auth/login",
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
        url: "rooms/available-rooms-search",
        method: "POST",
        body: filters
      }),
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
      transformErrorResponse: (e) => { alert('Failed to book room: ' + e); return { message: "Failed to book room: " + e }; },
      transformResponse: (e) => { console.log(e); alert('Room successfully booked!');/* Return the parsed result? */ }
    }),

    postLoginManager: build.mutation({
    query: (login: Login) => ({
      url: "manager/login",
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
  

  postCreateRoom: build.mutation({
    query: ({ name, capacity, token }: { name: string; capacity: number; token: string }) => ({
      url: "manager/create-room",
      method: "POST",
      headers: {
        Authorization: `Bearer ${token}`,
      },
      body: {
        name,
        capacity,
      },
    }),
  }),

  deleteRoom: build.mutation({
    query: ({ roomId, token }: { roomId: string; token: string }) => ({
      url: `manager/delete-room/${roomId}` ,
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      }
    }),
  }),

  getRoomsHistorySearch: build.query({
      query: ({roomId, numberOfBooks, token}: {roomId : string, numberOfBooks: string, token: string}) => ({
        url: `manager/room-history/${roomId}/${numberOfBooks}`,
        method: "GET",
        headers: {
        Authorization: `Bearer ${token}`,
      }
      }),
    }),


  }
  )

});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const { useGetHealthQuery, useLazyPostAvailableRoomsSearchQuery, usePostLoginMutation, usePostLoginManagerMutation, usePostCreateRoomMutation, useDeleteRoomMutation, useLazyGetRoomsHistorySearchQuery } = sasbinf;