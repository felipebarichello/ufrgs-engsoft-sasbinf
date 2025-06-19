import { useState } from "react";
import {
  useGetMemberQuery,
  useGetMemberRoomsHistorySearchQuery,
  usePostBanMemberMutation,
} from "../../api/sasbinfAPI";
import { Booking } from "./Booking";

export function Member({ memberId }: { memberId: number }) {
  const getMember = useGetMemberQuery(memberId);
  const getHistory = useGetMemberRoomsHistorySearchQuery({
    memberId: memberId,
    numberOfBooks: 5,
    token: sessionStorage.getItem("authToken")!,
  });
  const [banMember] = usePostBanMemberMutation();
  const [showHistory, setShowHistory] = useState(false);
  const [selected, setSelected] = useState(false);
  const token = sessionStorage.getItem("authToken")!;

  const handleBan = async (ban: boolean) => {
    banMember({ memberId: memberId, shouldBan: ban, token: token });
  };

  console.log("memberId: " + memberId);

  if (getMember.isLoading) {
    return <>Carregando Membro</>;
  }

  if (getMember.isError) {
    return <>Erro ao carregar o membro</>;
  }

  if (getMember.data === undefined) {
    return <></>;
  }

  return (
    <li
      key={memberId}
      className={selected ? "selected" : ""}
      onClick={() => setSelected((selected) => !selected)}
    >
      <div className="room-name">{getMember.data.username}</div>
      {selected && (
        <div className="room-options" onClick={(e) => e.stopPropagation()}>
          <p>
            Estado:{" "}
            <strong>
              {getMember.data!.timedOutUntil
                ? `banido até ${getMember.data!.timedOutUntil}`
                : "Regular"}
            </strong>
          </p>
          <p>
            Id: <strong>{memberId}</strong>
          </p>
          <div className="room-buttons">
            <button onClick={() => handleBan(true)}>Banir por 1 mês</button>
            <button onClick={() => handleBan(false)}>Remover Banimento</button>
            <button onClick={() => setShowHistory((prev) => !prev)}>
              {showHistory ? "Ocultar Histórico" : "Ver Histórico"}
            </button>
          </div>
          {showHistory && (
            <ul className="history-list">
              {getHistory.data!.map((b) => (
                <Booking key={b.bookingId} bookingId={b.bookingId} />
              ))}
            </ul>
          )}
        </div>
      )}
    </li>
  );
}
