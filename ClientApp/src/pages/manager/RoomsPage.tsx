import React, { useEffect, useState } from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";
import {
  usePostCreateRoomMutation,
  usePostRoomsMutation,
} from "../../api/sasbinfAPI";
import { Erroralert } from "../../components/ErrorAlert";
import "./ManagerActionsPages.css";
import { Room } from "../../components/manager/Room";
import { useNavigate } from "react-router-dom";

function ManagerRoomsPage() {
  return (
    <Restricted>
      <div className="manager-container">
        <ManagerRoomsPageRestricted />
      </div>
    </Restricted>
  );
}

export default ManagerRoomsPage;

function ManagerRoomsPageRestricted() {
  const navigate = useNavigate();
  const [createRoom, createRoomState] = usePostCreateRoomMutation();
  const [searchRooms, searchRoomsState] = usePostRoomsMutation();
  const [formState, setFormState] = useState<{
    roomName: string | null;
    capacity: number | 1;
  }>({ roomName: null, capacity: 1 });

  const inicialFormState = { roomName: null, capacity: 1 };
  const token = sessionStorage.getItem("authToken")!;

  const fetchRooms = () => {
    searchRooms({ roomName: null, capacity: 1, token });
  };

  useEffect(() => {
    fetchRooms();
  }, []);

  const handleSearchRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await searchRooms({
      roomName: formState.roomName,
      capacity: formState.capacity,
      token,
    });
  };

  const handleCreateRoom = async (e: React.FormEvent) => {
    e.preventDefault();
    await createRoom({
      name: formState.roomName!,
      capacity: formState.capacity,
      token,
    });
    setFormState(inicialFormState);
    fetchRooms();
  };

  const hasName = () => {
    return (
      formState.roomName !== null &&
      formState.roomName !== undefined &&
      formState.roomName !== ""
    );
  };

  return (
    <div className="manager-card">
      <div
        onClick={() => navigate("/manager/main-page")}
        className="logo-container"
      >
        <img src={logoImg} alt="SasbINF" className="logo" />
      </div>

      <h2 className="title">Gerenciamento de Salas</h2>

      <form onSubmit={handleCreateRoom} className="form-section">
        <div className="form-fields">
          <label>Nome da sala</label>
          <input
            type="text"
            placeholder="Digite o nome da sala"
            value={formState?.roomName || ""}
            onChange={(e) =>
              setFormState({ ...formState, roomName: e.target.value })
            }
          />

          <label>Capacidade da sala</label>
          <input
            type="number"
            min="1"
            placeholder="Digite a capacidade da sala"
            value={formState?.capacity || 1}
            onChange={(e) =>
              setFormState({ ...formState, capacity: Number(e.target.value) })
            }
          />
        </div>

        <div className="form-buttons">
          <button type="submit" disabled={!hasName()}>
            Criar Sala
          </button>
          <button onClick={handleSearchRoom}>Buscar Salas</button>
        </div>

        {createRoomState.isError && (
          <Erroralert error={createRoomState.error} />
        )}
      </form>

      {searchRoomsState.isSuccess && (
        <>
          <h3 className="room-list-title">Salas</h3>
          <ul className="room-list">
            {searchRoomsState.data?.map((r) => (
              <Room key={r.roomId} roomId={r.roomId} />
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
