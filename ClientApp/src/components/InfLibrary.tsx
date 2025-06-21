import BigRoom from "./BigRoom";
import Hallway from "./Hallway";
import SimpleRoom from "./SimpleRoom";
import {
  useLazyPostAvailableRoomsSearchQuery,
  usePostRoomBookRequestMutation,
} from "../api/sasbinfAPI";
import { RoomFilters } from "../pages/RoomsPage";
import RoomsDropdown from "./RoomsDropdown";

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
  const [triggerBookRequest] = usePostRoomBookRequestMutation();
  const [triggerRoomSearch] = useLazyPostAvailableRoomsSearchQuery();

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

    await triggerBookRequest(bookRequest);

    const newAvailableRooms = await triggerRoomSearch(filtersState);
    try {
      if (newAvailableRooms.data) {
        setAvailable(newAvailableRooms.data);
      }
    } catch {
      console.log(
        newAvailableRooms.error,
        newAvailableRooms.isLoading,
        newAvailableRooms.data
      );
    }
  }

  return (
    <div
      className="card shadow-lg"
      style={{
        width: "400px",
        height: "700px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div className="text-center fw-bold">Salas Disponíveis:</div>

      <RoomsDropdown
        availableRooms={available}
        selected={selected}
        setSelected={setSelected}
      />

      <RoomsMap
        available={available}
        selected={selected ?? { id: -1, name: "" }}
        setSelected={setSelected}
      />

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          handleBookPress();
          setSelected(null);
        }}
        disabled={
          selected === null || !available.map((r) => r.id).includes(selected.id)
        }
      >
        Reservar
      </button>

      <button
        type="button"
        className="btn btn-primary"
        onClick={() => {
          setSelected(null);
        }}
        disabled={selected === null}
      >
        Limpar Seleção
      </button>

      {/*what is this luis???*/}
      {/*metadata.isError && Erroralert({ error: metadata.error })*/}
    </div>
  );
}

function RoomsMap({
  available,
  selected,
  setSelected,
}: {
  available: { id: number; name: string }[];
  selected: { id: number; name: string } | null;
  setSelected: (a: { id: number; name: string } | null) => void;
}) {
  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        border: "3px solid #ccc",
        gap: "40px",
      }}
    >
      <RoomSelector
        available={available}
        setSelected={setSelected}
        //TODO remover esse -1
        selected={selected ?? { id: -1, name: "" }}
      />
      <Hallway />
    </div>
  );
}

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
    <div style={{ display: "flex", flexDirection: "column", flexWrap: "wrap" }}>
      {simpleRooms.map((room) => (
        <SimpleRoom
          available={available.map((r) => r.id).includes(room.id)}
          selected={selected.id === room.id}
          props={{
            name: room.name,
            onClick: () => {
              setSelected(room);
            },
          }}
        />
      ))}
      <BigRoom
        available={available.map((r) => r.id).includes(7)}
        selected={selected.id === 7}
        props={{
          name: "104A",
          onClick: () => {
            setSelected({ id: 7, name: "104A" });
          },
        }}
      />
    </div>
  );
}
