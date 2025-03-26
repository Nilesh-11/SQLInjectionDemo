import React, { useState } from "react";
import {
  Container,
  Button,
  Typography,
  Snackbar,
  Alert,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  AppBar,
  Toolbar,
  Box,
  CssBaseline,
  useMediaQuery,
  IconButton
} from "@mui/material";
import { MusicNote, LibraryMusic, Shuffle, ErrorOutline, Brightness4, Brightness7 } from "@mui/icons-material";
import { ThemeProvider, createTheme, useTheme } from "@mui/material/styles";
import AddSong from "./addsong";
import PlaySong from "./playsong";
import PlayArtist from "./playartist";
import ShuffleArtist from "./shuffle";
import SongGallery from "./gallery";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);
  const [hackerAlert, setHackerAlert] = useState(false);
  const [playlist, setPlaylist] = useState([]);

  const handleResponse = (data) => {
    if (data.is_hacker) {
      setHackerAlert(true);
      console.error("Error:", data.error);
    } else if (data.error) {
      console.error("Error:", data.error);
      setError("An error occurred! Check console for details.");
    } else {
      setPlaylist(data.playlist);
      console.log("Data Received from database:", data.playlist);
    }
  };

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      {/* Header */}
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

      <Container sx={{ py: isMobile ? 2 : 4 }}>
        {/* Trending Songs */}
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
          🔥 Trending Songs
        </Typography>
        <SongGallery />

        {/* Buttons */}
        <Box 
          sx={{ 
            display: "flex", 
            flexDirection: isMobile ? "column" : "row", 
            alignItems: "center",
            justifyContent: "center", 
            gap: 2, 
            mt: 4 
          }}
        >
          <Button fullWidth={isMobile} variant="contained" color="primary" startIcon={<LibraryMusic />} onClick={() => setPage("add")}>
            Add Song
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="secondary" startIcon={<MusicNote />} onClick={() => setPage("playSong")}>
            Play Song
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="success" startIcon={<LibraryMusic />} onClick={() => setPage("playArtist")}>
            Play Artist
          </Button>
          <Button fullWidth={isMobile} variant="contained" color="warning" startIcon={<Shuffle />} onClick={() => setPage("shuffle")}>
            Shuffle Artist
          </Button>
        </Box>

        {/* Page Components */}
        {page === "add" && <AddSong handleResponse={handleResponse} />}
        {page === "playSong" && <PlaySong handleResponse={handleResponse} />}
        {page === "playArtist" && <PlayArtist handleResponse={handleResponse} />}
        {page === "shuffle" && <ShuffleArtist handleResponse={handleResponse} />}

        {/* Available Songs Table */}
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: "bold", mt: 4 }}>
          🎼 Available Songs
        </Typography>

        {(!playlist || playlist.length === 0) ? (
          <Typography variant="h6" color="textSecondary" sx={{ textAlign: "center", mt: 2 }}>
            No Songs Found
          </Typography>
        ) : (
          <TableContainer component={Paper} sx={{ mt: 2, boxShadow: 3, borderRadius: 2, overflowX: "auto" }}>
            <Table sx={{ minWidth: 300 }}>
              <TableHead sx={{ backgroundColor: theme.palette.mode === "dark" ? "#424242" : "#eeeeee" }}>
                <TableRow>
                  <TableCell sx={{ fontWeight: "bold" }}>ID</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Artist</TableCell>
                  <TableCell sx={{ fontWeight: "bold" }}>Song</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {playlist.map((row) => (
                  <TableRow key={row[0]} hover>
                    <TableCell>{row[0]}</TableCell>
                    <TableCell>{row[1]}</TableCell>
                    <TableCell>{row[2]}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </TableContainer>
        )}

        {/* Snackbar for Hacker Alert */}
        <Snackbar 
          open={hackerAlert} 
          autoHideDuration={6000} 
          onClose={() => setHackerAlert(false)} 
          anchorOrigin={{ vertical: "top", horizontal: "center" }}
        >
          <Alert severity="error" sx={{ fontWeight: "bold" }}>
            🚨 Possible hacking attempt detected! 🚨
          </Alert>
        </Snackbar>

        {/* Snackbar for Error Alert */}
        <Snackbar 
          open={!!error} 
          autoHideDuration={6000} 
          onClose={() => setError(null)} 
          anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
        >
          <Alert severity="warning" icon={<ErrorOutline />}>
            {error}
          </Alert>
        </Snackbar>
      </Container>

      {/* Footer */}
      <Box sx={{ textAlign: "center", py: 2, backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5" }}>
        <Typography variant="body2" color="textSecondary">
          © {new Date().getFullYear()} YACC Music App | Created with ❤️
        </Typography>
      </Box>
    </ThemeProvider>
  );
}

export default App;
