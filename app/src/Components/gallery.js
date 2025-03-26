import React, { useState } from "react";
import { Box, Card, CardMedia, CardContent, Typography, IconButton, useTheme, useMediaQuery } from "@mui/material";
import { PlayArrow, Pause } from "@mui/icons-material";

function SongGallery() {
  const theme = useTheme();
  const isMobile = useMediaQuery(theme.breakpoints.down("sm"));

  const [songs] = useState([
    { id: 1, song: "Perfect", artist: "Ed Sheeran", image: "/songs/perfect.png", audio: "/songs/perfect.mp3" },
    { id: 2, song: "Make You Mine", artist: "PUBLIC", image: "/songs/makeyoumine.png", audio: "/songs/makeyoumine.mp3" },
    { id: 3, song: "Maps", artist: "Lexmorris", image: "/songs/maps.png", audio: "/songs/maps.mp3" },
    { id: 4, song: "More than You Know", artist: "Axwell /\ Ingrosso", image: "/songs/morethanyouknow.png", audio: "/songs/morethanyouknow.mp3" },
    { id: 5, song: "Blue", artist: "Yung Kai", image: "/songs/blue.png", audio: "/songs/blue.mp3" }
  ]);

  const [currentAudio, setCurrentAudio] = useState(null);
  const [playingSong, setPlayingSong] = useState(null);

  const togglePlayPause = (song) => {
    if (currentAudio && playingSong === song) {
      currentAudio.pause();
      setCurrentAudio(null);
      setPlayingSong(null);
    } else {
      if (currentAudio) currentAudio.pause();
      const newAudio = new Audio(song.audio);
      newAudio.play();
      setCurrentAudio(newAudio);
      setPlayingSong(song);
    }
  };

  return (
    <Box 
      sx={{ 
        display: "flex", 
        flexWrap: "wrap", 
        gap: isMobile ? 1.5 : 2, 
        padding: isMobile ? 2 : 3, 
        justifyContent: "center",
      }}
    >
      {songs.map((song) => (
        <Card 
          key={song.id} 
          sx={{ 
            minWidth: isMobile ? 160 : 200, 
            maxWidth: isMobile ? 180 : 240,
            boxShadow: 8, 
            borderRadius: 3, 
            textAlign: "center",
            background: "rgba(255, 255, 255, 0.1)",
            backdropFilter: "blur(8px)",
            transition: "transform 0.3s ease, box-shadow 0.3s ease",
            '&:hover': {
              transform: "scale(1.05)",
              boxShadow: 12
            }
          }}
        >
          <CardMedia 
            component="img" 
            height={isMobile ? 140 : 180} 
            image={song.image} 
            alt={song.song} 
            sx={{ borderRadius: "8px 8px 0 0" }} 
          />
          <CardContent>
            <Typography variant={isMobile ? "subtitle1" : "h6"} fontWeight="bold" color="primary">
              {song.song}
            </Typography>
            <Typography variant="body2" color="text.secondary" mb={1.5}>
              {song.artist}
            </Typography>
            <IconButton 
              onClick={() => togglePlayPause(song)}
              sx={{
                background: `linear-gradient(135deg, ${playingSong === song ? "#d32f2f" : "#1976d2"}, ${playingSong === song ? "#ff5252" : "#64b5f6"})`,
                color: "white",
                width: isMobile ? 45 : 55,
                height: isMobile ? 45 : 55,
                borderRadius: "50%",
                transition: "all 0.3s ease",
                '&:hover': { background: playingSong === song ? "#c62828" : "#1565c0" }
              }}
            >
              {playingSong === song ? <Pause fontSize={isMobile ? "medium" : "large"} /> : <PlayArrow fontSize={isMobile ? "medium" : "large"} />}
            </IconButton>
          </CardContent>
        </Card>
      ))}
    </Box>
  );
}

export default SongGallery;
