interface MemberBooking {
    bookingId: number;
    roomName: string;
    startTime: string;
    endTime: string;
    status: string;
}

interface MemberBookingsListProps {
    bookingsList: MemberBooking[];
}

export default function MemberBookingsList({ bookingsList }: MemberBookingsListProps) {
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
                    <div
                        key={booking.bookingId}
                        style={{
                            display: "flex",
                            flexDirection: "row",
                            alignItems: "center",
                            background: "#f3f4f6",
                            borderRadius: "12px",
                            padding: "1.25rem 2rem",
                            boxShadow: "0 1px 4px rgba(0,0,0,0.04)",
                            gap: "2rem",
                        }}
                    >
                        <div style={{ minWidth: "90px", fontWeight: 600 }}>#{booking.bookingId}</div>
                        <div style={{ flex: 1 }}>
                            <div style={{ fontWeight: 500 }}>{booking.roomName}</div>
                            <div style={{ fontSize: "0.95em", color: "#666" }}>
                                {new Date(booking.startTime).toLocaleString()} &ndash; {new Date(booking.endTime).toLocaleString()}
                            </div>
                        </div>
                        <div
                            style={{
                                padding: "0.4em 1em",
                                borderRadius: "8px",
                                background: "#e5e7eb",
                                fontWeight: 500,
                                color: "#444",
                                minWidth: "80px",
                                textAlign: "center",
                            }}
                        >
                            {booking.status}
                        </div>
                    </div>
                ))
            )}
        </div>
    );
}
