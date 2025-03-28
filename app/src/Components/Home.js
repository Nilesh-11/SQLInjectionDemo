import React, { useState, useEffect, useRef } from "react";
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
  Box,
  CssBaseline,
  useMediaQuery,
  CircularProgress
} from "@mui/material";
import { MusicNote, LibraryMusic, Shuffle, ErrorOutline, Refresh  } from "@mui/icons-material";
import { ThemeProvider, createTheme } from "@mui/material/styles";
import AddSong from "./addsong";
import PlaySong from "./playsong";
import PlayArtist from "./playartist";
import ShuffleArtist from "./shuffle";
import SongGallery from "./gallery";
import Header from "./Utils/header";
import Footer from "./Utils/footer";
import initApi from "./Api/initApi";
import ServerAddress from "./Utils/variables";
import resetApi from "./Api/resetTimerApi";

function App() {
  const [darkMode, setDarkMode] = useState(false);
  const isMobile = useMediaQuery("(max-width:600px)");

  const theme = createTheme({
    palette: {
      mode: darkMode ? "dark" : "light",
    },
  });

  const [isLoading, setIsLoading] = useState();
  const [page, setPage] = useState(null);
  const [error, setError] = useState(null);
  const [hackerAlert, setHackerAlert] = useState(false);
  const [playlist, setPlaylist] = useState([]);
  const [uid, setUid] = useState(null);
  const [sessionTimeout, setsessionTimeout] = useState(false);
  const didInit = useRef(false);

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

  const init_setup = async () => {
    setIsLoading(true);
    const response = await initApi(ServerAddress + "/init");
    if (response.error){
      setsessionTimeout(true);
    }
    else{
      setUid(response.uid);
    }
    setIsLoading(false);
  };

  useEffect(() => {
    if (!didInit.current) {
      didInit.current = true;
      init_setup();
    }
  }, []);

  useEffect(() => {
    if (!uid) return;
    const interval = setInterval( async () => {
      const response = await resetApi( { uid }, ServerAddress + "/reset-timer");
      if (!response || response.error){
        console.log(response.error);
        setUid(null);
        setsessionTimeout(true);
      }
    }, 1000);
  
    return () => clearInterval(interval);
  }, [uid]);

  return (
    <ThemeProvider theme={theme}>
      <CssBaseline />

      <Header darkMode={darkMode} setDarkMode={setDarkMode} ></Header>

      <Container sx={{ py: isMobile ? 2 : 4 }}>
        {/* Trending Songs */}
        <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: "bold", mt: 2 }}>
          🔥 Trending Songs
        </Typography>
        <SongGallery />

        {isLoading ? (
          <Box sx={{ display: "flex", justifyContent: "center", mt: 2 }}>
            <CircularProgress />
          </Box>
        ) : sessionTimeout ? (
          <Typography variant="h6" color="error" sx={{ textAlign: "center", mt: 4 }}>
            ⚠️ Your session has expired. Please refresh the page.
          </Typography>
        ) : (
          <>
            {/* Action Buttons */}
            <Box sx={{ display: "flex", flexDirection: isMobile ? "column" : "row", alignItems: "center", justifyContent: "center", gap: 2, mt: 4 }}>
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
            {page === "add" && <AddSong uid={uid} handleResponse={handleResponse} />}
            {page === "playSong" && <PlaySong uid={uid} handleResponse={handleResponse} />}
            {page === "playArtist" && <PlayArtist uid={uid} handleResponse={handleResponse} />}
            {page === "shuffle" && <ShuffleArtist uid={uid} handleResponse={handleResponse} />}

            {/* Available Songs */}
            <Typography variant={isMobile ? "h5" : "h4"} gutterBottom sx={{ fontWeight: "bold", mt: 4 }}>
              🎼 Available Songs
            </Typography>

            {playlist.length === 0 ? (
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
          </>
        )}
        {/* Buttons */}

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

        {/* Session Timeout Snackbar */}
        <Snackbar open={sessionTimeout} anchorOrigin={{ vertical: "top", horizontal: "center" }}>
          <Alert severity="error" action={
            <Button color="inherit" size="small" startIcon={<Refresh />} onClick={() => window.location.reload()}>
              Refresh
            </Button>
          }>
            ⚠️ Session expired! Please refresh.
          </Alert>
        </Snackbar>
      </Container>
      
      <Footer theme={theme} ></Footer>
      
      {/* Footer */}
      
    </ThemeProvider>
  );
}

export default App;
