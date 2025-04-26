import React, { useEffect, useState, useCallback } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { Box, Typography, CircularProgress } from "@mui/material";
import axios from "axios";
import ResultCard from "../reusable/ResultCard"; 

const UserStatistics = ({ authStatus, currentUser }) => {
  const [stats, setStats] = useState({ likedRepos: 0, savedFiles: 0, createdCollections: 0, mvp: 0 });
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
      navigate(`/my-statistics/${emailUsername}`);
    } else {
      fetchUserStatistics();
    }
  }, [authStatus, currentUser, user, navigate]);

  const fetchUserStatistics = useCallback(async () => {
    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get("http://localhost:3000/api/user-statistics", {
        params: { userId: currentUser.id },
        withCredentials: true,
      });

      setStats({
        likedRepos: data?.likedReposCount ?? 0,
        savedFiles: data?.savedFilesCount ?? 0,
        createdCollections: data?.createdCollectionsCount ?? 0,
        mvpScore: data?.maxCollectionScore ?? 0,
        mvpName: data?.bestCandidate ?? 0
      });
    } catch (error) {
      console.error("Error fetching user statistics:", error);
      setError("Failed to load statistics.");
    } finally {
      setLoading(false);
    }
  }, [currentUser]);

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Box display="flex" justifyContent="center" mt={5}>
        <Typography color="error">{error}</Typography>
      </Box>
    );
  }

  return (
    <>
    <Box display="flex" justifyContent="center" paddingTop="1rem">
    <h3>{currentUser.email.split("@")[0]} Statistics</h3>
    </Box>
    <Box mt={4} display="grid" gridTemplateColumns="repeat(auto-fit, minmax(250px, 1fr))" gap={3}>
      <ResultCard
        type="Repositories Liked"
        resultData={{ name: `${stats.likedRepos}` }}
      />
      <ResultCard
        type="Files Added"
        resultData={{ name: `${stats.savedFiles}` }}
      />
      <ResultCard
        type="Collections Created"
        resultData={{ name: `${stats.createdCollections}` }}
      />
        <ResultCard
        type="MVP" 
        resultData={{ name: `${stats.mvpName}`, score: `${stats.mvpScore} %` }}
      />
    </Box>
    </>
  );
};

export default UserStatistics;
