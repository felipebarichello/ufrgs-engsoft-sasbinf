import React from "react";
import MemberWrapper from "../components/MemberWrapper";
import { useGetHistoryQuery } from "../api/sasbinfAPI";
import { Booking } from "../components/Booking";

const wrapper = (content: React.ReactNode) => (
	<MemberWrapper>
		<div className="d-flex flex-column justify-content-center pt-5">
			<h1 className="page-title">Histórico de Reservas</h1>
			{content}
		</div>
	</MemberWrapper>
);

export default function HistoryPage() {
	const getHistory = useGetHistoryQuery();

	if (getHistory.isLoading) {
		return wrapper(<span>Carregando histórico...</span>);
	}

	if (getHistory.isError || !getHistory.data) {
		return wrapper(<span>Falha ao carregar histórico.</span>);
	}

	return wrapper(
		<ul style={{ padding: 0, listStyle: "none" }}>
			{getHistory.data.map((b) => (
				<Booking key={b.bookingId} booking={b} />
			))}
		</ul>
	);
}
