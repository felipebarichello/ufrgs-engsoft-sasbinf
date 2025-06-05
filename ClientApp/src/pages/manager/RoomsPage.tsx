import React, { useEffect, useState } from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";
import {
  usePostCreateRoomMutation,
  //   useDeleteRoomMutation,
  //   useLazyGetRoomsHistorySearchQuery,
  //   usePostCreateRoomMutation,
  //   usePostRoomActivationMutation,
  usePostRoomsMutation,
} from "../../api/sasbinfAPI";
import { Erroralert } from "../../components/ErrorAlert";
import "./ManagerMainPage.css";

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
  const [createRoom, createRoomState] = usePostCreateRoomMutation();
  const [searchRooms, searchRoomsState] = usePostRoomsMutation();
  //   const [roomActivation, roomActivationState] = usePostRoomActivationMutation();
  //   const [deleteRoom, deleteRoomState] = useDeleteRoomMutation();
  //   const [getHistory, getHistoryState] = useLazyGetRoomsHistorySearchQuery();
  const [formState, setFormState] = useState<string | null>();
  //   const [roomId, setRoomId] = useState<string | null>();

  const token = sessionStorage.getItem("authToken")!;

  useEffect(() => {
    searchRooms({ roomName: null, token });
  }, []);

  const handleSearchRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    searchRooms({ roomName: formState, token });
  };

  const handleCreateRoom = (e: React.FormEvent) => {
    e.preventDefault();
    if (!formState) return;
    createRoom({ name: formState, capacity: 8, token });
  };

  //   const handleDeleteRoom = (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!roomId) return;
  //     deleteRoom({ roomId, token });
  //   };

  //   const handleRoomHistory = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     if (!roomId) return;
  //     const history = await getHistory({ roomId, numberOfBooks: "5", token });
  //     console.log("Histórico:", history.data);
  //   };

  //   const handleRoomAvailable = async (e: React.FormEvent) => {
  //     e.preventDefault();
  //     const result = await roomActivation({
  //       roomId: roomId || "0",
  //       isActive: false,
  //       token,
  //     });
  //     console.log("Ativação:", result.data);
  //   };

  return (
    <div className="manager-card">
      <div className="logo-container">
        <img src={logoImg} alt="SasbINF" className="logo" />
      </div>

      <h2 className="title">Gerenciamento de Salas</h2>

      {/* Criar Sala */}
      <form onSubmit={handleCreateRoom} className="form-section">
        <label>Nome da sala</label>
        <input
          type="text"
          placeholder="Digite o nome da sala"
          value={formState || ""}
          onChange={(e) => setFormState(e.target.value)}
        />
        <button type="submit" disabled={!formState}>
          Criar Sala
        </button>
        <button onClick={handleSearchRoom}>Buscar Salas</button>
        {createRoomState.isError && (
          <Erroralert error={createRoomState.error} />
        )}
      </form>

      {searchRoomsState.isSuccess && (
        <>
          <h3 className="room-list-title">Salas</h3>
          <ul className="room-list">
            {searchRoomsState.data?.map((r, index) => (
              <li key={index}>{r.name}</li>
            ))}
          </ul>
        </>
      )}

      {/* Deletar Sala
      <form onSubmit={handleDeleteRoom} className="form-section">
        <label>ID da sala</label>
        <input
          type="text"
          placeholder="Digite o ID da sala"
          value={roomId || ""}
          onChange={(e) => setRoomId(e.target.value)}
        />
        <button type="submit" disabled={!roomId}>
          Deletar Sala
        </button>
        {deleteRoomState.isError && (
          <Erroralert error={deleteRoomState.error} />
        )}
      </form> */}

      {/* Histórico */}
      {/* <form onSubmit={handleRoomHistory} className="form-section">
        <button type="submit" disabled={!roomId}>
          Ver Histórico da Sala
        </button>
        {getHistoryState.isError && (
          <Erroralert error={getHistoryState.error} />
        )}
      </form> */}

      {/* Ativação */}
      {/* <form onSubmit={handleRoomAvailable} className="form-section">
        <button type="submit">
          Alterar Acessibilidade da Sala para Falso{" "}
        </button>
        {roomActivationState.isError && (
          <Erroralert error={roomActivationState.error} />
        )}
      </form> */}
    </div>
  );
}
