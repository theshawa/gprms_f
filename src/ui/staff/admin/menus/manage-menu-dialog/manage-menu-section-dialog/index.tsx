import { getBackendErrorMessage } from "@/backend";
import type { Dish } from "@/interfaces/dish";
import { DishesService } from "@/services/staff/dishes";
import { QKs } from "@/ui/staff/query-keys";
import {
  Alert,
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  LinearProgress,
  TextField,
} from "@mui/material";
import { useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useEffect } from "react";
import { FormProvider, useForm } from "react-hook-form";
import type { FormMenuSection } from "..";
import { DishSelector } from "./dish-selector";
import { QKs as LocalQks } from "./query-keys";

export type ManageMennuSectionFormInputs = {
  name: string;
  description: string;
  menuItems: Dish[];
};

export const ManageMenuSectionDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingSection?: FormMenuSection;
  onAction: (section: ManageMennuSectionFormInputs) => void;
}> = ({ handleClose, open, editingSection, onAction }) => {
  const queryClient = useQueryClient();

  const {
    data: dishes,
    isPending,
    error,
  } = useQuery({
    queryKey: LocalQks.admin_manage_menuSection_dish_selector,
    queryFn: () => DishesService.getAll(),
    initialData: (queryClient.getQueryData(QKs.admin_dishes) as Dish[]) || [],
  });

  const formMethods = useForm<ManageMennuSectionFormInputs>();

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors },
  } = formMethods;

  const onSubmit = (data: ManageMennuSectionFormInputs) => {
    onAction(data);
    reset();
    handleClose();
  };

  useEffect(() => {
    if (editingSection) {
      reset({
        name: editingSection.name,
        description: editingSection.description,
        menuItems: editingSection.menuItems,
      });
    } else {
      reset({
        name: "",
        description: "",
        menuItems: [],
      });
    }
  }, [editingSection]);

  return (
    <FormProvider {...formMethods}>
      <Dialog open={open} fullWidth maxWidth="sm">
        <DialogTitle>
          {editingSection ? "Edit" : "New"} Menu Section
        </DialogTitle>
        <DialogContent>
          {isPending ? (
            <LinearProgress />
          ) : error ? (
            <Alert security="error">
              Failed to load dishes list: {getBackendErrorMessage(error)}
            </Alert>
          ) : !dishes.length ? (
            <Alert severity="info">
              No dishes found. Create some to continue.
            </Alert>
          ) : (
            <>
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
                placeholder="Enter section name, e.g., 'Appetizers', 'Main Courses'"
              />
              <TextField
                {...register("description", {
                  maxLength: {
                    value: 100,
                    message: "Description cannot exceed 100 characters",
                  },
                })}
                label="Description"
                variant="filled"
                fullWidth
                multiline
                rows={3}
                error={!!errors.description}
                helperText={errors.description?.message}
                margin="dense"
                placeholder="Enter a brief description of the section"
              />
              <DishSelector allDishes={dishes} />
            </>
          )}
        </DialogContent>
        <DialogActions>
          <Button
            type="submit"
            onClick={handleSubmit(onSubmit)}
            variant="contained"
          >
            {editingSection ? "Save" : "Create"}
          </Button>
          <Button
            onClick={() => {
              reset();
              handleClose();
            }}
            type="reset"
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </FormProvider>
  );
};
