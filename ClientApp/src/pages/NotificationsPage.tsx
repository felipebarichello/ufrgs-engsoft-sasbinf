import React from "react";
import MemberWrapper from "../components/MemberWrapper";
import {
	useDeleteNotificationMutation,
	useGetNotificationsQuery,
	useUpdateTransferStatusMutation,
} from "../api/sasbinfAPI";
import { NotificationKind } from "../schemas/notifications";

const notificationCardStyle: React.CSSProperties = {
	background: "#e5e7eb", // Lighter gray card
	borderRadius: "16px", // More rounded
	padding: "1.5rem 2rem",
	boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
	gap: "2rem",
};

const buttonStyle = { marginLeft: "1rem" };

const wrapper = (content: React.ReactNode) => (
	<MemberWrapper>
		<div className="d-flex flex-column justify-content-center pt-5">
			<h1 className="page-title">Notificações</h1>
			<div>
				{content}
			</div>
		</div>
	</MemberWrapper>
);

export default function NotificationsPage() {
	const queryResult = useGetNotificationsQuery();
	const notifications = queryResult.data;

	const [deleteNotificationById] = useDeleteNotificationMutation();
	const [updateTransferStatus] = useUpdateTransferStatusMutation();

	async function acceptTransfer(notificationId: number) {
		const response = await updateTransferStatus({
			notificationId: notificationId,
			status: "ACCEPTED",
		});

		if (response.error) {
			console.log(response.error);
			alert("Falha ao aceitar transferência");
		}
	}

	async function rejectTransfer(notificationId: number) {
		const response = await updateTransferStatus({
			notificationId: notificationId,
			status: "REJECTED",
		});

		if (response.error) {
			console.log(response.error);
			alert("Falha ao recusar transferência");
		}
	}

	async function deleteNotification(notificationId: number) {
		try {
			const { data, error } = await deleteNotificationById(notificationId);

			if (error !== undefined) {
				throw error;
			}

			console.log(data);
		} catch {
			alert(`Falha ao remover notificação`);
		}
	}

	// FIXME: Bad way to check for loading state, but the old code was worse
	if (notifications === undefined) {
		return wrapper(
			<p>Carregando...</p>
		);
	}

	if (notifications.length === 0) {
		return wrapper(
			<p>Você não possui notificações</p>
		);
	}

	return wrapper(
		<div
			className="member-bookings-list"
			style={{
				display: "flex",
				flexDirection: "column",
				gap: "1rem",
			}}
		>
			{notifications.map((notification, index) => (
				<div
					className="d-flex justify-content-between align-items-center"
					style={notificationCardStyle}
				>
					<div style={{ minWidth: "5em", fontWeight: 600 }}>#{index + 1}</div>
					{notification.body}
					<div className="d-flex justify-content-evenly">
						{notification.kind === NotificationKind.BookingTransfer && (
							<>
								<button
									className="btn btn-success"
									style={buttonStyle}
									onClick={() => {
										acceptTransfer(notification.notificationId);
									}}
								>
									Aceitar
								</button>
								<button
									className="btn btn-danger"
									style={buttonStyle}
									onClick={() => {
										rejectTransfer(notification.notificationId);
									}}
								>
									Rejeitar
								</button>
							</>
						)}
						{notification.kind !== NotificationKind.BookingTransfer && (
							<button
								className="btn btn-primary"
								style={buttonStyle}
								onClick={() => {
									deleteNotification(notification.notificationId);
								}}
							>
								Apagar
							</button>
						)}
					</div>
				</div>
			))}
		</div>
	);
}
