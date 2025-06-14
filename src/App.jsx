import React, { useState, useEffect } from "react";
import { BrowserRouter, Route, Routes, Navigate } from "react-router-dom";
import { DataProvider } from "./context/DataProvider";
import "./App.css";

import Register from "./pages/Register/Register";
import Login from "./pages/Login/Login";
import Welcome from "./pages/Welcome/Welcome";
import TeamPage from "./pages/TeamPage/TeamPage";

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);

  // Check localStorage for token on mount
  useEffect(() => {
    const token = localStorage.getItem("jwt");
    setIsAuthenticated(!!token); // true if token exists
  }, []);

  // Called after successful login
  const handleLogin = () => {
    setIsAuthenticated(true);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    window.location.href = '/login';
  };

  return (
    <DataProvider>
      <BrowserRouter>
        <Routes>
          <Route
            path="/login"
            element={
              isAuthenticated ? <Navigate to="/welcome" /> : <Login onLogin={handleLogin} />
            }
          />
          <Route
            path="/register"
            element={
              isAuthenticated ? <Navigate to="/welcome" /> : <Register />
            }
          />
         <Route 
            path="/welcome" 
            element={<Welcome onLogout={handleLogout} />} 
          />

         <Route 
            path="/teams/:id" 
            element={<TeamPage onLogout={handleLogout} />} 
          />

          <Route path="*" element={<Navigate to="/login" />} />
        </Routes>
      </BrowserRouter>
    </DataProvider>
  );
}

export default App;
