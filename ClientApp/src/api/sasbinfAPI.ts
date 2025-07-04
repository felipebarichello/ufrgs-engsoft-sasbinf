import * as v from "valibot";
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Login, LoginResponseSchema } from "../schemas/login";
import {
  AvailableRoomsSchema,
  BookRequest,
  Room,
  RoomArraySchema,
  RoomSchema,
} from "../schemas/rooms";
import {
  Booking,
  BookingIdArray,
  BookingIdArraySchema,
  BookingSchema,
} from "../schemas/booking";
import { RoomFilters } from "../pages/RoomsPage";
import { Member, MemberArraySchema, MembersSchema } from "../schemas/member";
import { MyBooking, MyBookingsResponseSchema } from "../schemas/myBookings";
import { HeaderBuilder } from "../lib/headers";
import { NotficationsSchema, Notifications } from "../schemas/notifications";

// Define a service using a base URL and expected endpoints
export const sasbinf = createApi({
  reducerPath: "sasbinfAPI",
  baseQuery: fetchBaseQuery({ baseUrl: "/api" }),
  tagTypes: ["bookings", "member", "room", "notifications", "history"],
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

    postAvailableRoomsSearch: build.query<
      { name: string; id: number }[],
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
      providesTags: ["room"],
    }),

    postRoomBookRequest: build.mutation({
      query: (req: BookRequest) => ({
        url: "rooms/book",
        method: "POST",
        body: req,
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformErrorResponse: (e) => {
        alert(e.data || "Falha ao reservar a sala");
        return { message: e.data || "Falha ao reservar a sala" };
      },
      transformResponse: (e) => {
        console.log(e);
        alert("A sala foi reservada com sucesso.");
      },
      invalidatesTags: ["room"],
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
      invalidatesTags: ["room"],
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
      invalidatesTags: ["room"],
    }),

    getRoomsHistorySearch: build.query<
      BookingIdArray,
      {
        roomId: number;
        numberOfBooks: number;
        token: string;
      }
    >({
      query: ({ roomId, numberOfBooks, token }) => ({
        url: `manager/room-history/${roomId}/${numberOfBooks}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`, // TODO: Use HeaderBuilder
        },
      }),
      providesTags: ["bookings"],
      transformResponse: (response) => {
        try {
          return v.parse(BookingIdArraySchema, response);
        } catch {
          throw new Error("Falha ao obter histórico de salas");
        }
      },
    }),

    getBooking: build.query<Booking, number>({
      query: (bookingId) => ({
        url: `manager/booking/${bookingId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")}`, // TODO: Use HeaderBuilder
        },
      }),
      providesTags: ["bookings"],
      transformResponse: (response) => {
        try {
          return v.parse(BookingSchema, response);
        } catch {
          throw new Error("Falha ao obter histórico de salas");
        }
      },
    }),

    getMemberRoomsHistorySearch: build.query<
      BookingIdArray,
      {
        memberId: number;
        numberOfBooks: number;
        token: string;
      }
    >({
      query: ({ memberId, numberOfBooks, token }) => ({
        url: `manager/member-history/${memberId}/${numberOfBooks}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }),
      providesTags: ["bookings"],
      transformResponse: (response) => {
        try {
          return v.parse(BookingIdArraySchema, response);
        } catch {
          throw new Error("Falha ao obter histórico de salas");
        }
      },
    }),

    postCheckinAbsence: build.mutation({
      query: ({
        bookingId,
        status,
      }: {
        bookingId: number;
        status: string;
      }) => ({
        url: `manager/bookings/change-status/${bookingId}/${status}`,
        method: "POST",
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      invalidatesTags: ["bookings"],
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
      providesTags: ["bookings"],
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
      invalidatesTags: ["member"],
    }),

    postMembers: build.mutation({
      query: ({
        memberName,
        token,
      }: {
        memberName: string | null | undefined;
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

    getMember: build.query<Member, number>({
      query: (memberId) => ({
        url: `manager/member/${memberId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")!}`, // TODO: Use HeaderBuilder
        },
      }),
      providesTags: ["member"],
      transformErrorResponse: () => ({ message: "Invalid credentials" }),
      transformResponse: (response) => {
        try {
          return v.parse(MembersSchema, response);
        } catch {
          throw new Error("Invalid credentials");
        }
      },
    }),

    getRoom: build.query<Room, number>({
      query: (roomId) => ({
        url: `manager/room/${roomId}`,
        method: "GET",
        headers: {
          Authorization: `Bearer ${sessionStorage.getItem("authToken")!}`, // TODO: Use HeaderBuilder
        },
      }),
      providesTags: ["room"],
      transformErrorResponse: () => ({ message: "Invalid credentials" }),
      transformResponse: (response) => {
        try {
          return v.parse(RoomSchema, response);
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
        roomName: string | null | undefined;
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
      query: ({ bookingId }: { bookingId: number }) => ({
        url: `rooms/cancel-booking`,
        method: "POST",
        headers: new HeaderBuilder().withAuthToken().build(),
        body: { bookingId },
      }),
      transformResponse: () => ({ success: true }),
      transformErrorResponse: () => ({ success: false }),
    }),

    postTransferBooking: build.mutation({
      query: ({
        bookingId,
        newUser,
      }: {
        bookingId: number;
        newUser: string;
      }) => ({
        url: "rooms/transfer-booking",
        method: "POST",
        headers: new HeaderBuilder().withAuthToken().build(),
        body: { bookingId, newUser },
      }),
      transformResponse: (d) => ({ data: d }),
      transformErrorResponse: (e) => ({ error: e }),
      invalidatesTags: ["bookings"],
    }),

    postCancelTransfer: build.mutation({
      query: ({ bookingId }: { bookingId: number }) => ({
        url: `cancel-transfer/${bookingId}`,
        method: "POST",
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformResponse: (d) => ({ data: d }),
      transformErrorResponse: (e) => ({ error: e }),
      invalidatesTags: ["bookings"],
    }),

    getNotifications: build.query<Notifications, void>({
      query: () => ({
        url: "notifications",
        method: "GET",
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformResponse: (e) => {
        try {
          return v.parse(NotficationsSchema, e);
        } catch (e) {
          console.log(e);
          throw new Error(
            "Algo falhou ao buscar suas notificações. Tente novamente mais tarde"
          );
        }
      },
      providesTags: ["notifications"],
    }),

    deleteNotification: build.mutation<{ message: string }, number>({
      query: (id: number) => ({
        url: `delete-notification/${id}`,
        method: "DELETE",
        headers: new HeaderBuilder().withAuthToken().build(),
      }),
      transformResponse: (e) => {
        return { message: "Notification deleted." + e };
      },
      invalidatesTags: ["notifications"],
    }),

    updateTransferStatus: build.mutation({
      query: ({
        notificationId,
        status,
      }: {
        notificationId: number;
        status: "ACCEPTED" | "REJECTED";
      }) => ({
        url: `update-transfer/${notificationId}`,
        method: "POST",
        headers: new HeaderBuilder().withAuthToken().build(),
        body: { status },
      }),
      invalidatesTags: ["notifications"],
    }),

    getHistory: build.query<MyBooking[], void>({
      query: () => ({
        url: "rooms/history",
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
      providesTags: ["history"],
    }),
  }),
});

// Export hooks for usage in functional components, which are
// auto-generated based on the defined endpoints
export const {
  useGetHealthQuery,
  usePostAvailableRoomsSearchQuery,
  useLazyPostAvailableRoomsSearchQuery,
  usePostLoginMutation,
  usePostRoomBookRequestMutation,
  usePostLoginManagerMutation,
  usePostCreateRoomMutation,
  useDeleteRoomMutation,
  usePostRoomActivationMutation,
  useGetMemberRoomsHistorySearchQuery,
  useGetRoomsHistorySearchQuery,
  usePostCheckinAbsenceMutation,
  useGetMyBookingsQuery,
  usePostBanMemberMutation,
  usePostMembersMutation,
  useGetMemberQuery,
  usePostRoomsMutation,
  usePostCancelBookingMutation,
  useGetBookingQuery,
  useLazyGetRoomsHistorySearchQuery,
  useGetRoomQuery,
  usePostTransferBookingMutation,
  useGetNotificationsQuery,
  useDeleteNotificationMutation,
  useUpdateTransferStatusMutation,
  useGetHistoryQuery,
  usePostCancelTransferMutation,
} = sasbinf;
