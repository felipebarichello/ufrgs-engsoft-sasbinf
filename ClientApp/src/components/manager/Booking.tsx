import { useState } from "react";
import {
  useGetBookingQuery,
  usePostCheckinAbsenceMutation,
} from "../../api/sasbinfAPI";

export function Booking({ bookingId }: { bookingId: number }) {
  const getBooking = useGetBookingQuery(bookingId);
  const [checkinOrAbsence] = usePostCheckinAbsenceMutation();

  const token = sessionStorage.getItem("authToken")!;
  const [showBooking, setShowBooking] = useState(false);

  const handleCheckin = async () => {
    checkinOrAbsence({
      bookingId: bookingId,
      status: "CLAIMED", // TODO: Use constants
      token: token,
    });
  };

  const handleAbsence = async () => {
    checkinOrAbsence({
      bookingId: bookingId,
      status: "MISSED", // TODO: Use constants
      token: token,
    });
  };

  if (getBooking.isError || getBooking.isLoading) {
    return <></>;
  }

  return (
    <li key={bookingId} onClick={() => setShowBooking((prev) => !prev)}>
      <p>
        <strong>Início:</strong>{" "}
        {new Date(getBooking.data!.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Fim:</strong>{" "}
        {new Date(getBooking.data!.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {getBooking.data!.status}
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
