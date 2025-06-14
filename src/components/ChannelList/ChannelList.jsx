import React from "react";
import './ChannelList.css';

function ChannelList({ channels, selectedChannelId, onSelectChannel, onCreateChannel, newChannelName, setNewChannelName }) {
  return (
  <div className="team-section channel-list">
    <h3>Channels</h3>

    {channels.length === 0 ? (
      <p className="empty-state">No channels yet.</p>
    ) : (
      <ul className="channel-items">
        {channels.map((channel) => (
          <li
            key={channel.id}
            onClick={() => onSelectChannel(channel)}
            className={`channel-item ${selectedChannelId === channel.id ? "active" : ""}`}
          >
            # {channel.name}
          </li>
        ))}
      </ul>
    )}

    <form onSubmit={onCreateChannel} className="channel-form">
      <input
        type="text"
        value={newChannelName}
        onChange={(e) => setNewChannelName(e.target.value)}
        placeholder="New channel name"
        className="channel-input"
      />
      <button type="submit" className="create-channel-btn">+</button>
    </form>
  </div>
);

}

export default ChannelList;