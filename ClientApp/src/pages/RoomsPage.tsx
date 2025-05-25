import Restricted from "../components/Restricted";
import { useState } from "react";
import INFLibrary from "../components/InfLibrary";
import RoomsForm from "../components/RoomsForm";

function RoomsPage() {
  const [availableRooms, setAvailableRooms] = useState<number[]>([]);

  return (
    <Restricted>
      <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
        <RoomsForm setAvailableRooms={setAvailableRooms} />
        <INFLibrary available={availableRooms} />
      </div>
    </Restricted>
  );
}

export default RoomsPage;
