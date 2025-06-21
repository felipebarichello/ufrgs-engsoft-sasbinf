import React from "react";
import MemberWrapper from "../components/MemberWrapper";
import { useGetHistoryQuery } from "../api/sasbinfAPI";
import { Booking } from "../components/Booking";

const wrapper = (content: React.ReactNode) => (
	<MemberWrapper>{content}</MemberWrapper>
);

export default function HistoryPage() {
	const getHistory = useGetHistoryQuery();
	if (getHistory.data === undefined) {
		return <>Falha ao carregar histórico</>;
	}

	return wrapper(
		<>
			{getHistory.data.map((b) => (
				<Booking key={b.bookingId} booking={b} />
			))}
		</>
	);
}
