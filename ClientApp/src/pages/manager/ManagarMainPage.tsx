import React, { useState } from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";
import {
  useDeleteRoomMutation,
  useLazyGetRoomsHistorySearchQuery,
  usePostCreateRoomMutation,
  usePostRoomActivationMutation,
} from "../../api/sasbinfAPI";
import { Erroralert } from "../../components/ErrorAlert";

function ManagerMainPage() {
  return (
    <Restricted>
      <div className="d-flex justify-content-around" style={{ width: "75vw" }}>
        <ManageMainrPageRestricted></ManageMainrPageRestricted>
      </div>
    </Restricted>
  );
}

export default ManagerMainPage;

function ManageMainrPageRestricted() {
  const [createRoom, createRoomState] = usePostCreateRoomMutation();
  const [roomActivation, roomActivationState] = usePostRoomActivationMutation();
  const [deleteRoom, deleteRoomState] = useDeleteRoomMutation();
  const [getHistory, getHistoryState] = useLazyGetRoomsHistorySearchQuery();
  const [formState, setFormState] = useState<string | null>();
  const [roomId, setRoomId] = useState<string | null>();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === null || formState === "") return;

    createRoom({
      name: formState!,
      capacity: 8,
      token: sessionStorage.getItem("authToken")!,
    });
  };

  const handleDelete = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formState === null || formState === "") return;

    deleteRoom({
      roomId: roomId!,
      token: sessionStorage.getItem("authToken")!,
    });
  };

  const handleHistory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId === null || roomId === "") return;

    const history = await getHistory({
      roomId: roomId!,
      numberOfBooks: "5",
      token: sessionStorage.getItem("authToken")!,
    });

    console.log("dados" + history.data);
  };

  const handleAvailable = async (e: React.FormEvent) => {
    e.preventDefault();
    if (roomId === null || roomId === "") return;

    const history = await roomActivation({
      roomId: 5,
      isActive: false,
      token: sessionStorage.getItem("authToken")!,
    });

    console.log("history" + history.data);
  };

  console.log(getHistory);

  return (
    <div style={{ margin: "10px" }}>
      <img
        src={logoImg}
        alt="SasbINF"
        style={{ width: "16em", height: "auto", marginBottom: "20px" }}
      />
      <h2>Foobar</h2>

      {/* User input */}
      <form onSubmit={handleSubmit} method="POST" style={{ margin: "10px" }}>
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
          {" "}
          criar sala
        </button>
        {createRoomState.isError && (
          <Erroralert error={createRoomState.error}></Erroralert>
        )}
      </form>

      <div />

      <form onSubmit={handleDelete} method="DELETE" style={{ margin: "10px" }}>
        <div>
          <label htmlFor="room">room:</label>
          <input
            type="string"
            id="roomName"
            name="roomName"
            onChange={(e) => {
              setRoomId(e.target.value);
            }}
            value={roomId || 0}
          />
        </div>
        <button type="submit" disabled={roomId === null || roomId === ""}>
          {" "}
          deletar sala
        </button>

        {deleteRoomState.isError && (
          <Erroralert error={deleteRoomState.error}></Erroralert>
        )}
      </form>

      <div />

      <form onSubmit={handleHistory} method="GET" style={{ margin: "10px" }}>
        <button type="submit" disabled={roomId === null || roomId === ""}>
          {" "}
          histórico da sala
        </button>
        {getHistoryState.is && (
          <Erroralert error={getHistoryState.error}></Erroralert>
        )}
      </form>

      <div />

      <form onSubmit={handleAvailable} method="POST" style={{ margin: "10px" }}>
        <button type="submit" disabled={formState === null || formState === ""}>
          {" "}
          available sala 5
        </button>
        {roomActivationState.isError && (
          <Erroralert error={roomActivationState.error}></Erroralert>
        )}
      </form>
    </div>
  );
}
