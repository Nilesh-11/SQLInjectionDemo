import React, { useState } from "react";
import { TextField, Button, Box, Paper, Stack, Typography } from "@mui/material";
import { Album } from "@mui/icons-material";
import ServerAddress from './Utils/variables';
import serverApi from "./Api/serverApi";

function PlayArtist({ uid, handleResponse }) {
  const [artist, setArtist] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await serverApi(ServerAddress + "/play-artist?artist=" + encodeURIComponent(artist) + "&uid=" + uid);
      handleResponse(response);
    } catch (error) {
      console.error("Error fetching artist:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🎤 Play an Artist
      </Typography>
      <Stack spacing={2}>
        <TextField 
          label="Artist Name" 
          value={artist} 
          onChange={(e) => setArtist(e.target.value)} 
          fullWidth 
          variant="outlined" 
        />
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          color="success" 
          startIcon={<Album />}
        >
          Play Artist
        </Button>
      </Stack>
    </Paper>
  );
}

export default PlayArtist;
