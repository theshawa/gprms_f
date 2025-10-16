import { type FC, useState } from "react";
import {
  Box,
  Typography,
  Chip,
  Avatar,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
} from "@mui/material";
import {
  DataGrid,
  type GridColDef,
  type GridRenderCellParams,
  type GridRowParams,
} from "@mui/x-data-grid";
import type { Dish } from "@/interfaces/dish";
import { useQuery } from "@tanstack/react-query";
import { DishesService } from "@/services/staff/kitchen-manager/dishes";
import { PageLoader } from "../../shared/page-loader";
import { PageError } from "../../shared/page-error";

const columns: GridColDef<Dish>[] = [
  {
    field: "image",
    headerName: "",
    width: 80,
    renderCell: (params: GridRenderCellParams<Dish, string>) => (
      <Avatar
        src={params.value}
        variant="rounded"
        sx={{ width: 56, height: 56 }}
      />
    ),
    sortable: false,
    filterable: false,
  },
  {
    field: "name",
    headerName: "Meal Name",
    flex: 1,
    minWidth: 180,
  },
  {
    field: "description",
    headerName: "Description",
    flex: 1,
    minWidth: 120,
  },
  {
    field: "price",
    headerName: "Price (Rs)",
    type: "number",
    flex: 1,
    minWidth: 120,
    valueFormatter: (value: any) => `Rs. ${value.toLocaleString()}`,
  },
];

export const KitchenManager_DishesPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedDish, setSelectedDish] = useState<Dish | null>(null);

  const handleRowClick = (params: GridRowParams<Dish>) => {
    setSelectedDish(params.row);
    setOpen(true);
  };

  const {
    data: dishes = [],
    isPending,
    error,
  } = useQuery({
    queryKey: ["kitchen-manager_dishes"],
    queryFn: () => DishesService.getAll(),
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="dishes list" error={error} />;
  }

  return (
    <main className="flex-1 overflow-y-auto">
      <Typography
        variant="h5"
        component="h2"
        className="sticky top-0 z-10 mb-6 px-8 py-4 bg-white/80 backdrop-blur"
      >
        Dishes
      </Typography>

      <Box className="px-8 pb-8">
        <DataGrid
          rows={dishes}
          columns={columns}
          autoHeight
          pageSizeOptions={[5, 10]}
          disableRowSelectionOnClick
          onRowClick={handleRowClick}
        />
      </Box>

      {/* Enhanced Modal */}
      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="md"
        fullWidth
        PaperProps={{
          sx: {
            borderRadius: 3,
            boxShadow: "0 20px 40px rgba(0,0,0,0.1)",
            overflow: "hidden",
          },
        }}
      >
        {selectedDish && (
          <>
            <DialogTitle
              sx={{
                pb: 2,
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              {selectedDish.name}
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              {/* Hero Image Section */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${selectedDish.image})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "flex-end",
                  p: 3,
                }}
              ></Box>

              {/* Content Section */}
              <Box sx={{ p: 3 }}>
                {/* Price and description Row */}
                <Box
                  sx={{
                    display: "flex",
                    justifyContent: "space-between",
                    alignItems: "center",
                    mb: 3,
                  }}
                >
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                    <Typography
                      variant="h5"
                      sx={{ fontWeight: 700, color: "primary.main" }}
                    >
                      Rs {selectedDish.price.toLocaleString()}
                    </Typography>
                  </Box>
                </Box>

                {/* Description */}
                <Box sx={{ mb: 3 }}>
                  <Typography
                    variant="h6"
                    sx={{ mb: 1, fontWeight: 600, color: "text.primary" }}
                  >
                    Description
                  </Typography>
                  <Typography
                    variant="body1"
                    sx={{ color: "text.secondary", lineHeight: 1.6 }}
                  >
                    {selectedDish.description}
                  </Typography>
                </Box>

                {/* Ingredients Section */}
                <Box>
                  <Typography
                    variant="h6"
                    sx={{ mb: 2, fontWeight: 600, color: "text.primary" }}
                  >
                    Ingredients
                  </Typography>
                  <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                    {selectedDish.ingredients.map((dishIngredient, index) => (
                      <Chip
                        key={dishIngredient.id ?? index}
                        label={`${dishIngredient.ingredient.name} (${dishIngredient.quantity})`}
                        variant="outlined"
                        size="small"
                        sx={{
                          borderRadius: 2,
                          fontWeight: 500,
                          "&:hover": {
                            backgroundColor: "primary.light",
                            color: "white",
                            borderColor: "primary.main",
                          },
                        }}
                      />
                    ))}
                  </Box>
                </Box>
              </Box>
            </DialogContent>

            <DialogActions
              sx={{
                p: 3,
                pt: 2,
                backgroundColor: "grey.50",
                gap: 2,
                justifyContent: "space-between",
              }}
            >
              <Button
                onClick={() => setOpen(false)}
                variant="outlined"
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 500,
                }}
              >
                Close
              </Button>
              <Button
                variant="contained"
                color="primary"
                sx={{
                  minWidth: 100,
                  borderRadius: 2,
                  textTransform: "none",
                  fontWeight: 600,
                  boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                  "&:hover": {
                    boxShadow: "0 6px 16px rgba(0,0,0,0.2)",
                  },
                }}
              >
                Edit Meal
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>
    </main>
  );
};
