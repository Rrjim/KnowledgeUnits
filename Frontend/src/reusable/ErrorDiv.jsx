import React, { useState, useEffect } from "react";

const ErrorDiv = ({ message, style, timeout = 3000 }) => {
  const [isVisible, setIsVisible] = useState(true);

  useEffect(() => {
    // Set a timeout to hide the error message after the specified time
    const timer = setTimeout(() => {
      setIsVisible(false);
    }, timeout);

    // Cleanup the timeout on component unmount
    return () => clearTimeout(timer);
  }, [timeout]);

  // Don't render the component if it's not visible
  if (!isVisible) return null; 

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "row",
        justifyContent: "center",
        alignItems: "center",
        width: "80%",
        margin: "20px auto",
        padding: "20px",
        borderRadius: "10px",
        backgroundColor: "#f8d7da", 
        border: "2px solid #f5c6cb", 
        boxShadow: "0 4px 10px rgba(0, 0, 0, 0.1)", 
        animation: "fadeIn 1s ease-out",
        textAlign: "center",
        color: "black",
      }}
    >
      <h3
        style={{
          fontFamily: "'Roboto', sans-serif",
          fontWeight: "200",
          fontSize: "1rem",
          margin: "0",
          padding: "0",
          ...style, 
        }}
      >
        {message}
      </h3>
    </div>
  );
};

export default ErrorDiv;
