import * as React from "react";
import Paper from "@mui/material/Paper";
import InputBase from "@mui/material/InputBase";
import IconButton from "@mui/material/IconButton";
import SearchIcon from "@mui/icons-material/Search";

export default function Search(props) {
  return (
    <Paper
      sx={{
        p: "1px 1px",
        display: "flex",
        alignItems: "center",
        width: "100%",
      }}
    >
      <InputBase
        sx={{ ml: 1, flex: 1 }}
        placeholder="Search articles"
        inputProps={{ "aria-label": "search articles" }}
        value={props.value}
        onChange={props.onChange}
      />
      <IconButton onClick={props.onClick} type="button" sx={{ p: "10px" }} aria-label="search">
        <SearchIcon />
      </IconButton>
    </Paper>
  );
}
