import React, { useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { ContentPasteSearch as ContentPasteSearchIcon, AddCircle as AddCircleIcon, RemoveCircle as RemoveCircleIcon, DeleteForeverTwoTone } from "@mui/icons-material";
import OfflineBoltTwoToneIcon from '@mui/icons-material/OfflineBoltTwoTone';
import CheckCircleOutlineTwoToneIcon from '@mui/icons-material/CheckCircleOutlineTwoTone';
import ResultCard from "../reusable/ResultCard";
import ConfirmDialog from "../reusable/ConfirmDialog";
import CodeDialog from "../reusable/CodeDialog"; // <-- import here
import { generateSimpleHash } from "../transformers/IdGenerator";
import axios from "axios";
import RecordForm from "./RecordForm";

const FileCmp = ({ file, authStatus, currentUser, setFileName, addedFile, handleFileDelete, handleIntegration, owner, repo, removedFromCollection, inCollection, isPredicted }) => {
  const [collections, setCollections] = useState([]);
  const [openConfirm, setOpenConfirm] = useState(false);
  const [openForm, setOpenForm] = useState(false);
  const [currentAdded, setCurrentAdded] = useState(null);
  const [removed, setRemoved] = useState(false);
  const [error, setError] = useState("");
  const [fileContent, setFileContent] = useState("");
  const [openCodeDialog, setOpenCodeDialog] = useState(false);
  const [localFileName, setLocalFileName] = useState("");
  const [generatedFileId, setGeneratedFileId] = useState(null); // <-- New state to store the generated fileId
  
  const navigate = useNavigate();
  const { username, repoName } = useParams();

  const fetchCollections = async () => {
    try {
      const { data } = await axios.get(
        `http://localhost:3000/api/collections?username=${username}`,
        { withCredentials: true }
      );
      setCollections(data);
      console.log(data);
    } catch (error) {
      console.error("Failed to fetch collections:", error);
    }
  };  

  const handleConfirmOpen = (name) => {
    setFileName(name);
    setOpenConfirm(true);
  };

  const handleConfirmYes = () => {
    setOpenConfirm(false);
    setOpenForm(true);
  };

  const handleFileAdd = async () => {
    const fileId = await generateSimpleHash(file.download_url); 
    setGeneratedFileId(fileId); 
    if (!authStatus.authenticated) return navigate("/portal");
    try {
      const { data } = await axios.post(
        "http://localhost:3000/api/add-file",
        {
          fileId,
          userId: currentUser.id,
          fileName: file.name,
          owner: username || owner,
          repoName: file.repoName || repoName || repo,
          downloadUrl: file.download_url,
        },
        { withCredentials: true }
      );

      if (data.message === "File added successfully!") {
        setCurrentAdded(true);
        await fetchCollections(); 
        handleConfirmOpen(file.name);
      } else if (data.message === "File removed successfully!") {
        setCurrentAdded(false);
        removedFromCollection ? setRemoved(true) : setRemoved(false);
      }
    } catch (error) {
      console.error("Error adding file:", error.response?.data || error.message);
    }
  };

  const handleFileClick = async () => {
    try {
      const response = await fetch(file.download_url);
      const text = await response.text();
      setFileContent(text);
      setLocalFileName(file.name);
      setOpenCodeDialog(true);
    } catch (error) {
      setError("Error loading file content.");
    }
  };

  const icon = removedFromCollection
    ? <DeleteForeverTwoTone color="grey" />
    : currentAdded !== null
      ? (currentAdded ? <RemoveCircleIcon color="error" /> : <AddCircleIcon color="primary" />)
      : (addedFile ? <RemoveCircleIcon color="error" /> : <AddCircleIcon color="primary" />);

  return (
    !removed && (
      <>
        <ResultCard
          type="File"
          key={file.download_url}
          resultData={{ name: file.name }}
          formIconButton1={icon}
          formIconButton2={<ContentPasteSearchIcon />}
          isPredicted={isPredicted}
          fireIntegrationIcon={inCollection &&  ( isPredicted ? <CheckCircleOutlineTwoToneIcon />: <OfflineBoltTwoToneIcon /> )}
          onClick1={inCollection ? handleFileDelete :handleFileAdd}
          onClick2={handleFileClick}
          onClickIntegration={handleIntegration}
        />

        <ConfirmDialog
          open={openConfirm}
          onClose={() => setOpenConfirm(false)}
          onConfirm={handleConfirmYes}
          title="Add File to Collection?"
          message={`This file is added as a standalone file. Would you like to add ${file.name} to one of your collections?`}
        />

        <RecordForm 
          fileId={generatedFileId}  // <-- Pass the generated fileId here
          authStatus={authStatus}
          currentUser={currentUser}
          open={openForm}
          onClose={() => setOpenForm(false)}
          candidate={username}
          lang={"JavaScript"}
          currentRepo={repoName}
          score={"0"}
          collections={collections} // <-- passing fetched collections!
        />

        <CodeDialog
          open={openCodeDialog}
          fileName={localFileName}
          fileContent={fileContent}
          onClose={() => setOpenCodeDialog(false)}
        />
      </>
    )
  );
};

export default FileCmp;
