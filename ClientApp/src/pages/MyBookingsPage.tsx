import { useState, useEffect } from "react";
import MemberWrapper from "../components/MemberWrapper";
import MyBookingsList from "../components/MyBookingsList";
import { useGetMyBookingsQuery } from "../api/sasbinfAPI";
import { MyBooking } from "../schemas/myBookings";

function MyBookingsPage() {
  const [myBookings, setMyBookings] = useState<MyBooking[]>([]);
  const getMyBookings = useGetMyBookingsQuery();

  useEffect(() => {
    if (getMyBookings.data) {
      setMyBookings(getMyBookings.data);
    }
  }, [getMyBookings.data]);

  const wrapper = (content: React.ReactNode) => (
    <MemberWrapper>
      <div className="d-flex flex-column justify-content-center pt-5">
        <h1 className="page-title">Suas reservas</h1>
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
