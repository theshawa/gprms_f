import { createTheme } from "@mui/material";
import { teal } from "@mui/material/colors";

export const muiTheme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  palette: {
    primary: teal,
    secondary: teal,
  },
});
