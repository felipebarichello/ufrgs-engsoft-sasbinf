import { useState } from "react";
import NewPointer from "./NewPointer";
import SimpleTable from "./TableSeats";
import { VerticalSpacer } from "./Spacer";
import BigRoom from "./BigRoom";
import SimpleRoom from "./SimpleRoom";

export default function INFLibrary({ available }: { available: number[] }) {
  const [selected, setSelected] = useState<{
    index: number;
    name: string;
  } | null>(null);

  function handleBookPress() {
    if (selected === null) {
      alert("You must select a room in order to book it.");
      return;
    }
    console.log("Trying to book room", selected);
  }

  return (
    <div>
      <h5>Salas Disponíveis</h5>
      <div className="d-flex justify-content-end">
        <NewPointer
          enabled={selected !== null}
          roomNumber={selected ?? { index: 0, name: "104G" }}
          props={{ style: { width: "200px" } }}
        />
        <div
          className="d-flex flex-row"
          style={{
            width: "820px",
            border: "3px solid black",
            backgroundColor: "#D9D9D9",
          }}
        >
          <RoomSelector
            available={available}
            setSelected={setSelected}
            //TODO remover esse -1
            selected={selected ?? { index: -1, name: "" }}
          />
          <StandaloneTables />
        </div>
      </div>

      <button
        type="button"
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={() => {
          handleBookPress();
          setSelected(null);
        }}
      >
        Reservar
      </button>

      <button
        type="button"
        className="btn btn-primary"
        style={{ margin: "10px" }}
        onClick={() => {
          setSelected(null);
        }}
      >
        Limpar Seleção
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
  available,
  selected,
  setSelected,
}: {
  available: number[];
  selected: { index: number; name: string };
  setSelected: (a: { index: number; name: string }) => void;
}) {
  // TODOç Retrieve this from the database
  const simpleRooms = Object.freeze([
    { index: 0, name: "104G" },
    { index: 1, name: "104F" },
    { index: 2, name: "104E" },
    { index: 3, name: "104D" },
    { index: 4, name: "104C" },
    { index: 5, name: "104B" },
  ]); // Trust me, I know what I'm doing
  return (
    <div>
      {simpleRooms.map((room) => {
        return (
          <SimpleRoom
            available={available.includes(room.index)}
            selected={selected.index === room.index}
            props={{
              style: SimpleRoomStyle,
              onClick: () => {
                setSelected(room);
              },
            }}
          />
        );
      })}
      <BigRoom
        available={available.includes(6)}
        selected={selected.index === 6}
        props={{
          style: BigRoomStyle,
          onClick: () => {
            // TODO: Retrieve this from the database
            setSelected({ index: 6, name: "104A" });
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
      <SimpleTable style={SimpleTableStyle} />
      <SimpleTable style={SimpleTableStyle} />
    </div>
  );
}
