import React from "react";
import IconBtn from "./IconBtn";
import { deepOrange, deepPurple } from "@mui/material/colors";

const ResultCard = ({ type, resultData, formIconButton1, formIconButton2, fireIntegrationIcon, symbol, onClick1, onClick2, onClickIntegration, isPredicted }) => {
  const isRepository = type === "Repository";
  const isMVPResult = type === "MVP";
  return (
    <div
      className={type}
      style={{
        padding: "16px",
        borderRadius: "12px",
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)",
        textAlign: "center",
        borderLeft: "5px solid #552899",
        transition: "transform 0.3s, box-shadow 0.3s",
        minHeight: isRepository ? "250px" : "100px",
        display: "flex",
        flexDirection: "column",
        justifyContent: "space-between",
      }}
    >
      <div style={{ textAlign: "left", fontSize: "12px", marginBottom: "10px" }}>{type}</div>

      <div style={{display:"flex", justifyContent:"center"}}>
      <h3
        className={`${type}-title`}
        style={{
          fontSize: isRepository ? "1.4rem" : "1rem",
          wordWrap: "break-word",
          marginBottom: "8px",
          maxWidth: "200px",
          overflow: "hidden",
          textOverflow: "ellipsis",
          whiteSpace: "nowrap",
        }}
        title={resultData.name}
      >
        {resultData.name}
      </h3>
      </div>

      {isMVPResult && (
          <h4 style={{ color: deepPurple[500], fontSize: "1.2rem" }}>
          {resultData ? resultData.score : "No Score Specified"}
        </h4>    
      )}

      {isRepository && (
  <>
    <h4 style={{ color: deepPurple[500], fontSize: "1.2rem" }}>
      {resultData.language ? resultData.language : "No language specified"}
    </h4>
    <p
      style={{
        color: "#555",
        fontSize: "1rem",
        minHeight: "40px",
        overflow: "hidden", // Hide overflowing text
        display: "-webkit-box", // Set the element as a flex container for multi-line support
        WebkitBoxOrient: "vertical", // Set the box orientation to vertical for multiple lines
        WebkitLineClamp: 3, // Limit to 3 lines
        textOverflow: "ellipsis", // Add "..." at the end of the truncated text
      }}
    >
      {resultData.description ? resultData.description : "No description available"}
    </p>
  </>
)}




      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: "10px",
          marginTop: "10px",
        }}
        >

        {formIconButton1 && <IconBtn avatarColor={deepPurple[700]} icon={formIconButton1} onClick={onClick1} />}
        {fireIntegrationIcon && (
            isPredicted ? <IconBtn avatarColor="#3b7f41" icon={fireIntegrationIcon} onClick={onClickIntegration}>
            </IconBtn> : <IconBtn avatarColor={deepOrange[700]} icon={fireIntegrationIcon} onClick={onClickIntegration}></IconBtn>
          )}
        {formIconButton2 && <IconBtn avatarColor={deepOrange[700]} icon={formIconButton2} onClick={onClick2} />}
      </div>

      {symbol && isRepository && (
        <div style={{ fontSize: "1rem", color: "#777", marginTop: "10px", backgroundColor: "white" }}>
          <div style={{ display: "flex", justifyContent: "center", alignItems: "center" }}>
            {symbol} {resultData.stargazers_count}
          </div>
        </div>
      )}
    </div>
  );
};

export default ResultCard;
