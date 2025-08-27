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

interface Meal {
  id: string;
  name: string;
  category: string;
  price: number;
  status: "Available" | "Unavailable";
  desc: string;
  imageUrl: string;
  ingredients: string[];
}

const meals: Meal[] = [
  {
    id: "1",
    name: "Margherita Pizza",
    category: "Pizza",
    price: 3560,
    status: "Available",
    desc: "The most basic pizza.",
    imageUrl: "/item1.png",
    ingredients: [
      "Chicken",
      "Cheddar Cheese",
      "Lettuce",
      "Tomato",
      "Burger Bun",
      "Gluten",
      "Dairy",
    ],
  },
  {
    id: "2",
    name: "Chicken Burger",
    category: "Burgers",
    price: 2200,
    status: "Unavailable",
    desc: "Juicy grilled chicken patty with lettuce.",
    imageUrl: "/item2.png",
    ingredients: [
      "Chicken",
      "Cheddar Cheese",
      "Lettuce",
      "Tomato",
      "Burger Bun",
      "Gluten",
      "Dairy",
    ],
  },
  {
    id: "3",
    name: "Tomato Soup",
    category: "Soups",
    price: 1200,
    status: "Available",
    desc: "Warm and comforting classic.",
    imageUrl: "/item3.png",
    ingredients: [
      "Chicken",
      "Cheddar Cheese",
      "Lettuce",
      "Tomato",
      "Burger Bun",
      "Gluten",
      "Dairy",
    ],
  },
];

const columns: GridColDef<Meal>[] = [
  {
    field: "imageUrl",
    headerName: "",
    width: 80,
    renderCell: (params: GridRenderCellParams<Meal, string>) => (
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
    field: "category",
    headerName: "Category",
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
  {
    field: "status",
    headerName: "Status",
    flex: 1,
    minWidth: 120,
    renderCell: (params: GridRenderCellParams<Meal, Meal["status"]>) => (
      <Chip
        label={params.value}
        color={params.value === "Available" ? "success" : "error"}
        variant="outlined"
      />
    ),
  },
  {
    field: "desc",
    headerName: "Description",
    flex: 2,
    minWidth: 200,
  },
];

export const KitchenManager_MealsPage: FC = () => {
  const [open, setOpen] = useState(false);
  const [selectedMeal, setSelectedMeal] = useState<Meal | null>(null);

  const handleRowClick = (params: GridRowParams<Meal>) => {
    setSelectedMeal(params.row);
    setOpen(true);
  };

  return (
    <main className="flex-1 overflow-y-auto">
      <Typography
        variant="h5"
        component="h2"
        className="sticky top-0 z-10 mb-6 px-8 py-4 bg-white/80 backdrop-blur"
      >
        Meals
      </Typography>

      <Box className="px-8 pb-8">
        <DataGrid
          rows={meals}
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
        {selectedMeal && (
          <>
            <DialogTitle
              sx={{
                pb: 2,
                textAlign: "center",
                fontSize: "1.5rem",
                fontWeight: 600,
              }}
            >
              {selectedMeal.name}
            </DialogTitle>

            <DialogContent sx={{ p: 0 }}>
              {/* Hero Image Section */}
              <Box
                sx={{
                  height: 200,
                  backgroundImage: `linear-gradient(rgba(0,0,0,0.3), rgba(0,0,0,0.3)), url(${selectedMeal.imageUrl})`,
                  backgroundSize: "cover",
                  backgroundPosition: "center",
                  display: "flex",
                  alignItems: "flex-end",
                  p: 3,
                }}
              >
                <Chip
                  label={selectedMeal.status}
                  color={
                    selectedMeal.status === "Available" ? "success" : "error"
                  }
                  variant="filled"
                  sx={{
                    fontWeight: 600,
                    fontSize: "0.875rem",
                    boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                  }}
                />
              </Box>

              {/* Content Section */}
              <Box sx={{ p: 3 }}>
                {/* Price and Category Row */}
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
                      Rs {selectedMeal.price.toLocaleString()}
                    </Typography>
                  </Box>
                  <Chip
                    label={selectedMeal.category}
                    variant="outlined"
                    color="primary"
                    sx={{ fontWeight: 500 }}
                  />
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
                    {selectedMeal.desc}
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
                    {selectedMeal.ingredients.map((ingredient, index) => (
                      <Chip
                        key={index}
                        label={ingredient}
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
