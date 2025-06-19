import React from "react";
import MemberWrapper from "../components/MemberWrapper";
import {
	useDeleteNotificationMutation,
	useGetNotificationsQuery,
} from "../api/sasbinfAPI";

const notificationCardStyle: React.CSSProperties = {
	background: "#e5e7eb", // Lighter gray card
	borderRadius: "16px", // More rounded
	padding: "1.5rem 2rem",
	boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
	gap: "2rem",
};

const buttonStyle = { marginLeft: "1rem" };

const wrapperStyle = { minWidth: "70em" };

const wrapper = (content: React.ReactNode) => (
	<MemberWrapper>
		<div className="d-flex justify-content-center pt-5" style={wrapperStyle}>
			<div
				className="member-bookings-list"
				style={{
					display: "flex",
					flexDirection: "column",
					gap: "1rem",
				}}
			>
				{content}
			</div>
		</div>
	</MemberWrapper>
);

export default function NotificationsPage() {
	const queryResult = useGetNotificationsQuery();
	const notifications = queryResult.data;

	const [deleteNotificationById] = useDeleteNotificationMutation();

	function acceptTransfer(notificationId: number) {
		alert(`Accept Transfer Not Implemented. notificationId: ${notificationId}`);
	}

	function rejectTransfer(notificationId: number) {
		alert(`Reject Transfer Not Implemented. notificationId: ${notificationId}`);
	}

	async function deleteNotification(notificationId: number) {
		try {
			await deleteNotificationById(notificationId).unwrap();
		} catch {
			alert(`Falha ao remover notificação`);
		}
	}

	if (notifications === undefined) {
		console.log("ERRO GROTESCO");
		return <>Falha ao carregar notificacoes</>;
	}

	return wrapper(
		notifications.map((notification, index) => (
			<div
				className="d-flex justify-content-between align-items-center"
				style={notificationCardStyle}
			>
				<div style={{ minWidth: "5em", fontWeight: 600 }}>#{index + 1}</div>
				{notification.description}
				<div className="d-flex justify-content-evenly">
					{notification.type === "TRANSFER_CONFIRMATION" &&
						notification.status === "TO_BE_ACCEPTED" && (
							<>
								<button
									className="btn btn-success"
									style={buttonStyle}
									onClick={() => {
										acceptTransfer(notification.id);
									}}
								>
									Aceitar
								</button>
								<button
									className="btn btn-danger"
									style={buttonStyle}
									onClick={() => {
										rejectTransfer(notification.id);
									}}
								>
									Rejeitar
								</button>
							</>
						)}
					{notification.type === "SIMPLE" && (
						<button
							className="btn btn-primary"
							style={buttonStyle}
							onClick={() => {
								deleteNotification(notification.id);
							}}
						>
							Apagar
						</button>
					)}
				</div>
			</div>
		))
	);
}
