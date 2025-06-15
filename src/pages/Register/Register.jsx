import React, { useState } from "react";
import axios from "axios";
import { API_URL } from "../../constants/Constants";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState("");
  const [successMessage, setSuccessMessage] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setErrorMessage("");
    setSuccessMessage("");

    if (password !== confirmPassword) {
      setErrorMessage("Passwords do not match.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await axios.post(`${API_URL}/signup`, {
        user: {
          username, 
          email,
          password,
          password_confirmation: confirmPassword
        }
      });

      if (response.status === 201) {
        setSuccessMessage("Account created successfully. Redirecting to login...");
        setTimeout(() => navigate("/login"), 3000);
      }
    } catch (error) {
      console.error("Registration error:", error);
      setErrorMessage(
        error.response?.data?.message || "Failed to create account. Please try again."
      );
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="register-container">
      <div className="register-box">
        <i className="fa-brands fa-slack"></i>
        <h2>Create Account</h2>
        <form onSubmit={handleSubmit}>
          <input
            type="text"
            placeholder="Username"
            className="input-field"
            value={username}
            onChange={(e) => setUsername(e.target.value)}
            required
          />
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
          <input
            type="password"
            placeholder="Confirm Password"
            className="input-field"
            value={confirmPassword}
            onChange={(e) => setConfirmPassword(e.target.value)}
            required
          />
          <button type="submit" className="register-button" disabled={isLoading}>
            {isLoading ? "Creating account..." : "SIGN UP"}
          </button>
        </form>
        {errorMessage && <p style={{ color: "red", marginTop: "10px" }}>{errorMessage}</p>}
        {successMessage && <p style={{ color: "green", marginTop: "10px" }}>{successMessage}</p>}
        <p>
          Already have an account? <a href="/login">Sign In</a>
        </p>
      </div>
    </div>
  );
}

export default Register;
