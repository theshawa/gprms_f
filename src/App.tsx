import { CssBaseline, ThemeProvider } from "@mui/material";
import { RouterProvider } from "react-router";
import { muiTheme } from "./muitheme";
import { router } from "./router";

function App() {
  return (
    <ThemeProvider theme={muiTheme}>
      <CssBaseline />
      <RouterProvider router={router}></RouterProvider>
    </ThemeProvider>
  );
}

export default App;
