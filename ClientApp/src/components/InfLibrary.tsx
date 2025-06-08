import NewPointer from "./NewPointer";
import SimpleTable from "./TableSeats";
import { VerticalSpacer } from "./Spacer";
import BigRoom from "./BigRoom";
import SimpleRoom from "./SimpleRoom";
import {
  useLazyPostAvailableRoomsSearchQuery,
  usePostRoomBookRequestMutation,
} from "../api/sasbinfAPI";
import { RoomFilters } from "../pages/RoomsPage";
import { Erroralert } from "./ErrorAlert";
import RoomsDropdown from "./RoomsDropdown";

const sleep = (ms: number) => new Promise((resolve) => setTimeout(resolve, ms));

const simpleRooms = Object.freeze([
  { id: 1, name: "104G" },
  { id: 2, name: "104F" },
  { id: 3, name: "104E" },
  { id: 4, name: "104D" },
  { id: 5, name: "104C" },
  { id: 6, name: "104B" },
]); // Trust me, I know what I'm doing

export default function INFLibrary({
  available,
  filtersState,
  selected,
  setSelected,
  setAvailable,
}: {
  available: { name: string; id: number }[];
  filtersState: RoomFilters;
  selected: { id: number; name: string } | null;
  setSelected: (a: { id: number; name: string } | null) => void;
  setAvailable: (a: { id: number; name: string }[]) => void;
}) {
  const [triggerBookRequest, metadata] = usePostRoomBookRequestMutation();
  const [triggerAvailableRoomsQuery, availableRoomsState] =
    useLazyPostAvailableRoomsSearchQuery();

  async function handleBookPress() {
    if (selected === null) {
      alert("Nenhuma sala está selecionada. Clique na sala para selecioná-la.");
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

      roomId: selected.id,
    };

    console.log(bookRequest);

    triggerBookRequest(bookRequest);

    setAvailable([]);

    try {
      await sleep(500);

      const newAvailableState = await triggerAvailableRoomsQuery(
        filtersState
      ).unwrap();

      setAvailable(newAvailableState);
    } catch {
      console.log(
        availableRoomsState.error,
        availableRoomsState.isLoading,
        availableRoomsState.data
      );
    }
  }

  return (
    <div>
      <div className="d-flex flex-row justify-content-center">
        <h5 style={{ marginRight: "10px", marginLeft: "100px" }}>
          Salas Disponíveis:
        </h5>
        <RoomsDropdown
          availableRooms={available}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
      <div className="d-flex justify-content-end">
        <NewPointer
          // This 'enabled' clause poses a problem: the rooms on the map must have exact, hard-coded ids and names on the database;
          // Not a big deal if you ask me, especially since we are matching it with INF's, but it would be nice to discuss it with the team
          enabled={
            selected !== null &&
            (simpleRooms.map((r) => r.id).includes(selected.id) ||
              selected.id === 7)
          }
          room={selected ?? { id: 1, name: "104G" }}
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
            selected={selected ?? { id: -1, name: "" }}
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
  available: { id: number; name: string }[];
  selected: { id: number; name: string };
  setSelected: (a: { id: number; name: string }) => void;
}) {
  // TODO Retrieve this from the database

  return (
    <div>
      {simpleRooms.map((room) => {
        return (
          <SimpleRoom
            available={available.map((r) => r.id).includes(room.id)}
            selected={selected.id === room.id}
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
        available={available.map((r) => r.id).includes(7)}
        selected={selected.id === 7}
        props={{
          style: BigRoomStyle,
          onClick: () => {
            // TODO: Retrieve this from the database
            setSelected({ id: 7, name: "104A" });
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
