import Pointer from "../components/Pointer";
import SimpleRoom from "../components/SimpleRoom";

export default function DevContainer() {
  return <RoomWithPointer roomNumber={201} selected={false} />;
}

function RoomWithPointer({
  roomNumber,
  selected,
}: {
  roomNumber: number;
  selected: boolean;
}) {
  return (
    <div className="d-flex flex-row" style={{ width: "600px" }}>
      <Pointer
        enabled={true}
        roomNumber={roomNumber}
        props={{ style: { height: "70%" } }}
      />
      <SimpleRoom selected={selected} props={{ style: SimpleRoomStyle }} />
    </div>
  );
}

const SimpleRoomStyle = {
  width: "40%",
  borderRight: "3px solid black",
  borderBottom: "3px solid black",
};
