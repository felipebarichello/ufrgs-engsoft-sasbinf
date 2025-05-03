import Restricted from "../components/Restricted";

import BigRoom from "../components/BigRoom";
import SimpleRoom from "../components/SimpleRoom";
import SimpleTable from "../components/TableSeats";

function RoomsPage() {
  return (
    <Restricted>
      <div>
        <h2>This is a Simple Page</h2>
        <p>It has minimal content and exists on a different route.</p>
        <a href="/">Go back to Home</a> {/* Simple link back */}
      </div>
      <SimpleRoom height="360px" width="840px" />
      <BigRoom height="840px" width="510px"/>
      <SimpleTable width="840px"/>
    </Restricted>
  );
}

export default RoomsPage;
