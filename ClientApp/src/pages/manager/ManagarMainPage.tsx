import React, { useState } from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";
import { usePostCreateRoomMutation } from "../../api/sasbinfAPI";
import { Erroralert } from "../../components/ErrorAlert";

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
  const [createRoom, createRoomState] = usePostCreateRoomMutation();
  const [formState, setFormState] = useState<string | null>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === null || formState === "") return;

    createRoom({
      name: formState!,
      capacity: 8,
      token: sessionStorage.getItem("authToken")!,
    });
  };
  return (
    <div>
      <img
        src={logoImg}
        alt="SasbINF"
        style={{ width: "16em", height: "auto", marginBottom: "20px" }}
      />
      <h2>Foobar</h2>

      <form onSubmit={handleSubmit} method="POST">
        {/* User input */}
        <div>
          <label htmlFor="room">Usuário:</label>
          <input
            type="text"
            id="roomName"
            name="roomName"
            onChange={(e) => {
              setFormState(e.target.value);
            }}
            value={formState || ""}
          />
        </div>
        <button type="submit" disabled={formState === null || formState === ""}>
          {createRoomState.isError && (
            <Erroralert error={createRoomState.error}></Erroralert>
          )}
        </button>
      </form>
    </div>
  );
}
