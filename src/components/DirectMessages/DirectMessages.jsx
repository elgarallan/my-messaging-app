import React, { useState } from "react";
import axios from "axios";
import './DirectMessages.css';
import { API_URL } from "../../constants/Constants";
import { useData } from "../../context/DataProvider";

function DirectMessages({
  selectedUser,
  directMessages,
  setDirectMessages,
  dmBody,
  setDmBody,
  onSendDm,
  onClose,
  currentUserId,
}) {
  console.log("currentUserId prop:", currentUserId);
  const { headers } = useData();

  const [editingMessageId, setEditingMessageId] = useState(null);
  const [editedBody, setEditedBody] = useState("");

  const handleEdit = (msg) => {
    setEditingMessageId(msg.id);
    setEditedBody(msg.body);
  };

  const handleCancelEdit = () => {
    setEditingMessageId(null);
    setEditedBody("");
  };

  const handleSaveEdit = async (id) => {
  try {
    const response = await axios.put(`${API_URL}/direct_messages/${id}`, {
      direct_message: { body: editedBody }
    }, { headers });

    const updatedMsg = response.data;
    console.log("Updated message:", updatedMsg);

    setDirectMessages((prev) =>
      prev.map((m) =>
        m.id === id
          ? { ...m, ...updatedMsg }
          : m
      )
    );

    handleCancelEdit();
      } catch (error) {
        console.error("Edit failed", error);
      }
    };

  const handleDelete = async (id) => {
    if (!window.confirm("Delete this message?")) return;
    try {
      await axios.delete(`${API_URL}/direct_messages/${id}`, {
        headers,
      });
      setDirectMessages((prev) => prev.filter((m) => m.id !== id));
    } catch (error) {
      console.error("Delete failed", error);
    }
  };


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

                {editingMessageId === msg.id ? (
                  <div className="edit-section">
                    <input
                      type="text"
                      value={editedBody}
                      onChange={(e) => setEditedBody(e.target.value)}
                    />
                    <button onClick={() => handleSaveEdit(msg.id)}>💾 Save</button>
                    <button onClick={handleCancelEdit}>✖ Cancel</button>
                  </div>
                ) : (
                  <div className="message-body">
                    {msg.body}
                    {msg.sender_id === currentUserId && (
                      <div className="message-actions">
                        <button onClick={() => handleEdit(msg)}>✏️ Edit</button>
                        <button onClick={() => handleDelete(msg.id)}>🗑️ Delete</button>
                      </div>
                    )}
                  </div>
                )}
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
