import React from "react";
import { Avatar } from "@mui/material";

const IconBtn = ({ avatarColor, icon, onClick, border }) => {
  return (
    <div style={{ position: "relative" }}>
      <Avatar
        sx={{
          bgcolor: avatarColor,
          cursor: "pointer",
          "&:hover": { filter: "brightness(1.2)", transform: "scale(1.04)" },
          border: border
        }}
        onClick={onClick}
      >
        {icon}
      </Avatar>
    </div>
  );
};

export default IconBtn;
