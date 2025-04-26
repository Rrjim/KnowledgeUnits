import React from "react";
import { ListItem, ListItemText } from "@mui/material";

function LI(props) {
  return (
<ListItem component="a" sx={props.itemStyle} href={props.link} onClick = {props.handleClick}>
<ListItemText sx={props.itemTextStyle} primary={props.itemText} />
    </ListItem>

  );
}

export default LI;
