import { useState } from "react";
import { MyBooking } from "../schemas/myBookings";
import { usePostCheckinAbsenceMutation } from "../api/sasbinfAPI";

export function Booking({ booking }: { booking: MyBooking }) {
	const [checkinOrAbsence] = usePostCheckinAbsenceMutation();

	const token = sessionStorage.getItem("authToken")!;
	const [showBooking, setShowBooking] = useState(true);

	const handleCheckin = async () => {
		checkinOrAbsence({
			bookingId: booking.bookingId,
			status: "CLAIMED", // TODO: Use constants
			token: token,
		});
	};

	const handleAbsence = async () => {
		checkinOrAbsence({
			bookingId: booking.bookingId,
			status: "MISSED", // TODO: Use constants
			token: token,
		});
	};

	return (
		<li key={booking.bookingId} onClick={() => setShowBooking((prev) => !prev)}>
			<p>
				<strong>Início:</strong>{" "}
				{new Date(booking.startTime).toLocaleString()}
			</p>
			<p>
				<strong>Fim:</strong>{" "}
				{new Date(booking.endTime).toLocaleString()}
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
