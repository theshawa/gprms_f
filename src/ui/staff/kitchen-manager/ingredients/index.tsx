import SearchIcon from "@mui/icons-material/Search";
import { Box, InputBase, Tab, Tabs, Typography } from "@mui/material";
import type { FC } from "react";
import { useState } from "react";
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

export const KitchenManager_IngredientsPage: FC = () => {
  const [activeTab, setActiveTab] = useState(0);
  const [searchTerm, setSearchTerm] = useState("");

  const handleTabChange = (_: React.SyntheticEvent, newValue: number) => {
    setActiveTab(newValue);
  };

  const ingredients = Array.from({ length: 16 }, (_, i) => ({
    id: i,
    name: `${categories[activeTab]} ${i + 1}`,
    stock: `${(Math.random() * 5 + 1).toFixed(1)} kg`,
    unitCost: `Rs. ${(Math.random() * 1000 + 500).toFixed(0)}/kg`,
    origin: "India",
    hasAllergens: Math.random() > 0.7,
    allergens: ["Gluten", "Dairy"].filter(() => Math.random() > 0.5),
    expiryDate: "Dec 15, 2025",
    supplier: "Supplier Co.",
    lastUpdated: `${Math.floor(Math.random() * 10)} days ago`,
    category: categories[activeTab],
  }));

  const filtered = ingredients.filter((i) =>
    i.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <Box className="w-full flex flex-col">
      {/* Sticky header + tabs */}
      <Box className="sticky top-16 bg-white/80 backdrop-blur-md z-10">
        {/* Header */}
        <Box className="flex justify-between items-center px-8 py-4 h-[60px]">
          <Typography variant="h5" className="font-semibold">
            Ingredients
          </Typography>

          <Box className="flex items-center gap-2 border border-black/30 px-3 py-1 rounded-2xl bg-white shadow-sm">
            <SearchIcon className="text-gray-500" />
            <InputBase
              placeholder="Search ingredients..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-48"
            />
          </Box>
        </Box>

        {/* Tabs */}
        <Tabs
          value={activeTab}
          onChange={handleTabChange}
          variant="scrollable"
          scrollButtons="auto"
          className="border-b border-gray-200"
        >
          {categories.map((cat, idx) => (
            <Tab key={idx} label={cat} className="normal-case font-medium" />
          ))}
        </Tabs>
      </Box>

      {/* Content */}
      <Box className="flex-1 p-8">
        {filtered.length === 0 ? (
          <Typography className="text-gray-500 text-center">
            No ingredients found.
          </Typography>
        ) : (
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {filtered.map((ing) => (
              <IngredientCard key={ing.id} ingredient={ing} />
            ))}
          </div>
        )}
      </Box>
    </Box>
  );
};
