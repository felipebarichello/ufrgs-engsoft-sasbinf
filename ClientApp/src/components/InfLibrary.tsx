import { useState } from "react";
import NewPointer from "./NewPointer";
import SimpleTable from "./TableSeats";
import { VerticalSpacer } from "./Spacer";
import BigRoom from "./BigRoom";
import SimpleRoom from "./SimpleRoom";
import { usePostRoomBookRequestMutation } from "../api/sasbinfAPI";
import { RoomFilters } from "../pages/RoomsPage";
import { Erroralert } from "./ErrorAlert";

const simpleRooms = Object.freeze([
  { index: 1, name: "104G" },
  { index: 2, name: "104F" },
  { index: 3, name: "104E" },
  { index: 4, name: "104D" },
  { index: 5, name: "104C" },
  { index: 6, name: "104B" },
]); // Trust me, I know what I'm doing

export default function INFLibrary({
  available,
  filtersState,
}: {
  available: number[];
  filtersState: RoomFilters;
}) {
  const [selected, setSelected] = useState<{
    index: number;
    name: string;
  } | null>(null);

  const [triggerBookRequest, metadata] = usePostRoomBookRequestMutation();

  function handleBookPress() {
    if (selected === null) {
      alert("You must select a room in order to book it.");
      return;
    }

    const bookRequest = {
      day: filtersState.day,

      startTime: `${new Date(filtersState.day + " " + filtersState.startTime)
        .toTimeString()
        .slice(0, 8)}.000`,

      endTime: `${new Date(filtersState.day + " " + filtersState.endTime)
        .toTimeString()
        .slice(0, 8)}.000`,

      roomId: selected.index,
    };

    console.log(bookRequest);

    triggerBookRequest(bookRequest);
  }

  return (
    <div>
      <h5>Salas Disponíveis</h5>
      <div className="d-flex justify-content-end">
        <NewPointer
          enabled={selected !== null}
          roomNumber={selected ?? { index: 1, name: "104G" }}
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
      {metadata.isError && Erroralert({ error: metadata.error })}
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
  // TODO Retrieve this from the database

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
        available={available.includes(7)}
        selected={selected.index === 7}
        props={{
          style: BigRoomStyle,
          onClick: () => {
            // TODO: Retrieve this from the database
            setSelected({ index: 7, name: "104A" });
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
