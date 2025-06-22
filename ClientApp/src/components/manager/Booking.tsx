import { useState } from "react";
import {
  useGetBookingQuery,
  usePostCheckinAbsenceMutation,
} from "../../api/sasbinfAPI";
import { BookingStatus } from "../../lib/BookingStatus";

export function Booking({
  bookingId,
  showRoomName = false,
  showMemberName = false,
}: {
  bookingId: number;
  showRoomName?: boolean;
  showMemberName?: boolean;
}) {
  const getBooking = useGetBookingQuery(bookingId);
  const [checkinOrAbsence] = usePostCheckinAbsenceMutation();

  const [showBooking, setShowBooking] = useState(false);

  const handleCheckin = async () => {
    checkinOrAbsence({
      bookingId: bookingId,
      status: "CLAIMED", // TODO: Use constants
    });
  };

  const handleAbsence = async () => {
    checkinOrAbsence({
      bookingId: bookingId,
      status: "MISSED", // TODO: Use constants
    });
  };

  if (getBooking.isError || getBooking.isLoading) {
    return <></>;
  }

  return (
    <li key={bookingId} onClick={() => setShowBooking((prev) => !prev)}>
      {showMemberName && (
        <p>
          <strong>Membro: </strong>
          {getBooking.data!.userName}
        </p>
      )}
      {showRoomName && (
        <p>
          <strong>Sala: </strong>
          {getBooking.data!.roomName}
        </p>
      )}
      <p>
        <strong>Início:</strong>{" "}
        {new Date(getBooking.data!.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Fim:</strong>{" "}
        {new Date(getBooking.data!.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {translateStatus(getBooking.data!.status)}
      </p>
      {showBooking && (
        <div className="booking-actions">
          <button className="checkin" onClick={handleCheckin}>
            Check-in
          </button>
          <button className="absence" onClick={handleAbsence}>
            Ausência
          </button>
        </div>
      )}
    </li>
  );
}

// TODO: Unify with the other translateStatus function
function translateStatus(status: string): string {
  switch (status) {
    case BookingStatus.Booked:
      return "Alugada";

    case BookingStatus.Cancelled:
      return "Cancelada por administrador";

    case BookingStatus.Claimed:
      return "Reivindicada";

    case BookingStatus.Missed:
      return "Abandonada";

    case BookingStatus.Transferring:
      return "Em Transferência";

    case BookingStatus.Withdrawn:
      return "Cancelada";

    default:
      return status;
  }
}
