import { CssBaseline, ThemeProvider } from "@mui/material";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { RouterProvider } from "react-router-dom";
import { AlertComponent } from "./components/alert";
import { ConfirmationComponent } from "./components/confirmation";
import { muiTheme } from "./muitheme";
import { router } from "./router";

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider theme={muiTheme}>
        <CssBaseline />
        <RouterProvider router={router}></RouterProvider>
        <AlertComponent />
        <ConfirmationComponent />
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
