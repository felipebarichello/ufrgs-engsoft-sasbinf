import { useState } from "react";
import { usePostLoginMutation } from "../api/sasbinfAPI";
import logoImg from "../assets/logo-sasbinf.png";
import { Login } from "../schemas/login";

function LoginPage() {
  const [login, { isLoading, isError }] = usePostLoginMutation();
  const [formState, setFormState] = useState<Login>({ user: "", password: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); // Isso previne o comportamento padrão do formulário
    if (checkInputs(formState)) return;

    await login(formState); // Agora usando os dados do estado do formulário
  };

  return (
    <div>
      <img
        src={logoImg}
        alt="SasbINF"
        style={{ width: "16em", height: "auto", marginBottom: "20px" }}
      />

      <form onSubmit={handleSubmit} method="POST">
        <div>
          <label htmlFor="username">Username:</label>
          <input
            type="text"
            id="username"
            name="username"
            onChange={(e) => {
              setFormState({ ...formState, user: e.target.value });
            }}
            value={formState.user}
          />
        </div>
        <div>
          <label htmlFor="password">Password:</label>
          <input
            type="password"
            id="password"
            name="password"
            onChange={(e) => {
              setFormState({ ...formState, password: e.target.value });
            }}
            value={formState.password}
          />
        </div>
        <button type="submit" disabled={checkInputs(formState) || isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {isError && <p>Login falhou, tente novamente</p>}
    </div>
  );
}

export default LoginPage;

function checkInputs({ user, password }: Login) {
  return user === "" || password === "";
}
