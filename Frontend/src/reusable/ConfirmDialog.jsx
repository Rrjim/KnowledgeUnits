import React from "react";
import { Dialog, DialogTitle, DialogContent, DialogActions, Button } from "@mui/material";
import "../styles/ConfirmDialog.css"; // Import custom styles

const ConfirmDialog = ({ open, onClose, onConfirm, title, message }) => {
  return (
    <Dialog open={open} onClose={onClose} className="confirm-dialog">
            <DialogTitle className="confirm-title">{title}</DialogTitle>
            <DialogContent className="confirm-message">{message}</DialogContent>
            <DialogActions>
                <Button onClick={onClose} className="btn-no">No</Button>
                <Button onClick={onConfirm} className="btn-yes">Yes</Button>
            </DialogActions>
    </Dialog>
  );
};

export default ConfirmDialog;
