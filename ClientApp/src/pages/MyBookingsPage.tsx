import { useState, useEffect } from "react";
import MemberWrapper from "../components/MemberWrapper";
import MyBookingsList from "../components/MyBookingsList";
import * as v from "valibot";
import { useGetMyBookingsQuery } from "../api/sasbinfAPI";

export type LogFilters = {
  memberId: string;
  fromDate: string;
  toDate: string;
};

export type MyBooking = {
  bookingId: number;
  roomName: string;
  startTime: string;
  endTime: string;
  status: string;
};

export const MyBookingSchema = v.object({
  bookingId: v.number(),
  roomName: v.string(),
  startTime: v.string(),
  endTime: v.string(),
  status: v.string(),
});

export const MyBookingsResponseSchema = v.array(MyBookingSchema);

function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
  const getMyBookings = useGetMyBookingsQuery();

  useEffect(() => {
    if (getMyBookings.data) {
      setMyBookings(getMyBookings.data);
    }
  }, [getMyBookings.data]);

  const wrapperStyle = { minWidth: "70em" };

  const wrapper = (content: React.ReactNode) => (
    <MemberWrapper>
      <div className="d-flex justify-content-center pt-5" style={wrapperStyle}>
        {content}
      </div>
    </MemberWrapper>
  );

  if (getMyBookings.isLoading) {
    return wrapper(<span>Carregando...</span>);
  }

  if (getMyBookings.isError || !getMyBookings.data) {
    return wrapper(<span>Falha ao carregar</span>);
  }

  return wrapper(<MyBookingsList bookingsList={myBookings} />);
}

export default MyBookingsPage;
