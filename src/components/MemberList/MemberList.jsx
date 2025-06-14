import React from "react";
import './MemberList.css';

function MemberList({ members, onSelectUser }) {
  return (
  <div className="team-section member-list">
    <h3>Members</h3>
    <ul>
      {members.map((member) => (
        <li key={member.id} className="member-item">
          <div className="member-info">
            <div className="avatar">
              {member.username?.charAt(0).toUpperCase() || member.email?.charAt(0).toUpperCase()}
            </div>
            <span className="member-name">
              {member.username || member.email}
            </span>
          </div>
          <button className="dm-button" onClick={() => onSelectUser(member)}>
            💬
          </button>
        </li>
      ))}
    </ul>
  </div>
);

}

export default MemberList;