import { useNavigate } from "react-router-dom";
import Restricted from "../../components/MemberRestricted";
import logoImg from "../../assets/logo-sasbinf.png";
import "./ManagerMainPage.css";

function ManagerMainPage() {
  return (
    <Restricted>
      <div className="manager-container">
        <ManagerRestrictedPage />
      </div>
    </Restricted>
  );
}

export default ManagerMainPage;

function ManagerRestrictedPage() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("authTokenExpiration");
    navigate("/manager/login");
  };

  return (
    <div className="manager-card">
      <div className="logo-container">
        <img src={logoImg} alt="SasbINF" className="logo" />
      </div>
      <h2 className="title">Gerenciamento de Salas</h2>
      <div className="form-buttons">
        <button onClick={() => navigate("/manager/members-page")}>
          Gerenciar Membros
        </button>
        <button onClick={() => navigate("/manager/rooms-page")}>
          Gerenciar Salas
        </button>
        <button onClick={logout}>Sair</button>
      </div>
    </div>
  );
}
