import { useState } from "react";
import NewPointer from "./NewPointer";
import SimpleTable from "./TableSeats";
import { VerticalSpacer } from "./Spacer";
import BigRoom from "./BigRoom";
import SimpleRoom from "./SimpleRoom";

export default function INFLibrary({ available }: { available: number[] }) {
  const [selected, setSelected] = useState<number | null>(null);

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
          roomNumber={selected ?? 0}
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
            selected={selected ?? -1}
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
  selected: number;
  setSelected: (a: number) => void;
}) {
  const simpleRooms = Object.freeze([0, 1, 2, 3, 4, 5]); // Trust me, I know what I'm doing
  return (
    <div>
      {simpleRooms.map((index) => {
        return (
          <SimpleRoom
            available={available.includes(index)}
            selected={selected === index}
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
        available={available.includes(6)}
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
      <SimpleTable style={SimpleTableStyle} />
      <SimpleTable style={SimpleTableStyle} />
    </div>
  );
}
