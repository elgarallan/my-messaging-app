import React from "react";
import './TeamHeader.css';

function TeamHeader({ teamName, onLogout }) {
  return (
    <div className="team-header">
      <h2 className="team-title">{teamName}</h2>
      <button onClick={onLogout} className="logout-button">Log Out</button>
    </div>
  );
}

export default TeamHeader;
