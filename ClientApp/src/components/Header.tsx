import React from 'react';
import { useNavigate } from 'react-router-dom';
import logoImg from '../assets/logo-sasbinf.png';

// TODO: Move to a CSS file (not needed for the course tho)

const headerStyle: React.CSSProperties = {
    display: 'flex',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: '12px 24px',
    backgroundColor: '#f5f5f5',
    borderBottom: '1px solid #e0e0e0',
};

const logoStyle: React.CSSProperties = {
    height: '40px',
};

const buttonStyle: React.CSSProperties = {
    padding: '8px 16px',
    backgroundColor: '#1976d2',
    color: '#fff',
    border: 'none',
    borderRadius: '4px',
    cursor: 'pointer',
    fontSize: '16px',
};

export default function Header() {
    const navigate = useNavigate();

    const logout = () => {
        sessionStorage.removeItem("authTokenExpiration");
        navigate('/login');
    };

    return (
        <header style={headerStyle}>
            <img
                src={logoImg}
                alt="SASBINF Logo"
                style={logoStyle}
            />
            <button style={buttonStyle} onClick={() => navigate("/my-bookings")}>
                Minhas Reservas
            </button>
            <button style={buttonStyle} onClick={logout}>
                Logout
            </button>
        </header>
    );
};
