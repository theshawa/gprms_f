import type { Dish } from "@/interfaces/dish";
import {
  ArrowDownward,
  ArrowUpward,
  Close,
  Delete,
  Search,
} from "@mui/icons-material";
import {
  Box,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemIcon,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Tooltip,
  Typography,
} from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";
import type { ManageMennuSectionFormInputs } from ".";

export const DishSelector: FC<{ allDishes: Dish[] }> = ({ allDishes }) => {
  const {
    control,
    watch,
    formState: { errors },
    setValue,
  } = useFormContext<ManageMennuSectionFormInputs>();
  const [search, setSearch] = useState("");
  const [showingDishes, setShowingDishes] = useState<Dish[]>(allDishes);

  const fieldError = errors["menuItems"]?.message as string;

  const menuItems = watch("menuItems") || [];

  const addRemoveDish = (dish: Dish) => {
    const isSelected = menuItems.some((item) => item.id === dish.id);
    let newMenuItems: Dish[];
    if (isSelected) {
      newMenuItems = menuItems.filter((item) => item.id !== dish.id);
    } else {
      newMenuItems = [...menuItems, dish];
    }
    setValue("menuItems", newMenuItems);
  };

  const moveDishUp = (dish: Dish) => {
    const index = menuItems.findIndex((item) => item.id === dish.id);
    if (index < 1) return;

    const newMenuItems = [...menuItems];
    [newMenuItems[index], newMenuItems[index - 1]] = [
      newMenuItems[index - 1],
      newMenuItems[index],
    ];

    setValue("menuItems", newMenuItems);
  };

  const moveDishDown = (dish: Dish) => {
    const index = menuItems.findIndex((item) => item.id === dish.id);
    if (index < 0 || index === menuItems.length - 1) return;

    const newMenuItems = [...menuItems];
    [newMenuItems[index], newMenuItems[index + 1]] = [
      newMenuItems[index + 1],
      newMenuItems[index],
    ];

    setValue("menuItems", newMenuItems);
  };

  useEffect(() => {
    let dishes = allDishes.filter(
      (dish) => !menuItems.some((item) => item.id === dish.id)
    );

    if (search.trim()) {
      const lowerSearchTerm = search.trim().toLowerCase();
      dishes = dishes.filter(
        (dish) =>
          dish.name.toLowerCase().includes(lowerSearchTerm) ||
          dish.description.toLowerCase().includes(lowerSearchTerm)
      );
    }

    setShowingDishes(dishes);
  }, [search, allDishes, menuItems]);

  return (
    <Controller
      control={control}
      name="menuItems"
      rules={{
        required: "At least one dish is required",
        validate: (value: Dish[]) => {
          if (!value || value.length === 0) {
            return "At least one dish is required";
          }
          return true;
        },
      }}
      render={() => (
        <Stack spacing={2} component={Paper} p={2} mt={2}>
          <Typography variant="subtitle1">Dishes for Menu Section</Typography>

          <Box mb={4} borderBottom={1} pb={2} borderColor={"divider"}>
            <Typography variant="subtitle2" gutterBottom>
              Selected Dishes
            </Typography>
            <List dense disablePadding>
              {menuItems.length > 0 ? (
                menuItems.map((item, index) => (
                  <ListItem key={item.id}>
                    <ListItemText
                      primary={item.name}
                      secondary={item.description || "No description available"}
                    />
                    <ListItemIcon>
                      <Tooltip title="Move Up">
                        <IconButton
                          disabled={index === 0}
                          size="small"
                          onClick={() => moveDishUp(item)}
                        >
                          <ArrowUpward fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Move Down">
                        <IconButton
                          disabled={index === menuItems.length - 1}
                          size="small"
                          onClick={() => moveDishDown(item)}
                        >
                          <ArrowDownward fontSize="small" />
                        </IconButton>
                      </Tooltip>
                      <Tooltip title="Remove">
                        <IconButton
                          color="error"
                          size="small"
                          onClick={() => addRemoveDish(item)}
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Tooltip>
                    </ListItemIcon>
                  </ListItem>
                ))
              ) : (
                <ListItem>
                  <ListItemText> No dishes selected.</ListItemText>
                </ListItem>
              )}
            </List>
          </Box>

          <TextField
            label="Search Dishes..."
            variant="outlined"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            size="small"
            disabled={
              allDishes.filter(
                (dish) => !menuItems.some((item) => item.id === dish.id)
              ).length === 0
            }
            slotProps={{
              input: {
                startAdornment: (
                  <InputAdornment position="start">
                    <Search />
                  </InputAdornment>
                ),
                endAdornment: search && (
                  <InputAdornment position="end">
                    <IconButton onClick={() => setSearch("")} disableRipple>
                      <Close fontSize="small" />
                    </IconButton>
                  </InputAdornment>
                ),
              },
            }}
          />
          <List disablePadding dense sx={{ maxHeight: 300, overflow: "auto" }}>
            {showingDishes.length ? (
              showingDishes.map((dish) => (
                <ListItem key={dish.id} disablePadding>
                  <ListItemButton onClick={() => addRemoveDish(dish)}>
                    <ListItemText
                      primary={dish.name}
                      secondary={dish.description || "No description available"}
                    />
                  </ListItemButton>
                </ListItem>
              ))
            ) : (
              <ListItem>
                <ListItemText
                  primary={
                    search.trim() ? "No dishes found." : "No dishes available."
                  }
                />
              </ListItem>
            )}
          </List>

          {fieldError && (
            <Typography variant="caption" color="error" sx={{ mt: 1 }}>
              {fieldError}
            </Typography>
          )}
        </Stack>
      )}
    />
  );
};
