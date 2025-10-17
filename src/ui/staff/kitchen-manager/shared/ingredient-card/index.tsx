import { Card, Typography, Box, Chip } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import type { FC } from "react";
import type { Ingredient } from "@/interfaces/ingredient";

interface Props {
  ingredient: Ingredient;
}

export const IngredientCard: FC<Props> = ({ ingredient }) => {
  const isLowStock = ingredient.stockQuantity <= ingredient.lowStockThreshold;
  const isOutofStock = ingredient.stockQuantity <= 0;

  return (
    <Card
      className="ingredient-card"
      sx={{
        borderRadius: 2,
        p: 2,
        display: "flex",
        flexDirection: "column",
        gap: 1,
      }}
    >
      {/* Name + Stock */}
      <Box display="flex" justifyContent="space-between" alignItems="center">
        <Typography variant="h6" fontWeight="bold">
          {ingredient.name}
        </Typography>
        <Typography
          variant="h6"
          color={isLowStock ? "error" : "text.primary"}
          fontWeight="bold"
        >
          {ingredient.stockQuantity} {ingredient.unit}
        </Typography>
      </Box>

      {/* Cost */}
      <Typography variant="body2" color="text.secondary">
        Cost per Unit: <strong>{ingredient.costPerUnit}</strong>
      </Typography>

      {/* Description */}
      <Typography
        variant="body2"
        color="text.secondary"
        noWrap
        title={ingredient.description || "-"}
      >
        {ingredient.description || "-"}
      </Typography>

      {/* Stock Warnings */}
      {isOutofStock ? (
        <Chip
          icon={<WarningIcon />}
          label="Out of stock"
          color="error"
          size="small"
          sx={{ mt: 1, alignSelf: "flex-start" }}
        />
      ) : isLowStock ? (
        <Chip
          icon={<WarningIcon />}
          label={`Low stock (Threshold: ${ingredient.lowStockThreshold} ${ingredient.unit})`}
          color="warning"
          size="small"
          sx={{ mt: 1, alignSelf: "flex-start" }}
        />
      ) : (
        <Chip
          icon={<CheckCircleIcon />}
          label={`In Stock`}
          color="success"
          size="small"
          sx={{ mt: 1, alignSelf: "flex-start" }}
        />
      )}
    </Card>
  );
};
