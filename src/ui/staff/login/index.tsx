import { getBackendErrorMessage } from "@/backend";
import { getEndpointForRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import { useStaffAuth } from "@/hooks/useStaffAuth";
import { StaffService } from "@/services/staff";
import {
  Box,
  Button,
  Card,
  CardContent,
  TextField,
  Typography,
} from "@mui/material";
import { type FC, useEffect } from "react";
import { type SubmitHandler, useForm } from "react-hook-form";
import { useNavigate } from "react-router-dom";

export type LoginInputs = {
  username: string;
  password: string;
};

export const Staff_LoginPage: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
  } = useForm<LoginInputs>();

  const { auth, setAuth } = useStaffAuth();
  const navigate = useNavigate();

  const { showError } = useAlert();

  const onSubmit: SubmitHandler<LoginInputs> = async (data) => {
    try {
      const { accessToken, user } = await StaffService.login(
        data.username,
        data.password
      );
      setAuth({
        accessToken,
        user,
      });

      navigate(`/staff/${getEndpointForRole(user.role)}`, { replace: true });
    } catch (error) {
      showError(getBackendErrorMessage(error));
    }
  };

  useEffect(() => {
    if (auth) {
      navigate(`/staff/${getEndpointForRole(auth.user.role)}`, {
        replace: true,
      });
    }
  }, [auth]);

  return (
    <Box
      component="form"
      p={3}
      display="flex"
      noValidate
      autoComplete="off"
      onSubmit={handleSubmit(onSubmit)}
      minHeight="100vh"
    >
      <Card className="w-full max-w-sm m-auto">
        <CardContent>
          <Box display="flex" alignItems="center" justifyContent="space-between" mb={2}>
            <Typography variant="h6">
              Login
            </Typography>
            <img src="/public/logo.png" alt="" className="h-7" />
          </Box>
          
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
