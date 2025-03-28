import React from "react";
import {
  Typography,
  AppBar,
  Toolbar,
  IconButton
} from "@mui/material";
import { MusicNote, Brightness4, Brightness7 } from "@mui/icons-material";

const Header = ( {darkMode, setDarkMode} ) => {
    return (
        <AppBar position="sticky" color="primary">
            <Toolbar>
            <MusicNote sx={{ mr: 1 }} />
            <Typography variant="h6" sx={{ flexGrow: 1 }}>
                Vulnerable Music App
            </Typography>
            {/* Dark Mode Toggle Button */}
            <IconButton color="inherit" onClick={() => setDarkMode(!darkMode)}>
                {darkMode ? <Brightness7 /> : <Brightness4 />}
            </IconButton>
            </Toolbar>
        </AppBar>
    )
}

export default Header;