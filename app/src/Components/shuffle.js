import React from "react";
import { Button, Paper, Stack, Typography } from "@mui/material";
import { Shuffle } from "@mui/icons-material";
import ServerAddress from './Utils/variables';
import serverApi from "./Api/serverApi";

function ShuffleArtist({ handleResponse }) {
  const handleShuffle = async () => {
    try {
      const response = await serverApi(ServerAddress + "/shuffle-artist");
      handleResponse(response);
    } catch (error) {
      console.error("Error shuffling artist:", error);
    }
  };

  return (
    <Paper elevation={3} sx={{ padding: 3, borderRadius: 3 }}>
      <Typography variant="h5" fontWeight="bold" gutterBottom>
        🔀 Shuffle Artist
      </Typography>
      <Stack spacing={2} alignItems="center">
        <Button 
          onClick={handleShuffle} 
          variant="contained" 
          color="warning" 
          startIcon={<Shuffle />}
        >
          Shuffle Artist
        </Button>
      </Stack>
    </Paper>
  );
}

export default ShuffleArtist;
