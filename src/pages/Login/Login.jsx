import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants/Constants";
import { useNavigate } from "react-router-dom";
import { useData } from "../../context/DataProvider";
import "./Login.css";

function Login({ onLogin }) {
  const { handleHeaders } = useData();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage("");

    try {
      const response = await axios.post(`${API_URL}/login`, {
        email,
        password
      });

      const { token, user } = response.data;

      if (token && user) {
        localStorage.setItem("jwt", token);
        localStorage.setItem("user", JSON.stringify(user));

        handleHeaders({ Authorization: `Bearer ${token}` });
          onLogin();
          navigate("/welcome");
        } else {
          setErrorMessage("Invalid response from server.");
        }
      } catch (error) {
        console.error("Login error:", error);
        setErrorMessage(
          error.response?.data?.message || "Invalid credentials. Please try again."
        );
      } finally {
        setIsLoading(false);
    }  
  };
  
  return (
    <div className="login-container">
      <div className="login-box">
        <i className="fa-brands fa-slack"></i>
        <h2>Sign In</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="email"
            placeholder="Email"
            className="input-field"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            required
          />
          <input
            type="password"
            placeholder="Password"
            className="input-field"
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            required
          />
          <button type="submit" className="login-button" disabled={isLoading}>
            {isLoading ? "Signing in..." : "SIGN IN"}
          </button>
        </form>
        {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
        <p>
          Don't have an account? <a href="/register">Create Account</a>
        </p>
      </div>
    </div>
  );
}

export default Login;
