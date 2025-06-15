import React from "react";
import './ChannelMessages.css';

function ChannelMessages({ selectedChannel, messages, newMessage, setNewMessage, onSendMessage }) {
  return (
    <div className="team-section channel-messages">
      <h3 className="channel-title"># {selectedChannel.name}</h3>

      <div className="messages-container">
        {messages.length === 0 ? (
          <p className="empty-state">No messages in this channel yet.</p>
        ) : (
          <ul className="message-list">
            {messages.map((msg) => (
              <li key={msg.id} className="message-item">
                <div className="message-header">
                  <strong className="message-user">
                    {msg.user?.username || msg.user?.email || "Unknown"}
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

      <form onSubmit={onSendMessage} className="message-form">
        <input
          type="text"
          placeholder="Type your message..."
          value={newMessage}
          onChange={(e) => setNewMessage(e.target.value)}
          className="message-input"
        />
      </form>
    </div>
  );

}

export default ChannelMessages;