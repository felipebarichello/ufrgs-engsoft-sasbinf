import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { usePostLoginMutation } from "../api/sasbinfAPI";
import logoImg from "../assets/logo-sasbinf.png";
import { Login } from "../schemas/login";

function LoginPage() {
  // The login mutation hook now returns more info, including 'data' and 'isSuccess'
  const [login, loginState] = usePostLoginMutation();
  const [formState, setFormState] = useState<Login>({ user: "", password: "" });
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (anyInputIsEmpty(formState)) return;

    // No need to await here if using isSuccess/isError below
    // We trigger the mutation, and useEffect will react to its result
    login(formState);
  };

  // Use useEffect to react to changes in the mutation state (isSuccess, data)
  useEffect(() => {
    if (loginState.isSuccess) {
      console.log("Login successful!");
  
      sessionStorage.setItem("authToken", loginState.data.token); // Store token
      sessionStorage.setItem("authTokenExpiration", loginState.data.expiration); // Store expiration
  
      navigate("/rooms")
    }
  }, [loginState, navigate]); // Dependencies for the effect

  return (
    <div>
      <img
        src={logoImg}
        alt="SasbINF"
        style={{ width: "16em", height: "auto", marginBottom: "20px" }}
      />

      <form onSubmit={handleSubmit} method="POST">
        {/* User input */}
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
            disabled={loginState.isLoading} // Disable inputs while loading
          />
        </div>
        {/* Password input */}
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
            disabled={loginState.isLoading} // Disable inputs while loading
          />
        </div>
        {/* Submit button */}
        <button type="submit" disabled={anyInputIsEmpty(formState) || loginState.isLoading}>
          {loginState.isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Display error message if the mutation fails */}
      {loginState.isError && <p style={{ color: "red" }}>Login failed, please try again.</p>}
    </div>
  );
}

export default LoginPage;

function anyInputIsEmpty({ user, password }: Login): boolean {
  return user === "" || password === "";
}
