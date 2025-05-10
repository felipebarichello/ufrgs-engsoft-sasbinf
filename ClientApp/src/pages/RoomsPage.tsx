// import Restricted from "../components/Restricted";
import INFLibrary from "../components/InfLibrary";
import RoomsForm from "../components/RoomsForm";
function RoomsPage() {
  return (
    // <Restricted>
    <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
      {/* <strong>This is an example</strong> */}
      <RoomsForm />
      <INFLibrary />
    </div>
    // </Restricted>
  );
}

export default RoomsPage;
