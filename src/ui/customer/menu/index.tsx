import { type FC, useState } from "react";

import {
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Chip,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Box,
  Badge,
} from "@mui/material";
import StarIcon from "@mui/icons-material/Star";

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

const mealTypes = ["Breakfast", "Brunch", "Lunch", "High Tea", "Dinner"];
const categories = [
  "All",
  ...Array.from(new Set(sampleMenu.map((item) => item.category))),
];

export const Customer_MenuViewOnly: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [selectedMealType, setSelectedMealType] = useState("Lunch");
  const [selectedCategory, setSelectedCategory] = useState("All");

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
    <Box sx={{ bgcolor: "background.paper", py: 4 }}>
      <Box sx={{ maxWidth: 1200, mx: "auto", px: 2 }}>
        <Typography
          sx={{ fontFamily: "serif" }}
          variant="h3"
          align="center"
          gutterBottom
        >
          Our Menu
        </Typography>
        <Typography variant="subtitle1" align="center" color="text.secondary">
          Discover delicious dishes crafted with love
        </Typography>

        <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 2 }}>
          <TextField
            label="Search Dishes"
            variant="outlined"
            fullWidth
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
          />

          <ToggleButtonGroup
            value={selectedMealType}
            exclusive
            onChange={(e, value) => value && setSelectedMealType(value)}
            aria-label="Meal Type"
            fullWidth
            size="small"
          >
            {mealTypes.map((type) => (
              <ToggleButton key={type} value={type}>
                {type}
              </ToggleButton>
            ))}
          </ToggleButtonGroup>

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
                <Box key={item.id}>
                  <Badge
                    color="primary"
                    badgeContent={item.popular ? "Popular" : null}
                    invisible={!item.popular}
                    sx={{
                      "& .MuiBadge-badge": {
                        fontSize: 10,
                        height: 20,
                        minWidth: 40,
                        top: 22,
                        right: 40,
                        borderRadius: "12px",
                        padding: "0 8px",
                        fontWeight: 600,
                      },
                    }}
                  >
                    <Card
                      elevation={1}
                      sx={{
                        borderRadius: 2,
                        overflow: "hidden",
                        transition: "transform 0.15s ease-in-out",
                        "&:hover": {
                          transform: "scale(1.03)",
                          boxShadow: 3,
                        },
                      }}
                    >
                      <CardMedia
                        component="img"
                        height="140"
                        image={item.image}
                        alt={item.name}
                        sx={{ objectFit: "cover" }}
                      />
                      <CardContent sx={{ p: 2 }}>
                        <Typography
                          variant="h6"
                          component="h3"
                          gutterBottom
                          sx={{ fontWeight: 600 }}
                        >
                          {item.name}
                        </Typography>
                        <Typography
                          variant="body2"
                          color="text.secondary"
                          sx={{ mb: 1.5, minHeight: 48 }}
                        >
                          {item.description}
                        </Typography>

                        <Box
                          sx={{
                            display: "flex",
                            justifyContent: "space-between",
                            alignItems: "center",
                          }}
                        >
                          <Typography
                            variant="subtitle1"
                            color="primary"
                            sx={{ fontWeight: 700 }}
                          >
                            Rs. {item.price.toLocaleString()}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {item.mealType}
                          </Typography>
                        </Box>

                        <Box
                          sx={{
                            display: "flex",
                            alignItems: "center",
                            mt: 1,
                            gap: 0.5,
                          }}
                        >
                          {[...Array(5)].map((_, i) => (
                            <StarIcon
                              key={i}
                              sx={{
                                fontSize: 18,
                                color: i < item.rating ? "#facc15" : "#e5e7eb",
                              }}
                            />
                          ))}
                          <Typography
                            variant="caption"
                            sx={{ ml: 0.5, color: "text.secondary" }}
                          >
                            ({item.rating})
                          </Typography>
                        </Box>
                      </CardContent>
                    </Card>
                  </Badge>
                </Box>
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </Box>
  );
};
