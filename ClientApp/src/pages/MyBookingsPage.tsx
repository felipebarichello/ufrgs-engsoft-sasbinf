import { useState } from "react";
import MemberWrapper from "../components/MemberWrapper";
import MyBookingsList from "../components/MyBookingsList";

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

function MyBookingsPage() {
  const [logs, setLogs] = useState<MyBooking[]>([]);

  // Fetch logs for the current member (simulate fetching booked rooms)
  // Replace this with actual API call as needed
  // For demonstration, we'll use a mock memberId and mock data
  useState(() => {
    // Mock data: list of rooms booked by the member
    const mockLogs: MyBooking[] = [
      {
        bookingId: 1,
        roomName: "Room A",
        startTime: "2024-06-01T10:00:00",
        endTime: "2024-06-01T12:00:00",
        status: "Confirmed",
      },
      {
        bookingId: 2,
        roomName: "Room B",
        startTime: "2024-06-03T14:00:00",
        endTime: "2024-06-03T16:00:00",
        status: "Pending",
      },
    ];

    setLogs(mockLogs);
  });

  return (
    <MemberWrapper>
      <div className="d-flex justify-content-around pt-5" style={{ width: "75vw" }}>
        <MyBookingsList bookingsList={logs} />
      </div>
    </MemberWrapper>
  );
}

export default MyBookingsPage;
