import { CSSProperties, useState } from "react";
import { BookingStatus, MyBooking } from "../schemas/myBookings";

const bookingCardStyle: CSSProperties = {
	background: "#f9fafb",
	borderRadius: "8px",
	padding: "16px",
	boxShadow: "0 1px 3px rgba(0,0,0,0.1), 0 1px 2px rgba(0,0,0,0.06)",
	marginBottom: "1rem",
	cursor: "pointer",
	transition: "box-shadow 0.2s ease-in-out",
};

const bookingCardHoverStyle: CSSProperties = {
	boxShadow: "0 4px 6px rgba(0,0,0,0.1), 0 2px 4px rgba(0,0,0,0.06)",
};

const bookingDetailsStyle: CSSProperties = {
	margin: 0,
	padding: "4px 0",
	color: "#374151",
};

export function Booking({ booking }: { booking: MyBooking }) {
	const [isHovered, setIsHovered] = useState(false);

	return (
		<li
			style={
				isHovered
					? { ...bookingCardStyle, ...bookingCardHoverStyle }
					: bookingCardStyle
			}
			onMouseEnter={() => setIsHovered(true)}
			onMouseLeave={() => setIsHovered(false)}
		>
			<p style={bookingDetailsStyle}>
				<strong>Início:</strong> {new Date(booking.startTime).toLocaleString()}
			</p>
			<p style={bookingDetailsStyle}>
				<strong>Fim:</strong> {new Date(booking.endTime).toLocaleString()}
			</p>
			<p style={bookingDetailsStyle}>
				<strong>Status:</strong> {TranslateStatus(booking.status)}
			</p>
		</li>
	);
}

function TranslateStatus(status: BookingStatus): string {
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
			throw new Error("Sanity error: room status is not in enum");
	}
}
