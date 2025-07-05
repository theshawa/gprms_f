import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import type { FC } from "react";

export const StaffLoginPage: FC = () => {
  return (
    <Box
      component="form"
      p={3}
      display="flex"
      minHeight="100vh"
      noValidate
      autoComplete="off"
    >
      <Card className="w-full max-w-sm m-auto">
        <CardContent>
          <Typography gutterBottom variant="h6">
            Login
          </Typography>
          <Box display="flex" flexDirection="column" gap={2} mt={2}>
            <TextField label="Username" variant="filled" />
            <TextField label="Password" variant="filled" type="password" />
            <Button variant="contained">Login</Button>
          </Box>
        </CardContent>
      </Card>
    </Box>
  );
};
