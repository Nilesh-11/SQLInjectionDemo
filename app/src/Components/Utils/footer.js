import { Box } from "@mui/system"
import { Typography } from "@mui/material"

const Footer = ({theme}) => {
    return (
        <Box sx={{ textAlign: "center", py: 2, backgroundColor: theme.palette.mode === "dark" ? "#121212" : "#f5f5f5" }}>
            <Typography variant="body2" color="textSecondary">
                © {new Date().getFullYear()} YACC Music App | Created with ❤️
            </Typography>
        </Box>
    )
}

export default Footer;