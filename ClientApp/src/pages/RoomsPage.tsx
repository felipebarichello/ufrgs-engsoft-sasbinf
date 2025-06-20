import { useState } from "react";
import INFLibrary from "../components/InfLibrary";
import RoomsForm from "../components/RoomsForm";
import MemberWrapper from "../components/MemberWrapper";

export const Epoch = Object.freeze(new Date(0, 0, 0, 0, 0, 0));

export type RoomFilters = {
  day: string;
  startTime: string;
  endTime: string;
  capacity: number;
};

const initialState: RoomFilters = {
  day: Epoch.toLocaleDateString(),
  startTime: Epoch.toLocaleDateString(),
  endTime: Epoch.toLocaleDateString(),
  capacity: 1,
};

function RoomsPage() {
  const [availableRooms, setAvailableRooms] = useState<
    { name: string; id: number }[] | null
  >(null);
  const [filtersState, setFiltersState] = useState<RoomFilters>(initialState);
  const [selected, setSelected] = useState<{
    id: number;
    name: string;
  } | null>(null);

  return (
    <MemberWrapper>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          gap: "100px",
          justifyContent: "center", // horizontal alignment (along main axis)
          alignItems: "center", // vertical alignment (cross axis)
        }}
      >
        <RoomsForm
          available={availableRooms}
          setAvailableRooms={setAvailableRooms}
          filtersState={filtersState}
          setFiltersState={setFiltersState}
        />
        <INFLibrary
          available={availableRooms ?? []}
          setAvailable={setAvailableRooms}
          filtersState={filtersState}
          selected={selected}
          setSelected={setSelected}
        />
      </div>
    </MemberWrapper>
  );
}

export default RoomsPage;
