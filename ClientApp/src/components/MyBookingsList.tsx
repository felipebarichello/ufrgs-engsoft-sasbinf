import { MyBooking } from "../schemas/myBookings";

interface MyBookingsListProps {
    bookingsList: MyBooking[];
}

const bookingCardStyle: React.CSSProperties = {
    background: "#e5e7eb", // Lighter gray card
    borderRadius: "16px",   // More rounded
    padding: "1.5rem 2rem",
    boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
    display: "flex",
    flexDirection: "row",
    alignItems: "center",
    gap: "2rem",
};

export default function MyBookingsList({ bookingsList }: MyBookingsListProps) {
    function handleCancelBooking(bookingId: number) {
        alert(`Cancel booking #${bookingId}`);
    }

    return (
        <div className="member-bookings-list" style={{ display: "flex", flexDirection: "column", gap: "1rem" }}>
            {bookingsList.length === 0 ? (
                <div
                    style={{
                        background: "#f3f4f6",
                        borderRadius: "12px",
                        padding: "2rem",
                        textAlign: "center",
                        color: "#888",
                    }}
                >
                    No bookings to display.
                </div>
            ) : (
                bookingsList.map((booking) => (
                    <div key={booking.bookingId} style={bookingCardStyle}>
                        <div style={{ minWidth: "5em", fontWeight: 600 }}>#{booking.bookingId}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{booking.roomName}</div>
                            <div style={{ fontSize: "0.95em", color: "#666" }}>
                                {new Date(booking.startTime).toLocaleString()} &ndash; {new Date(booking.endTime).toLocaleString()}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: "0.4em 0.5em",
                                borderRadius: "0.2em",
                                background: "#f3f4f6",
                                fontWeight: 500,
                                color: "#444",
                                minWidth: "8em",
                                textAlign: "center",
                                border: "1px solid #ababab",
                            }}
                        >
                            {booking.status}
                        </div>
                        <button
                            style={{
                                marginLeft: "1.5rem",
                                padding: "0.5em 1em",
                                borderRadius: "0.5em",
                                border: "none",
                                background: "#ef4444",
                                color: "#fff",
                                fontWeight: 600,
                                cursor: "pointer",
                                transition: "background 0.2s",
                            }}
                            onClick={() => handleCancelBooking(booking.bookingId)}
                        >
                            Cancel Booking
                        </button>
                    </div>
                ))
            )}
        </div>
    );
}
