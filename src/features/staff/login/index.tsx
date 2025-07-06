import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { useSetAtom } from "jotai";
import type { FC } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router";
import { useAlert } from "../../../alert";
import { getBackendErrorMessage, staffBackend } from "../../../backend";
import { staffAuthAtom } from "../auth/atom";
import type { StaffUser } from "../auth/auth-state";
import { getEndpointForRole } from "../staff-role";

type LoginInputs = {
  username: string;
  password: string;
};

export const StaffLoginPage: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const setAuth = useSetAtom(staffAuthAtom);
  const navigate = useNavigate();

  const { showAlert } = useAlert();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const res = await staffBackend.post<{
        accessToken: string;
        user: StaffUser;
      }>("/login", {
        username: data.username,
        password: data.password,
      });

      const { accessToken, user } = res.data;
      setAuth({
        accessToken,
        user,
      });

      navigate(`/staff/${getEndpointForRole(user.role)}`, { replace: true });
    } catch (error) {
      showAlert({
        title: "Login Failed",
        message: getBackendErrorMessage(error),
        severity: "error",
      });
    }
  };

  return (
    <Box
      component="form"
      p={3}
      display="flex"
      minHeight="100vh"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
    >
      <Card className="w-full max-w-sm m-auto">
        <CardContent>
          <Typography gutterBottom variant="h6">
            Login
          </Typography>
          <TextField
            {...register("username", {
              required: {
                message: "Field is required",
                value: true,
              },
            })}
            label="Username"
            variant="filled"
            fullWidth
            error={!!errors.username}
            helperText={errors.username?.message}
            margin="dense"
          />
          <TextField
            {...register("password", {
              required: {
                message: "Field is required",
                value: true,
              },
            })}
            label="Password"
            variant="filled"
            type="password"
            fullWidth
            error={!!errors.password}
            helperText={errors.password?.message}
            margin="dense"
          />
          <Button
            disabled={isSubmitting}
            variant="contained"
            type="submit"
            fullWidth
            sx={{ mt: 2 }}
          >
            Login
          </Button>
        </CardContent>
      </Card>
    </Box>
  );
};
