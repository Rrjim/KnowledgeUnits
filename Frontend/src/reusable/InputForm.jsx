import React, { useState } from "react";
import VisibilityIcon from "@mui/icons-material/Visibility";
import VisibilityOffIcon from "@mui/icons-material/VisibilityOff";

const InputForm = ({ label, startIcon, name, type, value, handleChange }) => {
  const [isVisible, setIsVisible] = useState(false);

  const toggleVisibility = () => {
    setIsVisible((prev) => !prev);
  };

  return (
    <div className="form-group input-container">
      <label>{label}</label>
      <div className="input-wrapper">
        {startIcon && <span className="input-icon start">{startIcon}</span>}
        <input 
          name={name}  
          type={type === "password" ? (isVisible ? "text" : "password") : type}
          value={value}
          onChange={handleChange}
          required 
        />
        {type === "password" && (
          <span className="input-icon end" onClick={toggleVisibility}>
            {isVisible ? <VisibilityIcon /> : <VisibilityOffIcon />}
          </span>
        )}
      </div>
    </div>
  );
};

export default InputForm;
