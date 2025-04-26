import React, { useState, useEffect } from "react";
import {
  Box,
  List,
  ClickAwayListener,
  TextField,
  Typography,
} from "@mui/material";
import { motion } from "framer-motion";
import "../styles/InputDropdown.css";

const InputDropdown = ({
  label,
  placeholder,
  isDisabled,
  options,
  width,
  isListViewOnly,
  isSelectOnly,
  onSelect,
}) => {
  const [open, setOpen] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [selectedValue, setSelectedValue] = useState("");

  const closeMenu = () => setOpen(false);

  const handleSelect = (value) => {
    setSelectedValue(value);
    const selectedOption = options.find((opt) => opt.value === value);
    setInputValue(selectedOption?.label || "");
    closeMenu();
    onSelect && onSelect(value, "selected");
  };

  const handleInputChange = (e) => {
    const value = e.target.value;
    setInputValue(value);
    setOpen(true);
    onSelect && onSelect(value, "input");
  };

  const handleInputClick = () => {
    setOpen(true);
  };

  const filteredOptions = inputValue
    ? options.filter((option) =>
        option?.label?.toLowerCase().includes(inputValue.toLowerCase())
      )
    : options;

  const showDropdown = open;

  // Auto-select single option if it's the only one
  useEffect(() => {
    if (options.length === 1 && !selectedValue) {
      handleSelect(options[0].value);
    }
  }, [options, selectedValue]);

  return (
    <div style={{ position: "relative", width: width }}>
      {label && (
        <Typography
          variant="subtitle2"
          sx={{ mb: 0.5, fontWeight: 600, color: "gray" }}
        >
          {label}
        </Typography>
      )}
      <TextField
        variant="outlined"
        fullWidth
        value={inputValue}
        onChange={isSelectOnly ? undefined : handleInputChange}
        onClick={handleInputClick}
        placeholder={placeholder}
        disabled={isDisabled}
        sx={{
          "& .MuiInputBase-input": {
            cursor: isListViewOnly || isSelectOnly ? "pointer" : "text",
          },
        }}
      />
      {showDropdown && (
        <ClickAwayListener onClickAway={closeMenu}>
          <Box
            className="kuc-dropdown-box"
            component={motion.div}
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
          >
            <List className="kuc-list" sx={{ padding: 0 }}>
              {filteredOptions.map((option, index) => (
                <motion.li
                  key={index}
                  style={{
                    cursor: isListViewOnly ? "not-allowed" : "pointer",
                    backgroundColor: isListViewOnly ? "#552899" : "",
                    borderRadius: isListViewOnly ? "8px" : "",
                    color: isListViewOnly ? "white" : "",
                    marginTop: isListViewOnly ? "3px" : "",
                  }}
                  className={`kuc-record-list-item ${
                    isDisabled ? "disabled" : ""
                  }`}
                  whileHover={{ y: isDisabled ? 0 : -2 }}
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  onClick={() => {
                    if (!isDisabled && !isListViewOnly)
                      handleSelect(option.value);
                  }}
                >
                  {option.label}
                </motion.li>
              ))}
            </List>
          </Box>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default InputDropdown;
