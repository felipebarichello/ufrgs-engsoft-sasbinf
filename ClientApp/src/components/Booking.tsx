import { CSSProperties, useState } from "react";
import { MyBooking, BookingStatus } from "../schemas/myBookings";
import { usePostCheckinAbsenceMutation } from "../api/sasbinfAPI";

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

const bookingActionsStyle: CSSProperties = {
	marginTop: "12px",
	display: "flex",
	gap: "12px",
};

const buttonBaseStyle: CSSProperties = {
	border: "none",
	borderRadius: "6px",
	padding: "8px 16px",
	color: "#fff",
	fontWeight: "bold",
	cursor: "pointer",
	transition: "background-color 0.2s",
};

const checkinButtonStyle: CSSProperties = {
	...buttonBaseStyle,
	backgroundColor: "#10b981", // emerald-500
};

const absenceButtonStyle: CSSProperties = {
	...buttonBaseStyle,
	backgroundColor: "#ef4444", // red-500
};

export function Booking({ booking }: { booking: MyBooking }) {
	const [checkinOrAbsence] = usePostCheckinAbsenceMutation();
	const [showActions, setShowActions] = useState(false);
	const [isHovered, setIsHovered] = useState(false);

	const handleAction = async (status: BookingStatus) => {
		const token = sessionStorage.getItem("authToken");
		if (!token) {
			alert("Sua sessão expirou. Por favor, faça o login novamente.");
			// Optionally, redirect to login page
			return;
		}

		checkinOrAbsence({
			bookingId: booking.bookingId,
			status: status,
		});
	};

	return (
		<li
			style={
				isHovered
					? { ...bookingCardStyle, ...bookingCardHoverStyle }
					: bookingCardStyle
			}
			onClick={() => setShowActions((prev) => !prev)}
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
				<strong>Status:</strong> {booking.status}
			</p>
			{showActions && (
				<div className="booking-actions" style={bookingActionsStyle}>
					<button
						style={checkinButtonStyle}
						onClick={(e) => {
							e.stopPropagation();
							handleAction(BookingStatus.Claimed);
						}}
					>
						Check-in
					</button>
					<button
						style={absenceButtonStyle}
						onClick={(e) => {
							e.stopPropagation();
							handleAction(BookingStatus.Missed);
						}}
					>
						Ausência
					</button>
				</div>
			)}
		</li>
	);
}
