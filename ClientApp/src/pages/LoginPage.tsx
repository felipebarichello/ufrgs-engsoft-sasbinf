import React, { useState, useEffect } from "react"; // Import useEffect
import { useNavigate } from "react-router-dom"; // Import useNavigate
import { usePostLoginMutation } from "../api/sasbinfAPI";
import logoImg from "../assets/logo-sasbinf.png";
import { Login } from "../schemas/login";

// Define the expected shape of the successful login response from the API
interface LoginResponse {
  token: string;
  expiration: string; // Or Date, depending on how you want to handle it
  // Add other fields if your API returns them (e.g., user info)
}

function LoginPage() {
  // The login mutation hook now returns more info, including 'data' and 'isSuccess'
  const [login, { data, isLoading, isError, isSuccess }] =
    usePostLoginMutation();
  const [formState, setFormState] = useState<Login>({ user: "", password: "" });
  const navigate = useNavigate(); // Hook for programmatic navigation

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (checkInputs(formState)) return;

    // No need to await here if using isSuccess/isError below
    // We trigger the mutation, and useEffect will react to its result
    login(formState);
  };

  // Use useEffect to react to changes in the mutation state (isSuccess, data)
  useEffect(() => {
    if (isSuccess && data) {
      console.log("Login successful!", data); // Log the received data

      // --- Store the token ---
      // Type assertion to tell TypeScript we expect LoginResponse
      const responseData = data as LoginResponse;
      if (responseData.token) {
        sessionStorage.setItem("authToken", responseData.token); // Store token

        // --- Redirect on success ---
        // Redirect to the rooms page (or dashboard, or root)
        navigate("/rooms"); // Or navigate('/') or navigate('/dashboard')
      } else {
        // Handle case where success is true but token is missing (shouldn't happen with current backend)
        console.error("Login succeeded but token was not received.");
        // Optionally show an error message to the user
      }
    }

    // Optional: Handle specific error cases if needed, though isError flag below covers general failure
    // if (isError) {
    //   console.error("Login mutation failed:", error); // 'error' is also returned by the hook
    // }
  }, [isSuccess, data, navigate]); // Dependencies for the effect

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
            disabled={isLoading} // Disable inputs while loading
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
            disabled={isLoading} // Disable inputs while loading
          />
        </div>
        {/* Submit button */}
        <button type="submit" disabled={checkInputs(formState) || isLoading}>
          {isLoading ? "Logging in..." : "Log In"}
        </button>
      </form>

      {/* Display error message if the mutation fails */}
      {isError && <p style={{ color: "red" }}>Login failed, please try again.</p>}
    </div>
  );
}

export default LoginPage;

function checkInputs({ user, password }: Login): boolean {
  return user === "" || password === "";
}
