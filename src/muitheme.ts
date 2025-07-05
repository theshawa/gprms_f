import { createTheme } from "@mui/material";
import { green } from "@mui/material/colors";

export const muiTheme = createTheme({
  typography: {
    fontFamily: ["Inter", "sans-serif"].join(","),
  },
  palette: {
    primary: green,
    secondary: green,
  },
});
