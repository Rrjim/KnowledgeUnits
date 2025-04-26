import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";  
import { Delete as DeleteForeverTwoToneIcon , Code as CodeIcon, StarRate as StarRateIcon } from "@mui/icons-material";
import ResultCard from "../reusable/ResultCard";
import axios from "axios";
import "./../styles/FavoriteUserRepos.css";
import UserCard from "../reusable/UserCard";

const FavoriteUserRepos = ({ authStatus, currentUser }) => {
  const [likedRepos, setLikedRepos] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(new Set());
  const [currentOwner, setCurrentOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const { user } = useParams(); // Get username from the route
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStatus.authenticated || !currentUser) {
      navigate("/portal");
      return;
    }

    const emailUsername = currentUser.email.split("@")[0]; // Extract username from email
    if (user !== emailUsername) {
      navigate(`/my-favorite-repos/${emailUsername}`); // Redirect to correct path if it doesn't match
    } else {
      fetchLikedRepos();
    }
  }, [authStatus, currentUser, user, navigate]);

  const fetchLikedRepos = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`http://localhost:3000/api/liked-repos`, {
        params: { userId: currentUser.id },
        withCredentials: true,
      });

      const users = new Set();
      setLikedRepos(data.likedRepos || []);
      data.likedRepos.forEach((repo) => {
        users.add(repo.owner_name);
      });
      setUniqueUsers(users);
    } catch (err) {
      setError("Error fetching liked repositories.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  const handleLikeRepo = async (repo) => {
    if (!authStatus.authenticated) return navigate("/portal");
    try {
      const { status } = await axios.post(
        `http://localhost:3000/api/like-repo`,
        { 
          userId: currentUser.id, 
          repoId: repo.id, 
          ownerName: repo.ownerName, 
          repoName: repo.name, 
          repoLanguage: repo.language || "Unknown" 
        },
        { withCredentials: true }
      );

      if (status === 200) {
        setLikedRepos((prev) =>
          prev.some((r) => r.id === repo.id) ? prev.filter((r) => r.id !== repo.id) : [...prev, repo]
        );
      }
    } catch (error) {
      console.error("Error liking/unliking repo:", error);
    }
  };

  const handleClick = (ownerName) => {
    setCurrentOwner((prevOwner) => (prevOwner === ownerName ? null : ownerName)); // Toggle selection
  };

  const handleNavigate = (repoName, repoId) => {
    if (!authStatus.authenticated) return navigate("/login");
    navigate(`/github-search/${currentOwner}/${repoName}/${repoId}`);
  };

  return (
    <div className="container">
      <div className="user-container centered">
      <h1>Select a dev to display their repos</h1>
        <div className="users-grid">
  {[...uniqueUsers].map((owner_name) => (
    <UserCard
      key={owner_name}
      name={owner_name}
      onClick={handleClick}
      isSelected={currentOwner === owner_name} // Pass selection state
    />
  ))}
</div>

      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {(likedRepos.length > 0 && currentOwner)  ? (
        <div className="jumbotron centered" style={{ marginTop: "1rem" }}>
          <div className="repositories-list">
            <h3>Liked Repositories</h3>
            <div className="repositories-grid">
              {likedRepos
                .filter((repo) => !currentOwner || repo.owner_name === currentOwner) // Show only selected user's repos
                .map((repo) => (
                  <ResultCard
                    type="Repository"
                    key={repo.id}
                    resultData={repo}
                    formIconButton1={ 
                      <DeleteForeverTwoToneIcon 
                        style={{
                          color: "rgb(214, 214, 214)",
                          opacity: 1,
                        }}
                      />
                    }
                    formIconButton2={<CodeIcon />}
                    symbol={<StarRateIcon style={{ color: "#FFD700", marginBottom: "2px", height: "1rem" }} />}
                    onClick1={() => handleLikeRepo(repo)}
                    onClick2={() => handleNavigate(repo.name, repo.id)}
                  />
                ))}
            </div>
          </div>
        </div>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}></p>
      )}
    </div>
  );
};

export default FavoriteUserRepos;
