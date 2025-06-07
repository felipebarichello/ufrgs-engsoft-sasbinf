import * as v from "valibot";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Login, LoginResponseSchema } from "../schemas/login";
import {
  AvailableRoomsSchema,
  BookRequest,
  RoomsSchema,
} from "../schemas/rooms";
import { BookingArraySchema } from "../schemas/booking";
import { RoomFilters } from "../pages/RoomsPage";
import { MembersSchema } from "../schemas/member";
import { MyBooking, MyBookingsResponseSchema } from '../schemas/myBookings';
import { HeaderBuilder } from "../lib/headers";

// Define a service using a base URL and expected endpoints
export const sasbinf = createApi({
  reducerPath: "sasbinfAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    getHealth: build.query<{ message: string }, void>({
      // Espera um objeto com a chave message
      query: () => "health",
    }),

    postLogin: build.mutation({
      query: (login: Login) => ({
        url: "auth/login",
        method: "POST",
        body: login,
      }),
      transformErrorResponse: () => ({ message: "Credenciais inválidas" }),
      transformResponse: (response) => {
        try {
          return v.parse(LoginResponseSchema, response);
        } catch {
          throw new Error("Ops. Algo deu errado com o seu login.");
        }
      },
    }),

    postAvailableRoomsSearch: build.query<number[], RoomFilters>({
      query: (filters: RoomFilters) => ({
        url: "rooms/available-rooms-search",
        method: "POST",
        body: filters,
        headers: new HeaderBuilder()
          .withAuthToken()
          .build(),
      }),
      transformResponse: (response) => {
        try {
          return v.parse(AvailableRoomsSchema, response).availableRoomsIDs;
        } catch (e) {
          throw new Error("Algo deu errado com a sua pesquisa. Erro: " + e);
        }
      },
    }),

    postRoomBookRequest: build.mutation({
      query: (req: BookRequest) => ({
        url: "rooms/book",
        method: "POST",
        body: req,
        headers: new HeaderBuilder()
          .withAuthToken()
          .build(),
      }),
      transformErrorResponse: (e) => {
        alert("Falha ao alugar sala" + e);
        return { message: "Falha ao alugar sala: " + e };
      },
      transformResponse: (e) => {
        console.log(e);
        alert(
          "A sala foi reservada com sucesso."
        ); /* Return the parsed result? */
      },
    }),

    postLoginManager: build.mutation({
      query: (login: Login) => ({
        url: "auth/login/manager",
        method: "POST",
        body: login,
      }),
      transformErrorResponse: () => ({ message: "Credenciais inválidas" }),
      transformResponse: (response) => {
        try {
          return v.parse(LoginResponseSchema, response);
        } catch {
          throw new Error("Algo deu errado com o seu login");
        }
      },
    }),

    postCreateRoom: build.mutation({
      query: ({
        name,
        capacity,
        token,
      }: {
        name: string;
        capacity: number;
        token: string;
      }) => ({
        url: "manager/create-room",
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
        body: {
          name,
          capacity,
        },
      }),
    }),

    deleteRoom: build.mutation({
      query: ({ roomId, token }: { roomId: number; token: string }) => ({
        url: `manager/delete-room/${roomId}`,
        method: "DELETE",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
    }),

    postRoomActivation: build.mutation({
      query: ({
        roomId,
        isActive,
        token,
      }: {
        roomId: number;
        isActive: boolean;
        token: string;
      }) => ({
        url: `manager/activation-room/${roomId}/${isActive}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
    }),

    getRoomsHistorySearch: build.query({
      query: ({
        roomId,
        numberOfBooks,
        token,
      }: {
        roomId: number;
        numberOfBooks: number;
        token: string;
      }) => ({
        url: `manager/room-history/${roomId}/${numberOfBooks}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
      transformResponse: (response) => {
        try {
          return v.parse(BookingArraySchema, response);
        } catch {
          throw new Error("Falha ao obter histórico de salas");
        }
      },
    }),

    postCheckinAbsence: build.mutation({
      query: ({
        bookingId,
        status,
        token,
      }: {
        bookingId: number;
        status: string;
        token: string;
      }) => ({
        url: `manager/bookings/change-status/${bookingId}/${status}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
    }),

    getMyBookings: build.query<MyBooking[], void>({
      query: () => ({
        url: `rooms/my-bookings`,
        method: "GET",
        headers: new HeaderBuilder()
          .withAuthToken()
          .build(),
      }),
      transformResponse: (response) => {
        try {
          return v.parse(MyBookingsResponseSchema, response);
        } catch (e) {
          throw new Error("Falha ao obter as reservas do usuário. Erro: " + e);
        }
      },
    }),

    postBanMember: build.mutation({
      query: ({
        memberId,
        shouldBan,
        token,
      }: {
        memberId: number;
        shouldBan: boolean;
        token: string;
      }) => ({
        url: `manager/ban-member/${memberId}/${shouldBan}`,
        method: "POST",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
    }),

    postMembers: build.mutation({
      query: ({
        studentName,
        token,
      }: {
        studentName: string | null;
        token: string;
      }) => ({
        url: "manager/students",
        method: "POST",
        body: { name: studentName },
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
      transformErrorResponse: () => ({ message: "Invalid credentials" }),
      transformResponse: (response) => {
        try {
          return v.parse(MembersSchema, response);
        } catch {
          throw new Error("Invalid credentials");
        }
      },
    }),

    postRooms: build.mutation({
      query: ({
        roomName,
        capacity,
        token,
      }: {
        roomName: string | null;
        capacity: number | null;
        token: string;
      }) => ({
        url: "manager/rooms",
        method: "POST",
        body: { name: roomName, capacity: capacity },
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
      transformErrorResponse: () => ({ message: "Invalid credentials" }),
      transformResponse: (response) => {
        try {
          return v.parse(RoomsSchema, response);
        } catch {
          throw new Error("Invalid credentials");
        }
      },
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetHealthQuery,
  useLazyPostAvailableRoomsSearchQuery,
  usePostLoginMutation,
  usePostRoomBookRequestMutation,
  usePostLoginManagerMutation,
  usePostCreateRoomMutation,
  useDeleteRoomMutation,
  usePostRoomActivationMutation,
  useLazyGetRoomsHistorySearchQuery,
  usePostCheckinAbsenceMutation,
  useGetMyBookingsQuery,
  usePostBanMemberMutation,
  usePostMembersMutation,
  usePostRoomsMutation,
} = sasbinf;
