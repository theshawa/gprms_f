import { Card, Typography, Box, Chip, Stack } from "@mui/material";
import WarningIcon from "@mui/icons-material/Warning";
import ScheduleIcon from "@mui/icons-material/Schedule";
import BusinessIcon from "@mui/icons-material/Business";
import UpdateIcon from "@mui/icons-material/Update";
import type { FC } from "react";

interface Ingredient {
  name: string;
  stock: string;
  unitCost: string;
  origin: string;
  hasAllergens?: boolean;
  allergens?: string[];
  expiryDate: string;
  supplier: string;
  lastUpdated: string;
}

interface Props {
  ingredient: Ingredient;
}

export const IngredientCard: FC<Props> = ({ ingredient }) => {
  const {
    name,
    stock,
    unitCost,
    origin,
    hasAllergens,
    allergens = [],
    expiryDate,
    supplier,
    lastUpdated,
  } = ingredient;

  return (
    <Card className="ingredient-card" sx={{ borderRadius: 2, p: 2 }}>
      {/* Header */}
      <Box className="card-header" mb={1}>
        <Typography variant="h6" className="ingredient-name">
          {name}
        </Typography>
      </Box>

      {/* Details */}
      <Box className="ingredient-details" mb={2}>
        <DetailRow label="Current Stock:" value={stock} />
        <DetailRow label="Unit Cost:" value={unitCost} />
        <DetailRow label="Origin:" value={origin} />
      </Box>

      {/* Allergens */}
      {hasAllergens && allergens.length > 0 && (
        <Stack
          direction="row"
          spacing={1}
          alignItems="center"
          className="allergen-chips"
          mb={2}
        >
          {allergens.map((allergen, i) => (
            <Chip
              key={i}
              label={`Contains ${allergen}`}
              icon={<WarningIcon color="warning" />}
              color="warning"
              variant="outlined"
            />
          ))}
        </Stack>
      )}

      {/* Expiry */}
      <Card variant="outlined" className="expiry-card" sx={{ p: 1, mb: 2 }}>
        <Box
          className="expiry-header"
          display="flex"
          alignItems="center"
          gap={1}
        >
          <ScheduleIcon color="action" className="expiry-icon" />
          <Typography variant="body2" className="expiry-label">
            Best Before:
          </Typography>
        </Box>
        <Typography variant="body1" className="expiry-date">
          {expiryDate}
        </Typography>
      </Card>

      {/* Supplier Info */}
      <Box className="supplier-info">
        <SupplierRow
          icon={<BusinessIcon />}
          label="Supplier"
          value={supplier}
        />
        <SupplierRow
          icon={<UpdateIcon />}
          label="Last Updated"
          value={lastUpdated}
        />
      </Box>
    </Card>
  );
};

// Reusable Components
const DetailRow = ({ label, value }: { label: string; value: string }) => (
  <Box display="flex" justifyContent="space-between" mb={0.5}>
    <Typography variant="body2" color="text.secondary">
      {label}
    </Typography>
    <Typography variant="body2">{value}</Typography>
  </Box>
);

const SupplierRow = ({
  icon,
  label,
  value,
}: {
  icon: React.ReactNode;
  label: string;
  value: string;
}) => (
  <Box display="flex" alignItems="center" gap={1} mb={0.5}>
    {icon}
    <Typography variant="body2">
      <strong>{label}:</strong> {value}
    </Typography>
  </Box>
);
