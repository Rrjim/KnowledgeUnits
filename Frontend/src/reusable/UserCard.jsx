import React, { useState } from "react";
import { Button } from "@mui/material";
import AccountCircleIcon from "@mui/icons-material/AccountCircle";

const UserCard = ({ name, onClick, isSelected }) => {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <Button
      onClick={() => onClick(name)}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      style={{
        padding: "16px",
        borderRadius: "12px",
        boxShadow: isHovered || isSelected
          ? "0 6px 15px rgba(0, 0, 0, 0.2)"
          : "0 4px 10px rgba(0, 0, 0, 0.1)",
        borderLeft: "5px solid #552899",
        textAlign: "center",
        transition: "background 0.3s, transform 0.3s, box-shadow 0.3s",
        display: "flex",
        flexDirection: "row",
        justifyContent: "flex-start",
        alignItems: "center",
        maxWidth: "250px",
        transform: isHovered ? "translateY(-5px) scale(0.98)" : "none",
        background: (isHovered && !isSelected) ? "linear-gradient(0deg,  #c0c0c0,rgb(255, 246, 246))" : isSelected
          ? "linear-gradient(0deg, rgb(0, 51, 236), black)" // Highlight selected user
          : "linear-gradient(0deg, rgb(255, 255, 255), #c0c0c0)",
        color: isSelected ? "#ffffff" : "#552899", // White text when selected
        cursor: "pointer",
      }}
    >
      {/* User Icon */}
      <AccountCircleIcon
        style={{
          fontSize: "40px",
          marginRight: "12px",
          color: isSelected ? "#c0c0c0" : (isHovered ? "#562980" : "") ,
        }}
      />

      {/* User Name */}
      <div style={{ display: "flex", justifyContent: "center", textAlign: "center", flexDirection: "column" }}>
        <h3
          style={{
            wordWrap: "break-word",
            marginBottom: "8px",
            maxWidth: "100px",
            overflow: "hidden",
            textOverflow: "ellipsis",
            whiteSpace: "nowrap",
            paddingTop: "10px",
            color: (isHovered && !isSelected) ? "#562980" : (isSelected ? "#c0c0c0" : "#552899"),
          }}
        >
          {name}
        </h3>
      </div>
    </Button>
  );
};

export default UserCard;
