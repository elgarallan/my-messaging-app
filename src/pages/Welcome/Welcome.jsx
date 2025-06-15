import React, { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { API_URL } from "../../constants/Constants";
import { useData } from "../../context/DataProvider";
import "./Welcome.css";

function Welcome({ onLogout }) {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("jwt");
    localStorage.removeItem("user");

    if (onLogout) {
        onLogout();
    } else {
        navigate("/login");
    }
  };
  
  const { headers } = useData();
  const [newTeamName, setNewTeamName] = useState("");
  const [error, setError] = useState("");
  const [myTeams, setMyTeams] = useState([]);
  const [availableTeams, setAvailableTeams] = useState([]);
  const [selectedMyTeamId, setSelectedMyTeamId] = useState("");
  const [selectedAvailableTeamId, setSelectedAvailableTeamId] = useState("");

	
	useEffect(() => {
		const fetchTeams = async () => {
			try {
				const response = await axios.get(`${API_URL}/teams`, { headers });
				setMyTeams(response.data);
			} catch (err) {
				console.error("Failed to fetch teams", err);
			}
		};

		fetchTeams();
	}, [headers]);

	useEffect(() => {
		const fetchAvailableTeams = async () => {
			try {
				const response = await axios.get(`${API_URL}/teams/available`, { headers });
				setAvailableTeams(response.data);
			} catch (err) {
				console.error("Failed to load available teams", err);
			}
		};

		fetchAvailableTeams();
	}, [headers]);


  const handleJoinTeam = async (e) => {
		e.preventDefault();
		setError("");
		try {
			await axios.post(
				`${API_URL}/teams/${selectedAvailableTeamId}/join`, {},
				{ headers }
			);
			navigate(`/teams/${selectedMyTeamId}`);

		} catch (err) {
			setError(err.response?.data?.message || "Unable to join team.");
		}
	};

  const handleCreateTeam = async (e) => {
    e.preventDefault();
    setError("");
    try {
      await axios.post(
        `${API_URL}/teams`,
        { name: newTeamName },
        { headers }
      );
      navigate(`/teams/${newTeamName.id}`);
    } catch (err) {
      setError(err.response?.data?.message || "Unable to create team.");
    }
  };

  return (
    <div className="welcome-container">
      <div style={{ display: "flex", justifyContent: "space-between" }}>
				<h2>Welcome!</h2>
				<button onClick={handleLogout} className="logout-button">Log Out</button>
    	</div>

			{myTeams.length > 0 ? (
				<div className="form-box">
					<h3>Select a Chat Room</h3>
					<select
						value={selectedMyTeamId}
						onChange={(e) => setSelectedMyTeamId(e.target.value)}
					>
						<option value="" disabled>Select your team</option>
						{myTeams.map((team) => (
							<option key={team.id} value={team.id}>
								{team.name}
							</option>
						))}
					</select>
					<button
						onClick={() => {
							if (selectedMyTeamId) {
								localStorage.setItem("team_id", selectedMyTeamId);
								navigate(`/teams/${selectedMyTeamId}`);
							}
						}}
					>
						Continue
					</button>

				</div>
			) : (
				<p>Join a team or create your own to get started.</p>
			)}

     <div className="form-box">
			<h3>Join a Chat Room</h3>
			<form onSubmit={handleJoinTeam}>
				<select
					value={selectedAvailableTeamId}
					onChange={(e) => setSelectedAvailableTeamId(e.target.value)}
					required
				>
					<option value="">Select a team</option>
					{availableTeams.map((team) => (
						<option key={team.id} value={team.id}>
							{team.name}
						</option>
					))}
				</select>
				<button type="submit">Join Team</button>
			</form>
		</div>


      <div className="form-box">
        <h3>Create a Chat Room</h3>
        <form onSubmit={handleCreateTeam}>
          <input
            type="text"
            placeholder="Team name"
            value={newTeamName}
            onChange={(e) => setNewTeamName(e.target.value)}
            required
          />
          <button type="submit">Create Team</button>
        </form>
      </div>

      {error && <p style={{ color: "red" }}>{error}</p>}
    </div>
  );
}

export default Welcome;
