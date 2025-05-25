import React from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";

function ManageMainrPage() {
  return (
    <Restricted>
      <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
        <ManageMainrPageRestricted></ManageMainrPageRestricted>
      </div>
    </Restricted>
  );
}

export default ManageMainrPage;

function ManageMainrPageRestricted() {
  return (
    <div>
      <img
        src={logoImg}
        alt="SasbINF"
        style={{ width: "16em", height: "auto", marginBottom: "20px" }}
      />
      <h2>Foobar</h2>
    </div>
  );
}
