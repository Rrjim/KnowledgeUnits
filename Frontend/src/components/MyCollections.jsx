import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Box,
  Typography,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import FileCmp from "./FileCmp";
import { labelMap } from "../datasets/labels";

const MyCollection = ({ authStatus, currentUser }) => {
  const [candidates, setCandidates] = useState([]);
  const [selectedCandidate, setSelectedCandidate] = useState("");
  const [collections, setCollections] = useState([]);
  const [selectedCollection, setSelectedCollection] = useState("");
  const [files, setFiles] = useState([]);

  // Prediction modal state
  const [predictionResult, setPredictionResult] = useState(null);
  const [dialogOpen, setDialogOpen] = useState(false);

  const [labelDialogOpen, setLabelDialogOpen] = useState(false);
  const [aggregatedLabels, setAggregatedLabels] = useState({});
  const [currentScore, setCurrentScore] = useState("");


  useEffect(() => {
    const fetchCandidates = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/user-candidates", {
          withCredentials: true,
        });
        setCandidates(data);
      } catch (err) {
        console.error("Error fetching candidates:", err);
      }
    };

    fetchCandidates();
  }, []);

  useEffect(() => {
    if (!selectedCandidate) return;

    const fetchCollections = async () => {
      try {
        const { data } = await axios.get("http://localhost:3000/api/collections", {
          params: { username: selectedCandidate },
          withCredentials: true,
        });
        setCollections(data);
        setSelectedCollection("");
        setFiles([]);
      } catch (err) {
        console.error("Error fetching collections:", err);
      }
    };

    fetchCollections();
  }, [selectedCandidate]);

  useEffect(() => {
    if (!selectedCollection) return;

      fetchFiles();
    }, [selectedCollection]);


  const fetchFiles = async () => {
    if (!selectedCollection) return;
    try {
      const { data } = await axios.get("http://localhost:3000/api/collection-files", {
        params: { collectionId: selectedCollection },
        withCredentials: true,
      });
      setFiles(data);
    } catch (err) {
      console.error("Error fetching files:", err);
    }
  };


  const handleShowAllLabels = async () => {
    const labelsAccumulator = {};
  
    files.forEach((file) => {
      if (file.labels) {
        Object.entries(file.labels).forEach(([label, confidence]) => {
          if (!labelsAccumulator[label]) {
            labelsAccumulator[label] = [];
          }
          labelsAccumulator[label].push(confidence);
        });
      }
    });
  
    const averagedLabels = {};
    Object.entries(labelsAccumulator).forEach(([label, confidences]) => {
      const avg = (confidences.reduce((a, b) => a + b, 0) / confidences.length).toFixed(2);
      averagedLabels[label] = avg;
    });
  
    const LABEL_COUNT = 31;
    const uniqueLabelCount = Object.keys(averagedLabels).length;
    const textScore = ((uniqueLabelCount / LABEL_COUNT) * 100).toFixed(2);
  
    console.log("Text Score:", textScore);
    console.log("Collection ID:", selectedCollection);
  
    try {
      await axios.put(
        `http://localhost:3000/api/collections/${selectedCollection}/score`,
        { score: textScore },
        { withCredentials: true }
      );
    } catch (error) {
      console.error("Failed to update text score:", error);
    }
    setCurrentScore(`${textScore}`);
  
    setAggregatedLabels({ ...averagedLabels});
    setLabelDialogOpen(true);
  };

  const handleFileDelete = async (fileId) => {
    try {
      await axios.post(
        "http://localhost:3000/api/collection-files/delete",
        {
          collectionId: selectedCollection,
          fileId,
        },
        { withCredentials: true }
      );

      setFiles((prev) => prev.filter((file) => file.id !== fileId));
    } catch (error) {
      console.error("Failed to delete file:", error);
    }
  };

  const handleIntegration = async (downloadUrl, fileId) => {
    try {
      const { data: jsCode } = await axios.get(downloadUrl);
  
      const { data: result } = await axios.post("http://localhost:5000/predict", {
        code: jsCode,
      });
  
      const labelsObject = result.predictions.reduce((acc, cur) => {
        const readableLabel = labelMap[cur.label]; // convert LABEL_0 → DOM
        if (readableLabel) {
          acc[readableLabel] = +(cur.confidence * 100).toFixed(2);
        }
        return acc;
      }, {});
  
      console.log("Labels to store:", labelsObject);
      console.log("File ID:", fileId);
  
      // Update labels in backend
      await axios.put(
        `http://localhost:3000/api/files/${fileId}/labels`,
        { labels: labelsObject },
        { withCredentials: true }
      );
      
  
      console.log("Labels updated in DB:", labelsObject);
      await fetchFiles();
      setPredictionResult(result.predictions);
      setDialogOpen(true);
    } catch (error) {
      console.error("Integration failed:", error);
      alert("Error while analyzing code.");
    }
  };


  return (
    <Box p={4}>
      <Typography variant="h4" gutterBottom>
        My Collections
      </Typography>

      <FormControl fullWidth margin="normal">
        <InputLabel>Select Candidate</InputLabel>
        <Select
          value={selectedCandidate}
          label="Select Candidate"
          onChange={(e) => setSelectedCandidate(e.target.value)}
        >
          {candidates.map((c, index) => (
            <MenuItem key={index} value={c}>
              {c}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      {collections.length > 0 && (
        <FormControl fullWidth margin="normal">
          <InputLabel>Select Collection</InputLabel>
          <Select
            value={selectedCollection}
            label="Select Collection"
            onChange={(e) => setSelectedCollection(e.target.value)}
          >
            {collections.map((col) => (
              <MenuItem key={col.id} value={col.id}>
                {col.collection_name}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      )}

      {files.length > 0 ? (
        <Box mt={4}>
      <Button
        variant="contained"
        onClick={handleShowAllLabels}
        disabled={files.length === 0}
        sx={{
          mt: 2,
          backgroundColor: '#673ab7', // deep purple
          color: '#fff',
          '&:hover': {
            backgroundColor: '#5e35b1',
          },
        }}
      >
        Evaluate
      </Button>


          <Typography variant="h6">Files in Collection:</Typography>
          <div className="repositories-list">
            <div className="repositories-grid">
              {files.map((file) => (
                <FileCmp
                  key={file.id}
                  file={file}
                  authStatus={authStatus}
                  currentUser={currentUser}
                  addedFile={Boolean(file.id)}
                  owner={file.owner}
                  repoId={file.repo_id}
                  removedFromCollection={true}
                  repo={file.repo_name}
                  inCollection={true}
                  handleFileDelete={() => handleFileDelete(file.id)}
                  handleIntegration={() => handleIntegration(file.download_url, file.id)}
                  isPredicted={file.labels !==null ? true : false}
                  />
              ))}
            </div>
          </div>
        </Box>
      ) : (
        <p style={{ textAlign: "center", marginTop: "2rem" }}>
          There are not any files yet!
        </p>
      )}

      {/* Prediction Modal */}
      <Dialog open={dialogOpen} onClose={() => setDialogOpen(false)} maxWidth="sm" fullWidth>
        <DialogTitle>Prediction Results</DialogTitle>
        <DialogContent dividers>
        {predictionResult && predictionResult.length > 0 ? (
          predictionResult.map((p, index) => (
            <Box key={index} mb={2}>
              <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                {labelMap[p.label]}
              </Typography>
              <Typography variant="body2" color="textSecondary">
                Confidence: {(p.confidence * 100).toFixed(2)}%
              </Typography>
            </Box>
          ))
        ) : (
          <Typography>No predictions available.</Typography>
        )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setDialogOpen(false)} variant="contained" color="primary">
            Close
          </Button>
        </DialogActions>
      </Dialog>
      <Dialog open={labelDialogOpen} onClose={() => setLabelDialogOpen(false)} maxWidth="sm" fullWidth>
          <DialogTitle
            sx={{
              fontWeight: 800,
              fontSize: "1.75rem",
              background: "linear-gradient(90deg,rgb(114, 0, 146),rgb(101, 0, 163))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              textAlign: "center",
              letterSpacing: 1,
              mb: 2,
            }}
          >
            Aggregated Labels in Collection
          </DialogTitle>
        <DialogContent dividers>
          <Typography
            variant="h5"
            sx={{
              fontWeight: "bold",
              background: "linear-gradient(90deg,rgb(105, 0, 180),rgb(99, 0, 132))",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
              mb: 1,
              textAlign: "center",
              letterSpacing: 1,
              fontSize: "1.25rem",
            }}
          >
            Knowledge Units Covered: {currentScore}%
          </Typography>
          {Object.keys(aggregatedLabels).length > 0 ? (
            Object.entries(aggregatedLabels).map(([label, avgConfidence]) => (
              <Box key={label} mb={2} >
                <Typography variant="subtitle1" sx={{ fontWeight: 600 }}>
                  {label}
                </Typography>
                <Typography variant="body2" color="textSecondary" >
                  Average Confidence: {avgConfidence}%
                </Typography>
              </Box>
            ))
          ) : (
            <Typography>No labels found in this collection.</Typography>
          )}
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setLabelDialogOpen(false)} variant="contained">
            Close
          </Button>
        </DialogActions>
      </Dialog>

    </Box>
  );
};

export default MyCollection;

