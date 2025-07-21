import { getBackendErrorMessage } from "@/backend";
import { StaffRole } from "@/enums/staff-role";
import { useAlert } from "@/hooks/useAlert";
import type { StaffUser } from "@/interfaces/staff-user";
import { StaffService } from "@/services/staff/staff";
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
import { useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { Controller, useForm } from "react-hook-form";
import { QKs } from "../../query-keys";

type FormInputs = {
  role: string;
  name: string;
  username: string;
  password: string;
};

export const ManageAccountDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingAccount?: StaffUser;
}> = ({ handleClose, open, editingAccount }) => {
  const {
    handleSubmit,
    register,
    formState: { errors, isSubmitting },
    control,
    reset,
  } = useForm<FormInputs>({
    defaultValues: {
      role: StaffRole.Waiter,
      name: "",
      username: "",
      password: "",
    },
  });

  const queryClient = useQueryClient();

  const { showError, showSuccess } = useAlert();

  useEffect(() => {
    reset(
      editingAccount
        ? { ...editingAccount, password: "" }
        : {
            role: StaffRole.Waiter,
            name: "",
            username: "",
            password: "",
          }
    );
  }, [editingAccount]);

  const onSubmit = async (data: FormInputs) => {
    try {
      if (editingAccount) {
        await StaffService.updateStaffAccount({
          ...editingAccount,
          ...data,
          role: data.role as StaffRole,
        });
      } else {
        await StaffService.createStaffAccount({
          ...data,
          role: data.role as StaffRole,
        });
        reset();
      }

      queryClient.invalidateQueries({ queryKey: QKs.admin_staff });

      showSuccess(
        `Account ${editingAccount ? "updated" : "created"} successfully`
      );
      handleClose();
    } catch (error) {
      showError(
        `Failed to ${
          editingAccount ? "update" : "create"
        } account: ${getBackendErrorMessage(error)}`
      );
    }
  };

  return (
    <Dialog
      open={open}
      maxWidth="xs"
      component="form"
      onSubmit={handleSubmit(onSubmit)}
    >
      <DialogTitle>
        {editingAccount ? "Update" : "New"} Staff Account
      </DialogTitle>

      <DialogContent>
        <FormControl
          fullWidth
          margin="dense"
          variant="filled"
          error={!!errors.role}
          disabled={!!editingAccount}
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
            required: !editingAccount && {
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
            (editingAccount && "Leave empty to keep the same password")
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
          {editingAccount ? "Update" : "Create"}
        </Button>
        <Button
          disabled={isSubmitting}
          onClick={() => {
            reset();
            handleClose();
          }}
          sx={{ ml: 1 }}
        >
          Cancel
        </Button>
      </DialogActions>
    </Dialog>
  );
};
