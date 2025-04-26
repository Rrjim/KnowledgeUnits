import React, { useState, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const SearchBar = ({ initialUsername, setRepositories, setLoading, setError, authStatus }) => {
  const [githubUsername, setGithubUsername] = useState(initialUsername || "");
  const navigate = useNavigate();

  // Fetch Repositories inside SearchBar
  const fetchRepositories = useCallback(async (user) => {
    if (!user) return;

    setLoading(true);
    setError("");

    try {
      const { data } = await axios.get(`http://localhost:3000/api/github-search/${user}`, { withCredentials: true });
      setRepositories(data.repositories || []);
    } catch (err) {
      setError("User not found or no repositories available.");
    } finally {
      setLoading(false);
    }
  }, [setRepositories, setLoading, setError]);

  // Fetch when component mounts (if username exists)
  useEffect(() => {
    if (initialUsername) {
      fetchRepositories(initialUsername);
    }
  }, [initialUsername, fetchRepositories]);

  // Handle Search
  const handleSearch = async (e) => {
    e.preventDefault();
    if (!authStatus.authenticated) return navigate("/portal");

    if (githubUsername.trim()) {
      navigate(`/github-search/${githubUsername}`); 
    }
  };

  return (
    <form onSubmit={handleSearch} className="search-form">
      <input
        name="githubUser"
        type="text"
        value={githubUsername}
        onChange={(e) => setGithubUsername(e.target.value)}
        placeholder="Enter GitHub username"
      />
      <button type="submit" className="search-button">
        Search
      </button>
    </form>
  );
};

export default SearchBar;
