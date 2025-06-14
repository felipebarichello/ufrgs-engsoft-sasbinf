import { useState } from "react";
import {
  useLazyGetMemberRoomsHistorySearchQuery,
  useLazyGetRoomsHistorySearchQuery,
  usePostBanMemberMutation,
  usePostCheckinAbsenceMutation,
} from "../../api/sasbinfAPI";
import { BookingArray } from "../../schemas/booking";

export function Booking({
  booking,
  setHistoryData,
  idx,
  useMember,
}: {
  booking: BookingArray[number];
  setHistoryData: (
    a: (
      b: Record<number, BookingArray | null>
    ) => Record<number, BookingArray | null>
  ) => void;
  idx: number;
  useMember: boolean;
}) {
  const [getRoomHistory] = useLazyGetRoomsHistorySearchQuery();
  const [getMemberHistory] = useLazyGetMemberRoomsHistorySearchQuery();

  const [checkinOrAbsence] = usePostCheckinAbsenceMutation();
  const [banMember] = usePostBanMemberMutation();

  const token = sessionStorage.getItem("authToken")!;
  const [showBooking, setShowBooking] = useState(false);

  const historyId = useMember ? booking.userId : booking.roomId;
  console.log("hid: " + historyId);

  const getHistory = async () => {
    if (useMember) {
      return await getMemberHistory({
        memberId: historyId,
        numberOfBooks: "5",
        token,
      });
    }
    return await getRoomHistory({
      roomId: historyId,
      numberOfBooks: "5",
      token,
    });
  };

  const handleCheckin = async () => {
    checkinOrAbsence({
      bookingId: booking.bookingId,
      status: "WITHDRAWN",
      token: token,
    });
    const response = await getHistory();
    if ("data" in response) {
      console.log("tenho dados");
      setHistoryData((prev) => ({
        ...prev,
        [historyId]: response.data,
      }));
    }
  };

  const handleAbsence = async () => {
    checkinOrAbsence({
      bookingId: booking.bookingId,
      status: "MISSED",
      token: token,
    });
    banMember({ memberId: booking.userId, shouldBan: true, token: token });
    const response = await getHistory();
    if ("data" in response) {
      console.log("tenho dados");
      setHistoryData((prev) => ({
        ...prev,
        [historyId]: response.data,
      }));
    }
  };

  return (
    <li key={idx} onClick={() => setShowBooking((prev) => !prev)}>
      <p>
        <strong>Início:</strong> {new Date(booking.startDate).toLocaleString()}
      </p>
      <p>
        <strong>Fim:</strong> {new Date(booking.endDate).toLocaleString()}
      </p>
      <p>
        <strong>Status:</strong> {booking.status}
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
