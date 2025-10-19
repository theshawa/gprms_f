import type { Ingredient } from "@/interfaces/ingredient";
import { Add, Close, Delete, Remove, Search } from "@mui/icons-material";
import {
  Box,
  Divider,
  IconButton,
  InputAdornment,
  List,
  ListItem,
  ListItemButton,
  ListItemText,
  Paper,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { Controller, useFormContext } from "react-hook-form";

export const IngredientsSelector: FC<{
  allIngredients: Ingredient[];
  name: string; // field name for react-hook-form
}> = ({ allIngredients, name }) => {
  const {
    control,
    formState: { errors },
  } = useFormContext();

  const [search, setSearch] = useState("");
  const [showingIngredients, setShowingIngredients] = useState<Ingredient[]>([]);

  useEffect(() => {
    const term = search.trim().toLowerCase();
    if (!term) {
      setShowingIngredients(allIngredients);
      return;
    }

    setShowingIngredients(
      allIngredients.filter((ingredient) => ingredient.name.toLowerCase().includes(term))
    );
  }, [search, allIngredients]);

  const handleAddIngredient = (
    ingredient: Ingredient,
    selectedIngredients: { ingredient: Ingredient; quantity: number }[],
    onChange: (value: { ingredient: Ingredient; quantity: number }[]) => void
  ) => {
    const exists = selectedIngredients.find((item) => item.ingredient.id === ingredient.id);
    if (!exists) {
      onChange([...selectedIngredients, { ingredient, quantity: 1 }]);
    }
  };

  const handleRemoveIngredient = (
    ingredientId: number,
    selectedIngredients: { ingredient: Ingredient; quantity: number }[],
    onChange: (value: { ingredient: Ingredient; quantity: number }[]) => void
  ) => {
    onChange(selectedIngredients.filter((item) => item.ingredient.id !== ingredientId));
  };

  const handleQuantityChange = (
    ingredientId: number,
    quantity: number,
    selectedIngredients: { ingredient: Ingredient; quantity: number }[],
    onChange: (value: { ingredient: Ingredient; quantity: number }[]) => void
  ) => {
    if (quantity < 0) return;
    onChange(
      selectedIngredients.map((item) =>
        item.ingredient.id === ingredientId ? { ...item, quantity } : item
      )
    );
  };

  const getAvailableIngredients = (
    selectedIngredients: { ingredient: Ingredient; quantity: number }[]
  ) => {
    return showingIngredients.filter(
      (ingredient) => !selectedIngredients.find((item) => item.ingredient.id === ingredient.id)
    );
  };

  const fieldError = errors[name]?.message as string;

  return (
    <Controller
      control={control}
      name={name}
      rules={{
        required: "At least one ingredient is required",
        validate: (value: { ingredient: Ingredient; quantity: number }[]) => {
          if (!value || value.length === 0) {
            return "At least one ingredient is required";
          }
          if (value.some((item) => item.quantity <= 0)) {
            return "All ingredients must have a quantity greater than 0";
          }
          return true;
        },
      }}
      render={({
        field: { onChange, value = [] as { ingredient: Ingredient; quantity: number }[] },
      }) => {
        const availableIngredients = getAvailableIngredients(value);

        return (
          <Stack component={Paper} mt={2} p={2}>
            <Typography gutterBottom variant="subtitle1">
              Select Ingredients
            </Typography>
            <Typography variant="body2" color="textSecondary">
              Add ingredients to this dish. Ensure they are already created in the system.
            </Typography>

            {value.length > 0 && (
              <Box mt={2}>
                <Typography variant="overline" color="textSecondary" gutterBottom>
                  Selected Ingredients
                </Typography>
                <Stack spacing={1}>
                  {value.map((item: { ingredient: Ingredient; quantity: number }) => (
                    <Box
                      key={item.ingredient.id}
                      sx={{
                        display: "flex",
                        flexDirection: { xs: "column", sm: "row" },
                        alignItems: {
                          xs: "start",
                          sm: "center",
                        },
                        p: 1,
                        border: 1,
                        borderColor: "divider",
                        borderRadius: 1,
                      }}
                    >
                      <Box sx={{ flex: 1 }} mb={{ xs: 1, sm: 0 }}>
                        <Typography variant="body2">{item.ingredient.name}</Typography>
                        {item.ingredient.description && (
                          <Typography variant="caption" color="textSecondary">
                            {item.ingredient.description}
                          </Typography>
                        )}
                      </Box>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.ingredient.id,
                              item.quantity - 1,
                              value,
                              onChange
                            )
                          }
                        >
                          <Remove fontSize="small" />
                        </IconButton>
                        <TextField
                          size="small"
                          type="number"
                          value={item.quantity}
                          label={`Qty (${item.ingredient.unit.toUpperCase()})`}
                          onChange={(e) =>
                            handleQuantityChange(
                              item.ingredient.id,
                              parseInt(e.target.value) || 0,
                              value,
                              onChange
                            )
                          }
                          sx={{ width: 80 }}
                          slotProps={{
                            htmlInput: {
                              step: 0.01,
                              min: 0,
                            },
                          }}
                          error={item.quantity === 0}
                        />
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleQuantityChange(
                              item.ingredient.id,
                              item.quantity + 1,
                              value,
                              onChange
                            )
                          }
                        >
                          <Add fontSize="small" />
                        </IconButton>
                        <IconButton
                          size="small"
                          onClick={() =>
                            handleRemoveIngredient(item.ingredient.id, value, onChange)
                          }
                          color="error"
                        >
                          <Delete fontSize="small" />
                        </IconButton>
                      </Box>
                    </Box>
                  ))}
                </Stack>
                <Divider sx={{ my: 2 }} />
              </Box>
            )}

            <TextField
              disabled={!search && availableIngredients.length === 0}
              fullWidth
              placeholder="Search ingredients..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              sx={{ mt: 2, mb: 2 }}
              margin="dense"
              size="small"
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
            <List sx={{ maxHeight: 300, overflow: "auto" }}>
              {availableIngredients.map((ingredient) => (
                <ListItem key={ingredient.id} disablePadding>
                  <ListItemButton onClick={() => handleAddIngredient(ingredient, value, onChange)}>
                    <ListItemText primary={ingredient.name} secondary={ingredient.description} />
                  </ListItemButton>
                </ListItem>
              ))}
              {availableIngredients.length === 0 && (
                <ListItem>
                  <ListItemText
                    secondary={
                      value.length === allIngredients.length
                        ? "All ingredients have been selected"
                        : "No ingredients found"
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
        );
      }}
    />
  );
};
