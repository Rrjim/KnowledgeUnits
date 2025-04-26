import React, { useState, useEffect, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import axios from "axios";
import "./../styles/FavoriteUserRepos.css";
import UserCard from "../reusable/UserCard";
import FileCmp from "./FileCmp";

const StandaloneFiles = ({ authStatus, currentUser }) => {
  const [addedFiles, setAddedFiles] = useState([]);
  const [uniqueUsers, setUniqueUsers] = useState(new Set());
  const [currentOwner, setCurrentOwner] = useState(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");


  const { user } = useParams();
  const navigate = useNavigate();

  useEffect(() => {
    if (!authStatus.authenticated || !currentUser) {
      navigate("/portal");
      return;
    }

    const emailUsername = currentUser.email.split("@")[0];
    if (user !== emailUsername) {
      navigate(`/my-standalone-files/${emailUsername}`); // Notice the path here is different
    } else {
      fetchAddedFiles();
    }
  }, [authStatus, currentUser, user, navigate]);

  const fetchAddedFiles = useCallback(async () => {
    setLoading(true);
    setError("");
  
    try {
      const response = await axios.get("http://localhost:3000/api/user-files", {
        params: { userId: currentUser.id },
        withCredentials: true,
      });
  
      const fetchedFiles = response.data.files || [];
      console.log("Fetched Files from Server:", fetchedFiles);
  
      if (fetchedFiles.length === 0) {
        setError("No files found.");
      } else {
        const usersSet = new Set(fetchedFiles.map((file) => file.repoOwner));
        console.log("Unique Users Set:", usersSet);
        setAddedFiles(fetchedFiles);
        console.log(fetchedFiles);
        setUniqueUsers(usersSet);
      }
    } catch (err) {
      console.error("Error fetching files:", err);
      setError("Error fetching added files.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);
  

  const handleClick = (ownerName) => {
    console.log("Owner clicked:", ownerName);

    setCurrentOwner((prevOwner) => (prevOwner === ownerName ? null : ownerName));
  };

  return (
    <div className="container">
      <div className="user-container centered">
        <h1>Select a dev</h1>
        <div className="users-grid">
          {[...uniqueUsers].map((ownerName) => (
            <UserCard
              key={ownerName}
              name={ownerName}
              onClick={handleClick}
              isSelected={currentOwner === ownerName}
            />
          ))}
        </div>
      </div>

      {loading && <p>Loading...</p>}
      {error && <p className="error">{error}</p>}

      {(addedFiles.length > 0 && currentOwner) ? (
        <div className="jumbotron centered" style={{ marginTop: "1rem" }}>
          <div className="repositories-list">
            <h3>Saved Files</h3>
            <div className="repositories-grid">
            {addedFiles
              .filter((file) => file.repoOwner === currentOwner && file.id)
              .map((file) => (
                <FileCmp
                  key={file.id}
                  file={file}
                  authStatus={authStatus}
                  currentUser={currentUser}
                  addedFile={Boolean(file.id)} 
                  owner={file.repoOwner}     
                  repoId={file.repoId} 
                  removedFromCollection={true}
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

export default StandaloneFiles;
