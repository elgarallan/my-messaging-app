import React, { useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import axios from "axios";
import { API_URL } from "../../constants/Constants";
import { useData } from "../../context/DataProvider";
import "./TeamPage.css";

import TeamHeader from "../../components/TeamHeader/TeamHeader";
import ChannelList from "../../components/ChannelList/ChannelList";
import ChannelMessages from "../../components/ChannelMessages/ChannelMessages";
import MemberList from "../../components/MemberList/MemberList";
import DirectMessages from "../../components/DirectMessages/DirectMessages";

function TeamPage({ onLogout }) {
  const navigate = useNavigate();
  const currentUser = JSON.parse(localStorage.getItem("user"));
  const currentUserId = currentUser?.id;

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");
    localStorage.removeItem("team_id");

    if (onLogout) {
      onLogout();
    } else {
      navigate("/login");
    }
  };
  
  const { id } = useParams();
  const { headers } = useData();

  const [team, setTeam] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [newChannelName, setNewChannelName] = useState("");
  const [selectedChannel, setSelectedChannel] = useState(null);
  const [messages, setMessages] = useState([]);
  const [newMessage, setNewMessage] = useState("");

  const [selectedUser, setSelectedUser] = useState(null);
  const [directMessages, setDirectMessages] = useState([]);
  const [dmBody, setDmBody] = useState("");

  const fetchTeam = async () => {
    try {
      const response = await axios.get(`${API_URL}/teams/${id}`, { headers });
      const data = response.data;
      setTeam({
        id: data.id,
        name: data.name,
        members: data.members || [],
        channels: data.channels || [],
      });
      setLoading(false);
    } catch (err) {
      setError("Failed to load team data.");
      setLoading(false);
    }
  };

  const fetchMessages = async (channelId) => {
    try {
      const response = await axios.get(`${API_URL}/teams/${id}/channels/${channelId}/messages`, { headers });
      setMessages(response.data);
    } catch (err) {
      console.error("Failed to load messages:", err);
    }
  };

  const fetchDirectMessages = async (userId) => {
    try {
      const res = await axios.get(`${API_URL}/direct_messages/conversation/${userId}`, { headers });
      setDirectMessages(res.data);
    } catch (err) {
      console.error("Failed to load direct messages", err);
    }
  };

  const handleSelectChannel = (channel) => {
    setSelectedChannel(channel);
    fetchMessages(channel.id);
  };

  const handleCreateChannel = async (e) => {
    e.preventDefault();
    if (!newChannelName.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/teams/${id}/channels`,
        { channel: { name: newChannelName } },
        { headers }
      );
      setTeam((prev) => ({
        ...prev,
        channels: [...prev.channels, res.data],
      }));
      setNewChannelName("");
    } catch (err) {
      console.error("Failed to create channel:", err);
    }
  };

  const handleSendMessage = async (e) => {
    e.preventDefault();
    if (!newMessage.trim()) return;

    try {
      const response = await axios.post(
        `${API_URL}/teams/${id}/channels/${selectedChannel.id}/messages`,
        { body: newMessage },
        { headers }
      );
      setMessages((prev) => [...prev, response.data]);
      setNewMessage("");
    } catch (err) {
      console.error("Failed to send message:", err);
    }
  };

  const handleSelectUser = (member) => {
    setSelectedUser(member);
    localStorage.setItem("selected_dm_user_id", member.id);
    fetchDirectMessages(member.id);
  };

  const handleSendDm = async (e) => {
    e.preventDefault();
    if (!dmBody.trim()) return;

    try {
      const res = await axios.post(
        `${API_URL}/direct_messages`,
        {
          direct_message: {
            receiver_id: selectedUser.id,
            body: dmBody,
          },
        },
        { headers }
      );
      setDirectMessages((prev) => [...prev, res.data]);
      setDmBody("");
    } catch (err) {
      console.error("Failed to send direct message", err);
    }
  };

  const handleCloseDm = () => {
    setSelectedUser(null);
    setDirectMessages([]);
    localStorage.removeItem("selected_dm_user_id");
  };

  useEffect(() => {
    fetchTeam();
  }, [id, headers]);

  useEffect(() => {
    const savedId = localStorage.getItem("selected_dm_user_id");
    if (savedId && team?.members?.length > 0) {
      const user = team.members.find((m) => m.id === parseInt(savedId));
      if (user) {
        setSelectedUser(user);
        fetchDirectMessages(user.id);
      }
    }
  }, [team]);

  if (loading) return <p>Loading...</p>;
  if (error) return <p style={{ color: "red" }}>{error}</p>;

  return (
    <div className="team-page">
      <TeamHeader teamName={team.name} onLogout={handleLogout} />

      <div className="team-body">
        <aside className="sidebar">
          <div className="sidebar-top">
            <ChannelList
              channels={team.channels}
              selectedChannelId={selectedChannel?.id}
              onSelectChannel={handleSelectChannel}
              onCreateChannel={handleCreateChannel}
              newChannelName={newChannelName}
              setNewChannelName={setNewChannelName}
            />
          </div>
          <div className="sidebar-bottom">
            <MemberList members={team.members} onSelectUser={handleSelectUser} />
          </div>
        </aside>

        <main className="main-content">
          <div className="main-top">
            {selectedChannel && (
              <ChannelMessages
                selectedChannel={selectedChannel}
                messages={messages}
                newMessage={newMessage}
                setNewMessage={setNewMessage}
                onSendMessage={handleSendMessage}
              />
            )}
          </div>

          <div className="main-bottom">
            {selectedUser && (
              <DirectMessages
                selectedUser={selectedUser}
                directMessages={directMessages}
                setDirectMessages={setDirectMessages}
                dmBody={dmBody}
                setDmBody={setDmBody}
                onSendDm={handleSendDm}
                onClose={handleCloseDm}
                currentUserId={currentUserId}
              />
            )}
          </div>
        </main>
      </div>
    </div>
  );

}

export default TeamPage;
