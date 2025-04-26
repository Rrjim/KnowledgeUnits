import React, { useState, useEffect } from "react";
import { Dialog, DialogTitle, DialogContent } from "@mui/material";
import { Close as CloseIcon } from "@mui/icons-material";
import IconBtn from "../reusable/IconBtn";

const CodeDialog = ({ open, fileName, fileContent, onClose }) => {
  const [lines, setLines] = useState([]);

  useEffect(() => {
    if (fileContent) {
      const rawLines = fileContent.split("\n");
      const filtered = rawLines.filter(line => line.trim().length > 0);
      console.log("Filtered lines:", filtered); 
      setLines(filtered);
    } else {
      setLines([]);
    }
  }, [fileContent]);  
  

  return (
    <Dialog open={open} onClose={onClose} maxWidth="md" fullWidth>
      <DialogTitle>
        <div style={{ display: "flex", justifyContent: "space-between", alignItems: "center" }}>
          <h3 style={{ color: "#552899" }}>{fileName} ({lines.length} lines)</h3>
          <IconBtn icon={<CloseIcon />} avatarColor={"#DC143C"} onClick={onClose} />
        </div>
      </DialogTitle>
      <DialogContent>
        <div
          style={{
            display: "flex",
            background: "#f4f4f4",
            padding: "10px",
            borderRadius: "5px",
            maxHeight: "400px",
            overflowY: "auto",
            fontSize: "0.9rem",
            fontFamily: "monospace",
          }}
        >
          {/* Line Numbers */}
          <div style={{ paddingRight: "10px", textAlign: "right", color: "#552899", userSelect: "none" }}>
            {lines.map((_, index) => (
              <div key={index} style={{ lineHeight: "1.5", paddingRight: "10px" }}>
                {index + 1}
              </div>
            ))}
          </div>

          {/* Code Content */}
          <pre
            style={{
              margin: 0,
              whiteSpace: "pre-wrap",
              wordWrap: "break-word",
              flex: 1,
            }}
          >
            {lines.map((line, index) => (
              <div key={index}>{line}</div>
            ))}
          </pre>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default CodeDialog;
