interface MemberBooking {
    bookingId: number;
    roomName: string;
    startTime: string;
    endTime: string;
    status: string;
}

interface MemberBookingsTableProps {
    bookingsList: MemberBooking[];
}

export default function MemberBookingsTable({ bookingsList: bookingsList }: MemberBookingsTableProps) {
    return (
        <table className="member-bookings-table">
            <thead>
                <tr>
                    <th>Booking ID</th>
                    <th>Room Name</th>
                    <th>Start Time</th>
                    <th>End Time</th>
                    <th>Status</th>
                </tr>
            </thead>
            <tbody>
                {bookingsList.length === 0 ? (
                    <tr>
                        <td colSpan={5} style={{ textAlign: "center" }}>
                            No bookings to display.
                        </td>
                    </tr>
                ) : (
                    bookingsList.map((log) => (
                        <tr key={log.bookingId}>
                            <td>{log.bookingId}</td>
                            <td>{log.roomName}</td>
                            <td>{new Date(log.startTime).toLocaleString()}</td>
                            <td>{new Date(log.endTime).toLocaleString()}</td>
                            <td>{log.status}</td>
                        </tr>
                    ))
                )}
            </tbody>
        </table>
    );
}
