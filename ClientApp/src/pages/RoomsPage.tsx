import { useState } from "react";
import INFLibrary from "../components/InfLibrary";
import RoomsForm from "../components/RoomsForm";
import MemberWrapper from "../components/MemberWrapper";

function RoomsPage() {
  const [availableRooms, setAvailableRooms] = useState<number[]>([]);
  return (
    <MemberWrapper>
      <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
        <RoomsForm setAvailableRooms={setAvailableRooms} />
        <INFLibrary available={availableRooms} />
      </div>
    </MemberWrapper>
  );
}

export default RoomsPage;
