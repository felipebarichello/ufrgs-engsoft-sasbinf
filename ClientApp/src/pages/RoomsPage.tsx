import BigRoom from "../components/BigRoom";
import Restricted from "../components/Restricted";
import SimpleRoom from "../components/SimpleRoom";
// import SimpleTable from "../components/TableSeats";

function RoomsPage() {
  return (
    <Restricted>
      <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
        <strong>This is an example</strong>
        <strong>This is another example</strong>
        <RoomSelector />
      </div>
    </Restricted >
  );
}

export default RoomsPage;


function RoomSelector() {
  return (
    <div>
      <SimpleRoom style={SimpleRoomStyle} />
      <SimpleRoom style={SimpleRoomStyle} />
      <SimpleRoom style={SimpleRoomStyle} />
      <SimpleRoom style={SimpleRoomStyle} />
      <SimpleRoom style={SimpleRoomStyle} />
      <SimpleRoom style={SimpleRoomStyle} />
      <BigRoom style={BigRoomStyle} />
    </div>
  )
}

const SimpleRoomStyle = {
  width: "10vw",
  borderTop: "3px solid black",
  borderLeft: "3px solid black",
  borderRight: "3px solid black",
}

const BigRoomStyle = { width: "10vw", border: "3px solid black" }