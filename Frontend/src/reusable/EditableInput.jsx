import React, { useState } from "react";
import { TextField, InputAdornment } from "@mui/material";
import BorderColorSharpIcon from "@mui/icons-material/BorderColorSharp";
import SaveIcon from "@mui/icons-material/Save";

const EditableInput = ({ description }) => {
  const [isEditing, setIsEditing] = useState(false);
  const [inputValue, setInputValue] = useState(description || "No description available");

  const handleToggleEdit = () => setIsEditing((prev) => !prev);

  return (
    <div style={{ position: "relative", width: "100%", textAlign: "center" }}>
      {isEditing ? (
        <TextField
          variant="outlined"
          fullWidth
          name={inputValue}
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
          InputProps={{
            endAdornment: (
              <InputAdornment position="end">
                <SaveIcon
                  onClick={handleToggleEdit}
                  style={{ cursor: "pointer", color: "black" }}
                />
              </InputAdornment>
            ),
          }}
        />
      ) : (
        <div style={{ position: "relative", display: "flex", alignItems: "center", justifyContent: "center" }}>
          <p
            style={{
              color: "purple",
              fontSize: "0.9rem", 
              margin: 0,
              wordBreak: "break-word",
              textAlign: "center",
              maxWidth: "85%",
              lineHeight: "1.4",
            }}
          >
            {inputValue}
          </p>
          <BorderColorSharpIcon
            onClick={handleToggleEdit}
            style={{
              position: "absolute",
              right: "0", 
              cursor: "pointer",
              color: "black",
              fontSize: "1.2rem",
            }}
          />
        </div>
      )}
    </div>
  );
};

export default EditableInput;
