import React, { useEffect, useState } from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";
import {
  useLazyGetMemberRoomsHistorySearchQuery,
  usePostBanMemberMutation,
  usePostCheckinAbsenceMutation,
  usePostMembersMutation,
} from "../../api/sasbinfAPI";
import "./ManagerMainPage.css";
import { BookingArray } from "../../schemas/booking";

function ManagerMembersPage() {
  return (
    <Restricted>
      <div className="manager-container">
        <ManagerMembersPageRestricted />
      </div>
    </Restricted>
  );
}

export default ManagerMembersPage;

function ManagerMembersPageRestricted() {
  const [searchMembers, searchMembersState] = usePostMembersMutation();
  const [getHistory] = useLazyGetMemberRoomsHistorySearchQuery();
  const [checkin] = usePostCheckinAbsenceMutation();
  const [banMember] = usePostBanMemberMutation();
  const [memberName, setMemberName] = useState<string | null>();
  const [selectedMember, setSelectedMember] = useState<null | number>(null);
  const [historyData, setHistoryData] = useState<
    Record<number, BookingArray | null>
  >({});
  const [selectedBooking, setSelectedBooking] = useState<number | null>();
  const token = sessionStorage.getItem("authToken")!;

  const fetchMembers = () => {
    searchMembers({ memberName: null, token });
  };

  useEffect(() => {
    fetchMembers();
  }, []);

  const handleSearchMembers = (e: React.FormEvent) => {
    e.preventDefault();
    if (!memberName) return;
    searchMembers({
      memberName: memberName,
      token,
    });
  };

  const handleShowHistory = async (memberId: number) => {
    console.log("mid: " + memberId);
    if (historyData[memberId]) {
      setHistoryData((prev) => {
        const newData = { ...prev };
        delete newData[memberId];
        return newData;
      });
    } else {
      const response = await getHistory({
        memberId: memberId,
        numberOfBooks: "5",
        token,
      });
      if ("data" in response) {
        console.log("tenho dados");
        setHistoryData((prev) => ({
          ...prev,
          [memberId]: response.data,
        }));
      }
    }
  };

  const toggleHistory = (bookingId: number) => {
    setSelectedBooking((prev) => (prev === bookingId ? null : bookingId));
  };

  const toggleSelectedMember = (roomId: number) => {
    setSelectedMember((prev) => (prev === roomId ? null : roomId));
  };

  const handleCheckIn = async (bookingId: number, memberId: number) => {
    checkin({ bookingId: bookingId, status: "confirmed", token: token });
    const response = await getHistory({
      memberId: memberId,
      numberOfBooks: "5",
      token,
    });
    if ("data" in response) {
      console.log("tenho dados");
      setHistoryData((prev) => ({
        ...prev,
        [memberId]: response.data,
      }));
    }
  };

  const handleAbsence = async (bookingId: number, memberId: number) => {
    checkin({ bookingId: bookingId, status: "absent", token: token });
    banMember({ memberId: memberId, shouldBan: true, token: token });
    const response = await getHistory({
      memberId: memberId,
      numberOfBooks: "5",
      token,
    });
    if ("data" in response) {
      console.log("tenho dados");
      setHistoryData((prev) => ({
        ...prev,
        [memberId]: response.data,
      }));
    }
  };

  return (
    <div className="manager-card">
      <div className="logo-container">
        <img src={logoImg} alt="SasbINF" className="logo" />
      </div>

      <h2 className="title">Gerenciamento de Membros</h2>

      <form onSubmit={handleSearchMembers} className="form-section">
        <div className="form-fields">
          <label>Nome do Membro</label>
          <input
            type="text"
            placeholder="Digite o nome do aluno"
            value={memberName || ""}
            onChange={(e) => setMemberName(e.target.value)}
          />
        </div>

        <div className="form-buttons">
          <button type="submit">Buscar Membro</button>
        </div>
      </form>

      {searchMembersState.isSuccess && (
        <>
          <h3 className="room-list-title">Membros</h3>
          <ul className="room-list">
            {searchMembersState.data?.map((r, index) => (
              <li
                key={index}
                className={selectedMember === r.memberId ? "selected" : ""}
                onClick={() => toggleSelectedMember(r.memberId)}
              >
                <div className="room-name">{r.username}</div>
                {selectedMember === r.memberId && (
                  <div
                    className="room-options"
                    onClick={(e) => e.stopPropagation()}
                  >
                    <p>
                      Estado:{" "}
                      <strong>
                        {r.timedOutUntil
                          ? `banido até ${r.timedOutUntil}`
                          : "Regular"}
                      </strong>
                    </p>
                    <p>
                      Id: <strong>{r.memberId}</strong>
                    </p>
                    <div className="room-buttons">
                      <button onClick={() => console.log("banido")}>
                        Banir por 1 mês
                      </button>
                      <button onClick={() => console.log("desbanido")}>
                        Remover Banimento
                      </button>
                      <button onClick={() => handleShowHistory(r.memberId)}>
                        {historyData[r.memberId]
                          ? "Ocultar Histórico"
                          : "Ver Histórico"}
                      </button>
                    </div>
                    {historyData[r.memberId] && (
                      <ul className="history-list">
                        {historyData[r.memberId]!.map((h, idx) => (
                          <li
                            key={idx}
                            onClick={() => toggleHistory(h.bookingId)}
                          >
                            <p>
                              <strong>Início:</strong> {h.startDate}
                            </p>
                            <p>
                              <strong>Fim:</strong> {h.endDate}
                            </p>
                            <p>
                              <strong>Status:</strong> {h.status}
                            </p>
                            {selectedBooking === h.bookingId && (
                              <div className="booking-actions">
                                <button
                                  className="checkin"
                                  onClick={() =>
                                    handleCheckIn(h.bookingId, h.userId)
                                  }
                                >
                                  Check-in
                                </button>
                                <button
                                  className="absence"
                                  onClick={() =>
                                    handleAbsence(h.bookingId, h.userId)
                                  }
                                >
                                  Ausência
                                </button>
                              </div>
                            )}
                          </li>
                        ))}
                      </ul>
                    )}
                  </div>
                )}
              </li>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
