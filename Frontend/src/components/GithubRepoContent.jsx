import React, { useState, useEffect, useCallback } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { CircularProgress } from "@mui/material";
import axios from "axios";
import FileCmp from "./FileCmp";
import ErrorDiv from "../reusable/ErrorDiv";
import "./../styles/GithubRepoContent.css";

const GithubRepoContent = ({ authStatus, currentUser }) => {
  const { username, repoName, repoId } = useParams();
  const navigate = useNavigate();
  const [jsFiles, setJsFiles] = useState([]);
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);
  const [fileName, setFileName] = useState("");


  useEffect(() => {
    if (!authStatus.authenticated) {
      navigate(-1);
      return;
    }
    const loadFiles = async () => {
      const repoFiles = await fetchRepoFiles();
      if (repoFiles && repoFiles.length > 0) {
        await fetchAddedFiles(repoFiles);
      }
    };
    loadFiles();
  }, []);
  const fetchRepoFiles = async () => {
    setLoading(true);
    setError("");

    try {
      const response = await axios.get(
        `http://localhost:3000/api/repo-js-code/${username}/${repoName}/content`,
        { withCredentials: true }
      );

      const data = response.data;

      if (data.length === 0) {
        throw new Error("No JavaScript files found.");
      }

      setJsFiles(data);
      return data; 
    } catch (error) {
      setError(error.message);
      if (error.message.includes("No JavaScript files found")) {
        setTimeout(() => navigate(-1), 2000);
      }
    } finally {
      setLoading(false);
    }
  };

  const fetchAddedFiles = useCallback(async (repoFiles) => {
    try {
      const { data, status } = await axios.get(
        "http://localhost:3000/api/added-files",
        {
          params: {
            userId: currentUser.id,
            repoId: repoId,
          },
          withCredentials: true,
        }
      );

      if (status === 200) {
        const updatedFiles = repoFiles.map(file => {
          const match = data.files.find(f => f.download_url === file.download_url);
          if (match) {
            return { ...file, id: match.id }; 
          }
          return file;
        });
        setJsFiles(updatedFiles);
        console.log(updatedFiles);
      }
    } catch (err) {
      console.error("Error fetching added files:", err);
    }
  }, [currentUser, repoId]);
  return (
    <div className="container">
      <h2 className="title">JavaScript Files in {repoName}</h2>
      {error && <ErrorDiv message={error} />}

      {loading && (
        <div className="loading-container">
          <CircularProgress />
          <p>Loading files...</p>
        </div>
      )}
      {!loading && jsFiles.length > 0 ? (
        <div className="file-list">
          {jsFiles.map((file) => (
            <FileCmp
              key={file.download_url}
              authStatus={authStatus}
              currentUser={currentUser}
              file={file}
              // setOpenForm={setOpenForm}
              setFileName={setFileName}   
              addedFile={Boolean(file.id)} 
            />
          ))}
        </div>
      ) : (
        !loading && <p className="no-files">No JavaScript files found.</p>
      )}
    </div>
  );
};

export default GithubRepoContent;
