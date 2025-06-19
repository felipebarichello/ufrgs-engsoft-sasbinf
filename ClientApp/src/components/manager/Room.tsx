import { useState } from "react";
import {
  useDeleteRoomMutation,
  useGetRoomQuery,
  useGetRoomsHistorySearchQuery,
  usePostRoomActivationMutation,
} from "../../api/sasbinfAPI";
import { Booking } from "./Booking";

export function Room({ roomId }: { roomId: number }) {
  const getMember = useGetRoomQuery(roomId);
  const getHistory = useGetRoomsHistorySearchQuery({
    roomId: roomId,
    numberOfBooks: 5,
    token: sessionStorage.getItem("authToken")!,
  });
  const [roomActivation] = usePostRoomActivationMutation();
  const [deleteRoom] = useDeleteRoomMutation();
  const [showHistory, setShowHistory] = useState(false);
  const [selected, setSelected] = useState(false);
  const token = sessionStorage.getItem("authToken")!;

  const handleToggleRoomActivation = async (isActive: boolean) => {
    await roomActivation({ roomId, isActive: !isActive, token });
  };

  console.log("memberId: " + roomId);

  if (getMember.isLoading) {
    return <>Carregando sala</>;
  }

  if (getMember.isError) {
    return <>Erro ao carregar sala</>;
  }

  if (getMember.data === undefined) {
    return <></>;
  }

  return (
    <li
      key={roomId}
      className={selected ? "selected" : ""}
      onClick={() => setSelected((prev) => !prev)}
    >
      <div className="room-name">{getMember.data.name}</div>
      {selected && (
        <div className="room-options" onClick={(e) => e.stopPropagation()}>
          <p>
            Estado:{" "}
            <strong>
              {getMember.data.isActive ? "Disponível" : "Indisponível"}
            </strong>
          </p>
          <p>
            Capacidade: <strong>{getMember.data.capacity}</strong>
          </p>
          <div className="room-buttons">
            <button
              onClick={() =>
                handleToggleRoomActivation(getMember.data.isActive)
              }
            >
              Mudar Disponibilidade
            </button>
            <button
              onClick={() => deleteRoom({ roomId: roomId, token: token })}
            >
              Deletar
            </button>
            <button onClick={() => setShowHistory((prev) => !prev)}>
              {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
            </button>
          </div>
          {showHistory && (
            <ul className="history-list">
              {getHistory.data!.map((b) => (
                <Booking bookingId={b.bookingId} key={b.bookingId} />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
