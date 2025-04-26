import React from "react";
import { Switch, FormControlLabel, Box, Typography } from "@mui/material";
import { styled } from "@mui/material/styles";
import "../styles/Static.css";

// Custom Styled Switch that changes color based on checked state
const Toggle = styled((props) => <Switch {...props} />)(({ theme, ownerState }) => ({
  "& .MuiSwitch-switchBase.Mui-checked": {
    color: ownerState.checked ? "#00C853" : "#D50000", // Intense Green / Intense Red
    "& + .MuiSwitch-track": {
      backgroundColor: ownerState.checked ? "#00C853" : "#D50000",
    },
  },
  "& .MuiSwitch-switchBase": {
    color: "#D50000", // Intense Red by default
    "& + .MuiSwitch-track": {
      backgroundColor: "#D50000",
    },
  },
}));

const YesNoToggle = ({ header, checked, onToggleChange }) => {
  const handleChange = (event) => {
    onToggleChange(event.target.checked);
  };

  return (
    <>
      <h4 style={{ color: "#552899", fontSize: 16 }}>{header}</h4>
      <Box display="flex" alignItems="center" gap={2}>
        <Typography>
          {checked ? (
            <span className="kuc-text-important positive">Yes</span>
          ) : (
            <span className="kuc-text-important negative">No</span>
          )}
        </Typography>
        <FormControlLabel
          control={
            <Toggle
              checked={checked}
              onChange={handleChange}
              name="yesNoToggle"
              ownerState={{ checked }}
            />
          }
        />
      </Box>
    </>
  );
};

export default YesNoToggle;
