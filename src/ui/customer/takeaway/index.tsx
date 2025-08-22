import { type FC, useEffect, useState } from "react";

import {
  Box,
  Chip,
  FormControl,
  InputLabel,
  MenuItem,
  Select,
  TextField,
  Typography,
} from "@mui/material";
import { LocationPin } from "@mui/icons-material";
import { DishCard } from "./dish-card";

// Sample data with better images and descriptions
const sampleMenu = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 1200,
    rating: 4,
    category: "Pizza",
    image:
      "https://images.unsplash.com/photo-1604068549290-dea0e4a305ca?w=400&h=300&fit=crop",
    mealType: "Lunch",
    description: "Fresh basil, mozzarella, and tomato sauce",
    popular: true,
  },
  {
    id: 2,
    name: "Spaghetti Carbonara",
    price: 1500,
    rating: 5,
    category: "Pasta",
    image:
      "https://images.unsplash.com/photo-1621996346565-e3dbc353d2e5?w=400&h=300&fit=crop",
    mealType: "Dinner",
    description: "Creamy pasta with pancetta and parmesan",
    popular: false,
  },
  {
    id: 3,
    name: "Omelette",
    price: 500,
    rating: 3,
    category: "Eggs",
    image:
      "https://images.unsplash.com/photo-1506084868230-bb9d95c24759?w=400&h=300&fit=crop",
    mealType: "Breakfast",
    description: "Fluffy eggs with herbs and cheese",
    popular: false,
  },
  {
    id: 4,
    name: "Fish & Chips",
    price: 1700,
    rating: 4,
    category: "Seafood",
    image:
      "https://images.unsplash.com/photo-1544982503-9f984c14501a?w=400&h=300&fit=crop",
    mealType: "Lunch",
    description: "Crispy battered fish with golden fries",
    popular: true,
  },
  {
    id: 5,
    name: "Caesar Salad",
    price: 900,
    rating: 4,
    category: "Salads",
    image:
      "https://images.unsplash.com/photo-1546793665-c74683f339c1?w=400&h=300&fit=crop",
    mealType: "Brunch",
    description: "Fresh romaine with parmesan and croutons",
    popular: false,
  },
  {
    id: 6,
    name: "Beef Burger",
    price: 1400,
    rating: 5,
    category: "Burgers",
    image:
      "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?w=400&h=300&fit=crop",
    mealType: "Lunch",
    description: "Juicy beef patty with fresh vegetables",
    popular: true,
  },
];

const categories = [
  "All",
  ...Array.from(new Set(sampleMenu.map((item) => item.category))),
];

export const Customer_TakeAway: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Lunch");
  const [selectedCategory, setSelectedCategory] = useState("All");
  const [selectedBranch, setSelectedBranch] = useState("");
  const branches = ["Colombo", "Kandy", "Galle"];

  useEffect(() => {
    const hour = new Date().getHours();
    let meal = "Lunch"; // default

    if (hour >= 6 && hour < 10) meal = "Breakfast";
    else if (hour >= 10 && hour < 12) meal = "Brunch";
    else if (hour >= 12 && hour < 15) meal = "Lunch";
    else if (hour >= 15 && hour < 18) meal = "High Tea";
    else if (hour >= 18 && hour < 22) meal = "Dinner";

    setSelectedMealType(meal);
  }, []);

  const filteredItems = sampleMenu.filter((item) => {
    const matchMeal = item.mealType === selectedMealType;
    const matchCategory =
      selectedCategory === "All" || item.category === selectedCategory;
    const matchSearch = item.name
      .toLowerCase()
      .includes(searchTerm.toLowerCase());
    return matchMeal && matchCategory && matchSearch;
  });
  return (
    <main className="min-h-screen bg-white py-4  w-full max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
      <Box sx={{ maxWidth: 1200, mx: "auto" }}>
        <Typography
          sx={{ fontFamily: "serif" }}
          variant="h3"
          align="center"
          gutterBottom
        >
          {selectedMealType} - Order Takeaway
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Select your favorite dishes and choose your preferred branch
        </Typography>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <FormControl fullWidth variant="outlined">
            <InputLabel id="branch-select-label">
              {" "}
              <LocationPin /> Select Branch
            </InputLabel>
            <Select
              labelId="branch-select-label"
              id="branch-select"
              value={selectedBranch}
              onChange={(e) => setSelectedBranch(e.target.value)}
              label="Select Branch"
            >
              {branches.map((branch) => (
                <MenuItem key={branch} value={branch}>
                  {branch}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
          <TextField
            label="Search Dishes"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
            {categories.map((cat) => (
              <Chip
                key={cat}
                label={cat}
                color={selectedCategory === cat ? "primary" : "default"}
                onClick={() => setSelectedCategory(cat)}
                clickable
              />
            ))}
          </Box>
        </Box>

        <Box sx={{ mt: 4 }}>
          {filteredItems.length === 0 ? (
            <Typography variant="h6" align="center" color="text.secondary">
              No dishes found. Try adjusting your filters.
            </Typography>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "repeat(1, 1fr)",
                  sm: "repeat(2, 1fr)",
                  md: "repeat(3, 1fr)",
                  lg: "repeat(4, 1fr)",
                },
                gap: 3,
              }}
            >
              {filteredItems.map((item) => (
                <DishCard item={item} />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </main>
  );
};
