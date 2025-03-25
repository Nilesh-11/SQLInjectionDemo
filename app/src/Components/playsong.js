import React, { useState } from "react";
import { TextField, Button, Box, Paper, Stack, Typography } from "@mui/material";
import { PlayArrow } from "@mui/icons-material";
import ServerAddress from './Utils/variables';
import serverApi from "./Api/serverApi";

function PlaySong({ handleResponse }) {
  const [song, setSong] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await serverApi(ServerAddress + "/play-song?song=" + encodeURIComponent(song));
      handleResponse(response);
    } catch (error) {
      console.error("Error fetching song:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🎵 Play a Song
      </Typography>
      <Stack spacing={2}>
        <TextField 
          label="Song Name" 
          value={song} 
          onChange={(e) => setSong(e.target.value)} 
          fullWidth 
          variant="outlined" 
        />
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="secondary" 
          startIcon={<PlayArrow />}
        >
          Play Song
        </Button>
      </Stack>
    </Paper>
  );
}

export default PlaySong;
