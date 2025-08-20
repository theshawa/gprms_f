import { createTheme } from "@mui/material";
import { teal, blue, green, orange, purple, red, grey } from "@mui/material/colors";

export const muiTheme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  palette: {
    primary: {
      light: teal[100],
      main: teal[600],
      dark: teal[800],
      contrastText: '#ffffff',
    },
    secondary: {
      light: blue[100],
      main: blue[600],
      dark: blue[800],
      contrastText: '#ffffff',
    },
    success: {
      light: green[100],
      main: green[600],
      dark: green[800],
      contrastText: '#ffffff',
    },
    warning: {
      light: orange[100],
      main: orange[600],
      dark: orange[800],
      contrastText: '#ffffff',
    },
    error: {
      light: red[100],
      main: red[600],
      dark: red[800],
      contrastText: '#ffffff',
    },
    info: {
      light: blue[100],
      main: blue[600],
      dark: blue[800],
      contrastText: '#ffffff',
    },
    grey: {
      50: grey[50],
      100: grey[100],
      200: grey[200],
      300: grey[300],
      400: grey[400],
      500: grey[500],
      600: grey[600],
      700: grey[700],
      800: grey[800],
      900: grey[900],
    },
  },
  // Custom avatar color combinations that are easy on the eyes
  components: {
    MuiAvatar: {
      styleOverrides: {
        root: {
          fontWeight: 600,
        },
      },

    },
    MuiCard: {
      styleOverrides: {
        root: {
          boxShadow: '0 2px 8px rgba(0,0,0,0.1)',
          borderRadius: 12,
        },
      },
    },
    MuiButton: {
      styleOverrides: {
        root: {
          borderRadius: 8,
          textTransform: 'none',
          fontWeight: 600,
        },
      },
    },
    MuiChip: {
      styleOverrides: {
        root: {
          borderRadius: 8,
        },
      },
    },
  },
});

// Define custom avatar color schemes that are easy on the eyes
export const avatarColors = {
  primary: {
    bg: teal[50],
    color: teal[700],
    border: teal[200],
  },
  secondary: {
    bg: blue[50],
    color: blue[700],
    border: blue[200],
  },
  success: {
    bg: green[50],
    color: green[700],
    border: green[200],
  },
  warning: {
    bg: orange[50],
    color: orange[700],
    border: orange[200],
  },
  error: {
    bg: red[50],
    color: red[700],
    border: red[200],
  },
  info: {
    bg: blue[50],
    color: blue[700],
    border: blue[200],
  },
  neutral: {
    bg: grey[100],
    color: grey[700],
    border: grey[300],
  },
  purple: {
    bg: purple[50],
    color: purple[700],
    border: purple[200],
  },
};

