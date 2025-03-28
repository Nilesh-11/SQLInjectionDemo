import React, { useState } from "react";
import { TextField, Button, Paper, Stack, Typography } from "@mui/material";
import { Add } from "@mui/icons-material";
import ServerAddress from "./Utils/variables";
import serverApi from "./Api/serverApi";

function AddSong({ uid, handleResponse }) {
  const [artist, setArtist] = useState("");
  const [song, setSong] = useState("");

  const handleSubmit = async () => {
    try {
      const response = await serverApi(
        `${ServerAddress}/add-song?artist=${encodeURIComponent(artist)}&song=${encodeURIComponent(song)}&uid=${uid}`
      );
      handleResponse(response);
    } catch (error) {
      console.error("Error adding song:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        ➕ Add a Song
      </Typography>
      <Stack spacing={2}>
        <TextField 
          label="Artist Name" 
          value={artist} 
          onChange={(e) => setArtist(e.target.value)} 
          fullWidth 
          variant="outlined" 
        />
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
          color="primary" 
          startIcon={<Add />}
        >
          Add Song
        </Button>
      </Stack>
    </Paper>
  );
}

export default AddSong;
