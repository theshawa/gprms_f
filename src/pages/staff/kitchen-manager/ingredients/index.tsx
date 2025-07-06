import { Box, Tabs, Tab, Typography, InputBase, Grid } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import { useState } from "react";
import type { FC } from "react";
// import { IngredientCard } from "../shared/ingredient-card";
import "./index.css";
import { IngredientCard } from "../shared/ingredient-card";

const categories = [
  "Spices",
  "Sauces",
  "Vegetables",
  "Fruits",
  "Oils",
  "Flours",
  "Drinks",
];

export const KitchenManagerIngredientsPage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const ingredients = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    name: `Ingredient ${i + 1}`,
    category: categories[activeTab],
  }));

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="ingredients-page">
      <Box className="header-tabs">
        {/* Header */}
        <Box className="header">
          <Typography variant="h5">Ingredients</Typography>

          <Box className="form-group">
            <SearchIcon />
            <InputBase
              placeholder="Search by name..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          centered
          variant="scrollable"
          scrollButtons="auto"
        >
          {categories.map((cat, idx) => (
            <Tab label={cat} key={idx} />
          ))}
        </Tabs>
      </Box>

      {/* Content */}
      <Box className="tab-content">
        <Grid container spacing={3}>
          {filtered.map((ing) => (
            <Grid item xs={12} sm={6} md={3} key={ing.id}>
              <IngredientCard
                ingredient={{
                  name: "Turmeric Powder",
                  stock: "2.5 kg",
                  unitCost: "Rs. 1250/kg",
                  origin: "India",
                  hasAllergens: true,
                  allergens: ["Gluten"],
                  expiryDate: "Dec 15, 2025",
                  supplier: "Spice World Ltd",
                  lastUpdated: "2 days ago",
                }}
              />
            </Grid>
          ))}
        </Grid>
      </Box>
    </Box>
  );
};
