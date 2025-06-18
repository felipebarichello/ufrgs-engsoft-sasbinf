import React from "react";
import { useNavigate } from "react-router-dom";
import logoImg from "../assets/logo-sasbinf.png";

// TODO: Move to a CSS file (not needed for the course tho)

const headerStyle: React.CSSProperties = {
  display: "flex",
  alignItems: "center",
  justifyContent: "space-between",
  padding: "12px 24px",
  backgroundColor: "#f5f5f5",
  borderBottom: "1px solid #e0e0e0",
};

const logoStyle: React.CSSProperties = {
  height: "40px",
};

const buttonStyle: React.CSSProperties = {
  backgroundColor: "#1976d2", // TODO: Use css vars
  color: "#fff",
};

export default function Header() {
  const navigate = useNavigate();

  const logout = () => {
    sessionStorage.removeItem("authTokenExpiration");
    navigate("/login");
  };

  return (
    <header style={headerStyle}>
      <a href="/" style={{ display: "flex", alignItems: "center" }}>
        <img src={logoImg} alt="SASBINF Logo" style={logoStyle} />
      </a>
      <nav className="header-nav">
        <a href="/rooms">
          Salas
        </a>
        <div className="header-nav-divider"></div>
        <a href="/my-bookings">
          Minhas Reservas
        </a>
      </nav>
      <button style={buttonStyle} onClick={logout}>
        Logout
      </button>
    </header>
  );
}
