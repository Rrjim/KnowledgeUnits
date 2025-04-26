import React, { useState } from "react";
import { Avatar, Box, List, ClickAwayListener } from "@mui/material";
import { motion } from "framer-motion"; // Import motion for animations

const IconDropdown = ({ avatarColor, getData, createData, width, borderRad, icon, left }) => {
  const [open, setOpen] = useState(false);

  const toggleMenu = () => {
    setOpen((prev) => !prev);
  };

  const closeMenu = () => {
    setOpen(false);
  };

  return (
    <div style={{ position: "relative" }}>
      {/* Avatar Icon */}
      <Avatar
        sx={{
          bgcolor: avatarColor,
          cursor: "pointer",
          "&:hover": { filter: "brightness(1.2)" },
        }}
        onClick={toggleMenu}
      >
        {icon} {/* This is the avatar icon, typically for "Apps" or similar */}
      </Avatar>

      {/* Dropdown List */}
      {open && (
        <ClickAwayListener onClickAway={closeMenu}>
          <Box
            component={motion.div} // Animate the dropdown itself
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.2, ease: "easeOut" }}
            sx={{
              position: "absolute",
              left: { left },
              background: "linear-gradient(180deg, #7B1FA2, #1A1A1A)",
              boxShadow: "0px 4px 10px rgba(0, 0, 0, 0.1)",
              borderRadius: "8px",
              zIndex: 3,
              width: width,
              cursor: "pointer",
            }}
          >
            <List sx={{ padding: 0 }}>
              {getData.map((item, index) => (
                <motion.li
                  key={index}
                  whileHover={{ y: -5 }} // Moves up on hover
                  transition={{ duration: 0.2, ease: "easeOut" }}
                  style={{ display: "flex", alignItems: "center", padding: "10px" }} // Added padding and alignment
                >
                  {item.icon}
                  {createData(item)}
                </motion.li>
              ))}
            </List>
          </Box>
        </ClickAwayListener>
      )}
    </div>
  );
};

export default IconDropdown;
