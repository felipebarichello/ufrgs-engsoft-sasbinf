import React from "react";
import MemberWrapper from "../components/MemberWrapper";
import { useGetHistoryQuery } from "../api/sasbinfAPI";

const wrapper = (content: React.ReactNode) => (
	<MemberWrapper>{content}</MemberWrapper>
);

export default function HistoryPage() {
	const getHistory = useGetHistoryQuery();
	if(getHistory.data === undefined){
		return <>Falha ao carregar histórico</>
	}

	return wrapper(
		<>
			{getHistory.data.map((b) => (
				<p>{b.status}</p>
			))}
		</>
	);
}
