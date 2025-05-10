// import Restricted from "../components/Restricted";
import { usePostAvailableRoomsSearchMutation } from "../api/sasbinfAPI";
import INFLibrary from "../components/InfLibrary";
import RoomsForm from "../components/RoomsForm";
function RoomsPage() {
  const [availableRooms, availableRoomsState] =
    usePostAvailableRoomsSearchMutation();
  console.log(availableRoomsState.data);
  return (
    // <Restricted>
    <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
      {/* <strong>This is an example</strong> */}
      {/* TODO ver melhor maneira de passar o parametro, sem cabeca para ver agora */}
      <RoomsForm mutation={(arg) => availableRooms(arg).unwrap()} />
      {/*TODO passar availableRoomsState para INFLibrary*/}
      <INFLibrary />
    </div>
    // </Restricted>
  );
}

export default RoomsPage;
