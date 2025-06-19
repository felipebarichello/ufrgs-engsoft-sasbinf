import React, { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import { usePostLoginMutation } from "../api/sasbinfAPI";
import logoImg from "../assets/logo-sasbinf.png";
import { Login } from "../schemas/login";
import "./LoginPage.css"; // ✅ Importa o CSS

function LoginPage() {
  const [login, loginState] = usePostLoginMutation();
  const [formState, setFormState] = useState<Login>({ user: "", password: "" });
  const navigate = useNavigate();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (anyInputIsEmpty(formState)) return;
    login(formState);
  };

  useEffect(() => {
    if (loginState.isSuccess) {
      sessionStorage.setItem("authToken", loginState.data.token);
      sessionStorage.setItem("authTokenExpiration", loginState.data.expiration);
      navigate("/rooms");
    }
  }, [loginState, navigate]);

  return (
    <div className="login-container">
      <div className="login-card">
        <img src={logoImg} alt="SasbINF" className="login-logo" />

        <form onSubmit={handleSubmit} method="POST" className="login-form">
          <div className="form-group">
            <label htmlFor="username">Usuário:</label>
            <input
              type="text"
              id="username"
              name="username"
              onChange={(e) =>
                setFormState({ ...formState, user: e.target.value })
              }
              value={formState.user}
              disabled={loginState.isLoading}
            />
          </div>

          <div className="form-group">
            <label htmlFor="password">Senha:</label>
            <input
              type="password"
              id="password"
              name="password"
              onChange={(e) =>
                setFormState({ ...formState, password: e.target.value })
              }
              value={formState.password}
              disabled={loginState.isLoading}
            />
          </div>

          <button
            type="submit"
            disabled={anyInputIsEmpty(formState) || loginState.isLoading}
            className="submit-button"
          >
            {loginState.isLoading ? "Entrando..." : "Entrar"}
          </button>

          {loginState.isError && (
            <p className="error-text">Falha no login. Tente novamente.</p>
          )}
        </form>
      </div>
    </div>
  );
}

export default LoginPage;

function anyInputIsEmpty({ user, password }: Login): boolean {
  return user === "" || password === "";
}
