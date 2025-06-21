import {
	usePostCancelBookingMutation,
	usePostTransferBookingMutation,
} from "../api/sasbinfAPI";
import { BookingStatus, MyBooking } from "../schemas/myBookings";

interface MyBookingsListProps {
	bookingsList: MyBooking[];
}

const bookingCardStyle: React.CSSProperties = {
	background: "#e5e7eb", // Lighter gray card
	borderRadius: "16px", // More rounded
	padding: "1.5rem 2rem",
	boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
	display: "flex",
	flexDirection: "row",
	alignItems: "center",
	gap: "2rem",
};

export default function MyBookingsList({ bookingsList }: MyBookingsListProps) {
	const [cancelBooking] = usePostCancelBookingMutation();
	const [transferBooking] = usePostTransferBookingMutation();

	function handleTransferBooking(bookingId: number) {
		const newUser = prompt(
			"Insira o nome do usuário para o qual deseja transferir:"
		);
		if (newUser === null) {
			throw new Error("Nome do usuário não pode ser nulo!"); // TODO: treat gracefully
		}

		transferBooking({ bookingId: bookingId, newUser: newUser }).then(
			(response) => {
				console.log(response);
				if (response.data && response.error === undefined) {
					alert(
						`Reserva #${bookingId} transferida com sucesso! O usuário ${newUser} receberá uma notificação para confirmar a transferência`
					);
					return;
				} else {
					alert(`Falha ao transferir reserva #${bookingId}`);
					window.location.reload(); // TODO: Refetch bookings instead of reloading
					return;
				}
			}
		);
	}

	function handleCancelBooking(bookingId: number) {
		cancelBooking({ bookingId }).then((response) => {
			if (response.data && response.data.success === true) {
				alert(`Reserva #${bookingId} cancelada com sucesso!`);
				window.location.reload(); // TODO: Refetch bookings instead of reloading
				return;
			} else {
				alert(`Falha ao cancelar reserva #${bookingId}`);
				return;
			}
		});
	}

	return (
		<div
			className="member-bookings-list"
			style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
		>
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
					Não há salas para mostrar.
				</div>
			) : (
				bookingsList.map((booking) => (
					<div key={booking.bookingId} style={bookingCardStyle}>
						<div style={{ minWidth: "5em", fontWeight: 600 }}>
							#{booking.bookingId}
						</div>
						<div style={{ flex: 1 }}>
							<div style={{ fontWeight: 500 }}>{booking.roomName}</div>
							<div style={{ fontSize: "0.95em", color: "#666" }}>
								{new Date(booking.startTime).toLocaleString()} &ndash;{" "}
								{new Date(booking.endTime).toLocaleString()} &ndash;{" "}
								{booking.status}
							</div>
						</div>

						{booking.status === BookingStatus.Booked && (
							<button
								style={{
									padding: "0.5em 1em",
									border: "none",
									background: "#2563eb",
									color: "#fff",
									transition: "background 0.2s",
								}}
								onClick={() => handleTransferBooking(booking.bookingId)}
							>
								Transferir
							</button>
						)}

						<button
							style={{
								padding: "0.5em 1em",
								border: "none",
								background:
									booking.status === BookingStatus.Transferring
										? "#ffc107"
										: "#ef4444",
								color: booking.status === BookingStatus.Transferring ? "black" : "#fff",
								transition: "background 0.2s",
							}}
							onClick={() => handleCancelBooking(booking.bookingId)}
						>
							{booking.status === BookingStatus.Transferring
								? "Cancelar Transferência"
								: "Cancelar"}
						</button>
					</div>
				))
			)}
		</div>
	);
}
