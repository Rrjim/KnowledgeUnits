import React from "react";
import { Avatar } from "@mui/material";

const ButtonWithIcon = ({ buttonText, buttonWidth = "100%", btnClass, icon, onClick }) => {
  return (
    <button
      className={btnClass}
      style={{
        display: "flex",
        width: buttonWidth,
        alignItems: "center",
        justifyContent: "space-between", // Avatar pushed to right
        paddingInline: "16px",
        paddingBlock: "12px",
        fontSize: "16px",
        border: "none",
        borderRadius: "5px",
        cursor: "pointer",
      }}
      onClick={onClick}
    >
      {/* text stays centered */}
      <span style={{ flexGrow: 1, textAlign: "center" }}>{buttonText}</span>

      <Avatar
        className={btnClass}
        sx={{
          borderRadius: "8%",
          width: 28,
          height: 28,
          background: "transparent",
        }}
      >
        {icon}
      </Avatar>
    </button>
  );
};

export default ButtonWithIcon;
