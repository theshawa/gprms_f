import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  TextField,
} from "@mui/material";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { getBackendErrorMessage } from "../../../../backend";
import { StaffRole } from "../../../../enums/staff-role";
import { useAlert } from "../../../../hooks/useAlert";
import type { StaffUser } from "../../../../interfaces/staff-user";
import { StaffService } from "../../../../services/staff";

type FormInputs = {
  role: string;
  name: string;
  username: string;
  password: string;
};

export const ManageAccountDialog: FC<{
  open: boolean;
  handleClose: () => void;
  currentAccount?: StaffUser;
  onManageSuccess: () => void;
}> = ({ handleClose, open, currentAccount, onManageSuccess }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormInputs>();

  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    if (currentAccount) {
      reset({ ...currentAccount, password: "" });
    } else {
      reset({
        role: StaffRole.Waiter,
        name: "",
        username: "",
        password: "",
      });
    }
  }, [currentAccount]);

  const close = () => {
    setTimeout(() => {
      reset();
    }, 300);
    handleClose();
  };

  const onSubmit = async (data: FormInputs) => {
    try {
      if (currentAccount) {
        await StaffService.updateStaffAccount({
          ...currentAccount,
          ...data,
          role: data.role as StaffRole,
        });
      } else {
        await StaffService.createStaffAccount({
          ...data,
          role: data.role as StaffRole,
        });
      }
      onManageSuccess();
      showSuccess(
        `Account ${currentAccount ? "updated" : "created"} successfully`
      );
    } catch (error) {
      showError(
        `Failed to ${
          currentAccount ? "update" : "create"
        } account: ${getBackendErrorMessage(error)}`
      );
    }
  };

  return (
    <Dialog
      open={open}
      disablePortal
      maxWidth="xs"
      onClose={(_, reason) => {
        if (reason !== "backdropClick") {
          close();
        }
      }}
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>
        {currentAccount ? "Update" : "New"} Staff Account
      </DialogTitle>

      <DialogContent>
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          error={!!errors.role}
          disabled={!!currentAccount}
        >
          <InputLabel id="role-select-label">Role</InputLabel>
          <Controller
            name="role"
            control={control}
            rules={{ required: "Field is required" }}
            render={({ field }) => (
              <Select
                {...register("role", {
                  required: {
                    message: "Field is required",
                    value: true,
                  },
                })}
                {...field}
                labelId="role-select-label"
                label="Role"
                variant="filled"
                margin="dense"
              >
                <MenuItem value={StaffRole.Waiter}>Waiter</MenuItem>
                <MenuItem value={StaffRole.Cashier}>Cashier</MenuItem>
                <MenuItem value={StaffRole.KitchenManager}>
                  Kitchen Manager
                </MenuItem>
              </Select>
            )}
          />
          <FormHelperText>{errors.role?.message}</FormHelperText>
        </FormControl>
        <TextField
          {...register("name", {
            required: {
              message: "Field is required",
              value: true,
            },
          })}
          label="Name"
          variant="filled"
          fullWidth
          error={!!errors.name}
          helperText={errors.name?.message}
          margin="dense"
        />
        <TextField
          {...register("username", {
            required: {
              message: "Field is required",
              value: true,
            },
            minLength: {
              message: "Username must be at least 3 characters",
              value: 3,
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
            required: !currentAccount && {
              message: "Field is required",
              value: true,
            },
            minLength: {
              message: "Password must be at least 6 characters",
              value: 6,
            },
          })}
          label="Password"
          variant="filled"
          fullWidth
          error={!!errors.password}
          helperText={
            errors.password?.message ??
            (currentAccount && "Keep empty to keep the same password")
          }
          margin="dense"
        />
      </DialogContent>
      <DialogActions>
        <Button
          variant="contained"
          color="primary"
          type="submit"
          disabled={isSubmitting}
        >
          {currentAccount ? "Update" : "Create"}
        </Button>
        <Button disabled={isSubmitting} onClick={close} sx={{ ml: 1 }}>
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
