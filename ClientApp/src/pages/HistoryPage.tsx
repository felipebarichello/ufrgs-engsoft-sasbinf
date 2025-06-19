import MemberWrapper from "../components/MemberWrapper";

const wrapperStyle = { minWidth: "70em" };

const wrapper = (content: React.ReactNode) => (
	<MemberWrapper>
		<div className="d-flex justify-content-center pt-5" style={wrapperStyle}>
			{content}
		</div>
	</MemberWrapper>
);

export default function BookingHistoryPage() {
    return wrapper(<>Hello There!</>)
}
