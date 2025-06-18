import React from "react";
import MemberWrapper from "../components/MemberWrapper";

const notifications = [
  {
    description:
      "Sua reserva sala AmogusKindaSussy foi cancelada trouxa kkkkkkk",
    type: "SIMPLE",
    status: "UNREAD",
  },
  {
    description:
      "O usuário DonaldJTrump deseja lhe transferir a sala OvalRoom. Você deseja aceitar?",
    type: "TRANSFER_CONFIRMATION",
    status: "TO_BE_ACCEPTED",
  },
  {
    description:
      "Sua reserva sala AmogusKindaSussy foi cancelada trouxa kkkkkkk",
    type: "SIMPLE",
    status: "UNREAD",
  },
  {
    description:
      "O usuário DonaldJTrump deseja lhe transferir a sala OvalRoom. Você deseja aceitar?",
    type: "TRANSFER_CONFIRMATION",
    status: "TO_BE_ACCEPTED",
  },
  {
    description:
      "Sua reserva sala AmogusKindaSussy foi cancelada trouxa kkkkkkk",
    type: "SIMPLE",
    status: "UNREAD",
  },
  {
    description:
      "O usuário DonaldJTrump deseja lhe transferir a sala OvalRoom. Você deseja aceitar?",
    type: "TRANSFER_CONFIRMATION",
    status: "TO_BE_ACCEPTED",
  },
  {
    description:
      "Sua reserva sala AmogusKindaSussy foi cancelada trouxa kkkkkkk",
    type: "SIMPLE",
    status: "UNREAD",
  },
  {
    description:
      "O usuário DonaldJTrump deseja lhe transferir a sala OvalRoom. Você deseja aceitar?",
    type: "TRANSFER_CONFIRMATION",
    status: "TO_BE_ACCEPTED",
  },
];

const notificationCardStyle: React.CSSProperties = {
  background: "#e5e7eb", // Lighter gray card
  borderRadius: "16px", // More rounded
  padding: "1.5rem 2rem",
  boxShadow: "0 2px 8px rgba(0,0,0,0.06)",
  gap: "2rem",
};

const buttonStyle = { marginLeft: "1rem" };

const wrapperStyle = { minWidth: "70em" };

const wrapper = (content: React.ReactNode) => (
  <MemberWrapper>
    <div className="d-flex justify-content-center pt-5" style={wrapperStyle}>
      <div
        className="member-bookings-list"
        style={{ display: "flex", flexDirection: "column", gap: "1rem" }}
      >
        {content}
      </div>
    </div>
  </MemberWrapper>
);

export default function NotificationsPage() {
  return wrapper(
    notifications.map((notification, index) => (
      <div
        className="d-flex justify-content-between align-items-center"
        style={notificationCardStyle}
      >
        <div style={{ minWidth: "5em", fontWeight: 600 }}>
          #{index + 1}
        </div>
        {notification.description}
        <div className="d-flex justify-content-evenly">
          {notification.type === "TRANSFER_CONFIRMATION" &&
            notification.status === "TO_BE_ACCEPTED" && (
              <>
                <button className="btn btn-success" style={buttonStyle}>
                  Aceitar
                </button>
                <button className="btn btn-danger" style={buttonStyle}>
                  Rejeitar
                </button>
              </>
            )}
          {notification.type === "SIMPLE" && (
            <button className="btn btn-secondary" style={buttonStyle}>
              Apagar
            </button>
          )}
        </div>
      </div>
    ))
  );
}
