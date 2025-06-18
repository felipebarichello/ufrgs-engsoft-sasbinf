import * as v from "valibot";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Login, LoginResponseSchema } from "../schemas/login";
import {
  AvailableRoomsSchema,
  BookRequest,
  RoomArraySchema,
} from "../schemas/rooms";
import { BookingArraySchema } from "../schemas/booking";
import { RoomFilters } from "../pages/RoomsPage";
import { MemberArraySchema } from "../schemas/member";
import { MyBooking, MyBookingsResponseSchema } from "../schemas/myBookings";
import { HeaderBuilder } from "../lib/headers";
import { NotficationsSchema } from "../schemas/notifications";

// Define a service using a base URL and expected endpoints
export const sasbinf = createApi({
  reducerPath: "sasbinfAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  endpoints: (build) => ({
    getHealth: build.query<{ message: string; }, void>({
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

    postAvailableRoomsSearch: build.query<
      { name: string; id: number; }[],
      RoomFilters
    >({
      query: (filters: RoomFilters) => ({
        url: "rooms/available-rooms-search",
        method: "POST",
        body: filters,
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformResponse: (response) => {
        try {
          return v.parse(AvailableRoomsSchema, response).availableRooms;
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
        headers: new HeaderBuilder().withAuthToken().build(),
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
      query: ({ roomId, token }: { roomId: number; token: string; }) => ({
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

    getMemberRoomsHistorySearch: build.query({
      query: ({
        memberId: memberId,
        numberOfBooks,
        token,
      }: {
        memberId: number;
        numberOfBooks: number;
        token: string;
      }) => ({
        url: `manager/member-history/${memberId}/${numberOfBooks}`,
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
        headers: new HeaderBuilder().withAuthToken().build(),
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
        memberName,
        token,
      }: {
        memberName: string | null;
        token: string;
      }) => ({
        url: "manager/members",
        method: "POST",
        body: { name: memberName },
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
      transformErrorResponse: () => ({ message: "Invalid credentials" }),
      transformResponse: (response) => {
        try {
          return v.parse(MemberArraySchema, response);
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
      transformErrorResponse: () => ({
        message: "Algo deu errado ao criar a sala",
      }),
      transformResponse: (response) => {
        try {
          return v.parse(RoomArraySchema, response);
        } catch {
          throw new Error("Algo deu errado ao criar a sala");
        }
      },
    }),

    postCancelBooking: build.mutation({
      query: ({ bookingId }: { bookingId: number; }) => ({
        url: `rooms/cancel-booking`,
        method: "POST",
        headers: new HeaderBuilder().withAuthToken().build(),
        body: { bookingId },
      }),
      transformResponse: () => ({ success: true }),
      transformErrorResponse: () => ({ success: false }),
    }),

    getNotifications: build.query({
      query: () => ({
        url: 'notifications',
        method: 'GET',
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformResponse: (e) => {
        try {
          return v.parse(NotficationsSchema, e);
        } catch {
          throw new Error('Algo falhou ao buscar suas notificações. Tente novamente mais tarde');
        }
      },
    }),

    deleteNotification: build.mutation({
      query: (id: number) => ({
        url: `delete-notification/${id}`,
        method: 'DELETE',
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformResponse: (e) => {
        return { message: "Notification deleted." + e };
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
  useLazyGetMemberRoomsHistorySearchQuery,
  usePostCheckinAbsenceMutation,
  useGetMyBookingsQuery,
  usePostBanMemberMutation,
  usePostMembersMutation,
  usePostRoomsMutation,
  usePostCancelBookingMutation,
  useGetNotificationsQuery,
  useDeleteNotificationMutation
} = sasbinf;
