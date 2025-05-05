import { useState } from "react";
import BigRoom from "../components/BigRoom";
import Restricted from "../components/Restricted";
import SimpleRoom from "../components/SimpleRoom";
import { VerticalSpacer } from "../components/Spacer";
import SimpleTable from "../components/TableSeats";
import Pointer from "../components/Pointer";

function RoomsPage() {
  return (
    <Restricted>
      <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
        <strong>This is an example</strong>
        <INFLibrary />
      </div>
    </Restricted>
  );
}

export default RoomsPage;

function INFLibrary() {
  const [selected, setSelected] = useState<number | null>(null);
  return (
    <div>
      <h5>Salas Disponíveis</h5>
      <div className="d-flex justify-content-end">
        <Pointer
          enabled={selected !== null}
          roomNumber={selected ?? 0}
          props={{}}
        />
        <div
          className="d-flex flex-row"
          style={{
            width: "820px",
            border: "3px solid black",
            backgroundColor: "#D9D9D9",
          }}
        >
          <RoomSelector selected={selected} setSelected={setSelected} />
          <StandaloneTables />
        </div>
      </div>
      <button
        type="button"
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={() => {
          setSelected(null);
        }}
      >
        Clear Selection
      </button>
    </div>
  );
}

const SimpleRoomStyle = {
  width: "40%",
  borderRight: "3px solid black",
  borderBottom: "3px solid black",
};
const BigRoomStyle = { width: "40%", borderRight: "3px solid black" };

function RoomSelector({
  selected,
  setSelected,
}: {
  selected: number | null;
  setSelected: (a: number) => void;
}) {
  const simpleRooms = Object.freeze([0, 1, 2, 3, 4, 5]); // Trust me, I know what I'm doing
  return (
    <div>
      {simpleRooms.map((index) => {
        return (
          <SimpleRoom
            selected={index === selected}
            props={{
              style: SimpleRoomStyle,
              onClick: () => {
                setSelected(index);
              },
            }}
          />
        );
      })}
      <BigRoom
        selected={selected === 6}
        props={{
          style: BigRoomStyle,
          onClick: () => {
            setSelected(6);
          },
        }}
      />
    </div>
  );
}

const SimpleTableStyle = { width: "40%", paddingBottom: "15px" };
function StandaloneTables() {
  return (
    <div className="d-flex flex-column">
      <VerticalSpacer size={`${((1280 + 100) * 0.25 * 0.4 * 36) / 84}px`} />
      <SimpleTable style={SimpleTableStyle} />
      <SimpleTable style={SimpleTableStyle} />
      <SimpleTable style={SimpleTableStyle} />
      <SimpleTable style={SimpleTableStyle} />
      <SimpleTable style={SimpleTableStyle} />
    </div>
  );
}
