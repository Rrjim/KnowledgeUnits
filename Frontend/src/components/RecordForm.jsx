import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Box,
  Button,
} from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import { keyframes } from "@mui/system";
import IconBtn from "../reusable/IconBtn";
import InputDropdown from "../reusable/InputDropdown";
import YesNoToggle from "../reusable/Toggle";
import axios from "axios";
import { createCollectionDTO } from "../dtos/collection.dto";
import { useNavigate } from "react-router-dom";
import ErrorDiv from "../reusable/ErrorDiv";


const tinySplash = keyframes`
  0% { transform: scale(1); }
  50% { transform: scale(1.01) rotate(0.8deg); }
  100% { transform: scale(1) rotate(0deg); }
`;

const RecordForm = ({
  authStatus,
  currentUser,
  open,
  onClose,
  fileId,
  candidate,
  lang,
  currentRepo,
  score,
  collections,
}) => {
  const [isExistingCollection, setIsExistingCollection] = useState(true);
  const [repositories, setRepositories] = useState([]);
  const [name, setName] = useState("");
  const [collectionScore, setCollectionScore] = useState(0);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  useEffect(() => {
    if (isExistingCollection && name) {
      fetchCollectionRepos();
      fetchCollectionScore(name);
    } else {
      setRepositories([]);
      setCollectionScore(0);
    }
  }, [name, isExistingCollection]);
  

  useEffect(() => {
    if (!open) {
      setError("");
      setName("");
      setRepositories([]);
    }
  
    if (isExistingCollection && name) {
      const validNames = collections.map(c => c.collection_name.toLowerCase());
      if (validNames.includes(name.toLowerCase())) {
        setError(""); // Clear error when user fixes it
      }
    }
  }, [open, name, isExistingCollection, collections]);

  const handleSubmit = async () => {
    if (!authStatus.authenticated) return navigate("/portal");
    if (isExistingCollection) {
      const validNames = collections.map(c => c.collection_name.toLowerCase());
      if (!validNames.includes(name.toLowerCase())) {
        setError("Please select a valid existing collection from the dropdown.");
        return;
      }
    }

    const collectionData = createCollectionDTO(
      name,
      candidate,
      lang,
      currentRepo,
      score,
      currentUser,
      fileId
    );
  
    try {
      const existingCollection = collections.find(
        (c) => c.collection_name === name
      );
      console.log(existingCollection);
  
      if (existingCollection) {
        const updatePayload = {
          collectionId: existingCollection.id,
          fileId,
          newRepositories: [currentRepo],
        };
  
        const { data } = await axios.put(
          "http://localhost:3000/api/update-collection",
          updatePayload,
          { withCredentials: true }
        );
  
        if (data.message === "Collection updated successfully!") {  
          if (isExistingCollection && name) {
            await fetchCollectionRepos();
          }
        }
      } else {
        const { data } = await axios.post(
          "http://localhost:3000/api/create-collection",
          collectionData,
          { withCredentials: true }
        );
      }
  
      onClose();
    } catch (error) {
      console.error(
        "Error creating or updating collection:",
        error.response?.data || error.message
      );
    }
  };
  
  const fetchCollectionRepos = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/collection-repos",
        { name },
        { withCredentials: true }
      );
      setRepositories(data[0]?.repositories || []);
      console.log("Fetched repos:", data[0]?.repositories);
    } catch (error) {
      console.error("Failed to fetch collection repositories:", error);
    }
  };
  

  const fetchCollectionScore = async () => {
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/collection-score",
        { name: name },
        { withCredentials: true }
      );
  
      const scoreValue = data?.score ?? 0;
      setCollectionScore(scoreValue);
      console.log("Fetched score:", scoreValue);
    } catch (error) {
      console.error("Failed to fetch collection score:", error);
      setCollectionScore(0); 
    }
  };
  
  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>
        <Box display="flex" justifyContent="space-between" alignItems="center">
          <h3 style={{ color: "#552899" }}>
            Add this file to your collection
          </h3>
          <IconBtn
            icon={<CloseIcon />}
            avatarColor={"#DC143C"}
            onClick={onClose}
          />
        </Box>
        {error && <ErrorDiv message={error} timeout={60000} />}

      </DialogTitle>

      <DialogContent>
        <Box display="flex" flexDirection="column" gap={2}>
          <YesNoToggle
            header="Would you like to add this file to an existing collection?"
            checked={isExistingCollection}
            onToggleChange={setIsExistingCollection}
          />

          <Box>
            {isExistingCollection ? (
              <InputDropdown
                label="Existing Collection"
                placeholder="Select existing collection"
                options={collections
                  .filter((c) => c?.collection_name)
                  .map((c) => ({
                    label: c.collection_name,
                    value: c.collection_name,
                  }))}
                width="100%"
                isDisabled={false}
                onSelect={(value) => setName(value)}
              />
            ) : (
              <InputDropdown
                label="New Collection Name"
                placeholder="Type new collection name"
                options={[]} // No options for free input
                width="100%"
                isDisabled={false}
                isSelectOnly={false}
                onSelect={(value) => setName(value)}
              />
            )}
          </Box>

          <InputDropdown
            label="Candidate"
            name={candidate}
            options={[{ value: candidate, label: candidate }]}
            width="100%"
            isDisabled={true}
            isSelectOnly={true}
          />
          <InputDropdown
            label="Programming Language"
            placeholder="JavaScript"
            options={[{ value: lang, label: lang }]}
            width="100%"
            isDisabled={true}
            isSelectOnly={true}
          />
          {isExistingCollection && <InputDropdown
            label="Repositories"
            placeholder={
              repositories.length > 0
                ? "Click to view related repos"
                : "No repositories available"
            }
            options= {repositories.map((r) => ({ value: r.toLowerCase(), label: r.toLowerCase() }))}
            width="100%"
            isDisabled={repositories.length === 0}
            isSelectOnly={true}
            isListViewOnly={true}
          /> }
          {isExistingCollection && (
            <InputDropdown
              key={`repo-count-${repositories.length}`} // this forces re-render when count changes
              label="Number of Repositories"
              placeholder=""
              options={[{ value: repositories.length, label: repositories.length.toString() }]}
              width="100%"
              isDisabled={true}
              isSelectOnly={true}
            />
          )}
          
          {isExistingCollection && (
          <InputDropdown
            key={`score-${collectionScore}`} // <-- THIS FORCES RE-RENDER
            label="Score"
            placeholder=""
            options={[{ value: collectionScore, label: collectionScore.toString() }]}
            width="100%"
            isDisabled={true}
            isSelectOnly={true}
          />
        )}


        </Box>
      </DialogContent>

      <DialogActions sx={{ justifyContent: "center" }}>
        <Button
          variant="contained"
          onClick={handleSubmit}
          sx={{
            "&:hover": {
              animation: `${tinySplash} 0.4s ease`,
              backgroundColor: "#6a33b8",
            },
          }}
        >
          Submit
        </Button>
      </DialogActions>
    </Dialog>
  );
};

export default RecordForm;
