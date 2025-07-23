import { type Meal, getNameForMeal } from "@/enums/meal";
import type { Menu } from "@/interfaces/menu";
import {
  FormControl,
  Grid,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  Typography,
} from "@mui/material";
import type { FC } from "react";

export const SetMenuForMeal: FC<{
  meal: Meal;
  menus: Menu[];
  disabled: boolean;
  onChange: (menuId: number) => void;
  value: number;
}> = ({ meal, menus, disabled, onChange, value }) => {
  return (
    <Grid size={1}>
      <Stack spacing={0.5}>
        <Typography
          color="primary"
          sx={{ textTransform: "uppercase" }}
          variant="subtitle2"
        >
          {getNameForMeal(meal)}
        </Typography>
        {menus.length ? (
          <FormControl fullWidth margin="dense" variant="filled">
            <InputLabel id={`role-select-label-${meal}`}>
              Select Menu
            </InputLabel>
            <Select
              disabled={disabled}
              value={value}
              onChange={(e) => onChange(e.target.value)}
              size="small"
              labelId={`role-select-label-${meal}`}
              label="Select Menu"
              variant="filled"
              margin="dense"
              sx={{ textTransform: "capitalize" }}
            >
              {menus.map((menu) => (
                <MenuItem value={menu.id} sx={{ textTransform: "capitalize" }}>
                  {menu.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        ) : (
          <Typography variant="body2" color="textSecondary">
            No menus created for this meal.
          </Typography>
        )}
      </Stack>
    </Grid>
  );
};
