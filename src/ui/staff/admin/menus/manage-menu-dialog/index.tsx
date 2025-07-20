import { getBackendErrorMessage } from "@/backend";
import { getNameForMeal, Meal } from "@/enums/meal";
import { useAlert } from "@/hooks/useAlert";
import type { Dish } from "@/interfaces/dish";
import type { Menu } from "@/interfaces/menu";
import { MenusService } from "@/services/menus";
import { QKs } from "@/ui/staff/query-keys";
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
import { MenuSectionsList } from "./menu-sections-list";

export type FormMenuSection = {
  name: string;
  description: string;
  menuItems: Dish[];
};

export type ManageMenuFormInputs = {
  name: string;
  meal: string;
  description: string;
  menuSections: FormMenuSection[];
};

export const ManageMenuDialog: FC<{
  open: boolean;
  handleClose: () => void;
  editingMenu?: Menu;
}> = ({ handleClose, open, editingMenu }) => {
  const {
    handleSubmit,
    formState: { isSubmitting, errors },
    reset,
    register,
    control,
    setValue,
    watch,
  } = useForm<ManageMenuFormInputs>();

  const queryClient = useQueryClient();

  const { showSuccess, showError } = useAlert();

  const onSubmit = async (data: ManageMenuFormInputs) => {
    try {
      const payload = {
        ...data,
        menuSections: data.menuSections.map((section, i) => ({
          name: section.name,
          description: section.description,
          position: i + 1,
          menuItems: section.menuItems.map((item, j) => ({
            dishId: item.id,
            position: j + 1,
          })),
        })),
      };
      if (editingMenu) {
        await MenusService.update(editingMenu.id, payload);
      } else {
        await MenusService.create(payload);
        reset();
      }

      queryClient.invalidateQueries({
        queryKey: QKs.admin_menus,
      });

      showSuccess(`Menu ${editingMenu ? "updated" : "created"} successfully!`);

      handleClose();
    } catch (error) {
      showError(
        `Failed to ${
          editingMenu ? "update" : "create"
        } menu: ${getBackendErrorMessage(error)}`
      );
    }
  };

  useEffect(() => {
    reset(
      editingMenu
        ? {
            ...editingMenu,
            menuSections: editingMenu.menuSections.map((section) => ({
              name: section.name,
              description: section.description,
              menuItems: section.menuItems.map((item) => item.dish),
            })),
          }
        : {
            meal: Meal.Breakfast,
          }
    );
  }, [editingMenu]);

  const menuSections = watch("menuSections") || [];

  const moveMenuSectionUp = (index: number) => {
    if (index > 0) {
      const newSections = [...menuSections];
      [newSections[index], newSections[index - 1]] = [
        newSections[index - 1],
        newSections[index],
      ];
      setValue("menuSections", newSections);
    }
  };

  const moveMenuSectionDown = (index: number) => {
    if (index < menuSections.length - 1) {
      const newSections = [...menuSections];
      [newSections[index], newSections[index + 1]] = [
        newSections[index + 1],
        newSections[index],
      ];
      setValue("menuSections", newSections);
    }
  };

  return (
    <>
      <Dialog
        fullWidth
        open={open}
        component="form"
        maxWidth="sm"
        onSubmit={handleSubmit(onSubmit)}
      >
        <DialogTitle>{editingMenu ? "Update" : "New"} Menu</DialogTitle>
        <DialogContent>
          <FormControl
            fullWidth
            margin="dense"
            variant="filled"
            error={!!errors.meal}
          >
            <InputLabel id="meal-select-label">Meal</InputLabel>
            <Controller
              name="meal"
              control={control}
              rules={{ required: "Field is required" }}
              render={({ field }) => (
                <Select
                  {...register("meal", {
                    required: {
                      message: "Field is required",
                      value: true,
                    },
                  })}
                  {...field}
                  labelId="meal-select-label"
                  label="Meal"
                  variant="filled"
                  margin="dense"
                >
                  {Object.values(Meal).map((meal) => (
                    <MenuItem key={meal} value={meal}>
                      {getNameForMeal(meal)}
                    </MenuItem>
                  ))}
                </Select>
              )}
            />
            <FormHelperText>{errors.meal?.message}</FormHelperText>
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
            placeholder="e.g., 'Lunch Menu'"
          />
          <TextField
            {...register("description", {})}
            label="Description"
            variant="filled"
            fullWidth
            multiline
            rows={3}
            error={!!errors.description}
            helperText={errors.description?.message}
            margin="dense"
            placeholder="Brief description of the menu"
          />
          <Controller
            control={control}
            name="menuSections"
            rules={{
              required: "At least one section is required",
              validate: (value: FormMenuSection[]) => {
                if (!value || value.length === 0) {
                  return "At least one section is required";
                }
                return true;
              },
            }}
            render={({ fieldState: { error } }) => (
              <>
                <MenuSectionsList
                  menuSections={menuSections}
                  onMenuSectionMoveUp={moveMenuSectionUp}
                  onMenuSectionMoveDown={moveMenuSectionDown}
                  onMenuSectionDelete={(index) => {
                    setValue(
                      "menuSections",
                      menuSections.filter((_, i) => i !== index)
                    );
                  }}
                  onNewSection={(section) =>
                    setValue("menuSections", [...menuSections, section])
                  }
                  onMenuSectionEdit={(index, updatedSection) => {
                    const newSections = [...menuSections];
                    newSections[index] = updatedSection;
                    setValue("menuSections", newSections);
                  }}
                />
                <FormHelperText error>{error?.message}</FormHelperText>
              </>
            )}
          ></Controller>
        </DialogContent>
        <DialogActions>
          <Button
            variant="contained"
            type="submit"
            value={editingMenu ? "update-menu" : "new-menu"}
            disabled={isSubmitting}
          >
            {editingMenu ? "Update" : "Create"}
          </Button>
          <Button
            onClick={() => {
              reset();
              handleClose();
            }}
            type="reset"
            disabled={isSubmitting}
          >
            Cancel
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};
