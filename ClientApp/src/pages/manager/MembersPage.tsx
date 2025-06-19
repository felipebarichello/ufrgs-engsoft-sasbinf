import React, { useEffect, useState } from "react";
import logoImg from "../../assets/logo-sasbinf.png";
import Restricted from "../../components/Restricted";
import { usePostMembersMutation } from "../../api/sasbinfAPI";
import "./ManagerActionsPages.css";
import { Member } from "../../components/manager/Member";
import { useNavigate } from "react-router-dom";

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
  const navigate = useNavigate();
  const [searchMembers, searchMembersState] = usePostMembersMutation();
  const [memberName, setMemberName] = useState<string | null>();
  const token = sessionStorage.getItem("authToken")!;

  const fetchMembers = () => {
    searchMembers({ memberName: null, token });
    console.log("busque agora");
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

  if (searchMembersState.isError || searchMembersState.isLoading) {
    return <></>;
  }

  return (
    <div className="manager-card">
      <div
        onClick={() => navigate("/manager/main-page")}
        className="logo-container"
      >
        <img src={logoImg} alt="SasbINF" className="logo" />
      </div>

      <h2 className="title">Gerenciamento de Membros</h2>

      <form onSubmit={handleSearchMembers} className="form-section">
        <div className="form-fields">
          <label>Nome do Membro</label>
          <input
            type="text"
            placeholder="Digite o nome de usuário"
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
            {searchMembersState.data?.map((r) => (
              <Member memberId={r.memberId}></Member>
            ))}
          </ul>
        </>
      )}
    </div>
  );
}
