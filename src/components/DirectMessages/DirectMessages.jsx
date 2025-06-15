import React from "react";
import './DirectMessages.css';

function DirectMessages({ selectedUser, directMessages, dmBody, setDmBody, onSendDm, onClose }) {
  return (
  <div className="team-section direct-messages">
    <div className="dm-header">
      <div className="member-info">
        <div className="avatar">
          {selectedUser.username?.charAt(0).toUpperCase() || selectedUser.email?.charAt(0).toUpperCase()}
        </div>
        <span className="member-name">
          {selectedUser.username || selectedUser.email}
        </span>
      </div>
      <button className="dm-close-button" onClick={onClose}>✖ Close</button>
    </div>


    <div className="messages-container">
      {directMessages.length === 0 ? (
        <p className="empty-state">No messages yet.</p>
      ) : (
        <ul className="message-list">
          {directMessages.map((msg) => (
            <li key={msg.id} className="message-item">
              <div className="message-header">
                <strong className="message-user">
                  {msg.sender?.username || msg.sender?.email}
                </strong>
                <span className="message-timestamp">
                  {new Date(msg.created_at).toLocaleString()}
                </span>
              </div>
              <div className="message-body">{msg.body}</div>
            </li>
          ))}
        </ul>
      )}
    </div>

    <form onSubmit={onSendDm} className="message-form">
      <input
        type="text"
        placeholder="Type your message..."
        value={dmBody}
        onChange={(e) => setDmBody(e.target.value)}
        className="message-input"
      />
    </form>
  </div>
);

}

export default DirectMessages;