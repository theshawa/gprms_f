import { Box, Typography, Accordion, AccordionSummary, AccordionDetails } from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import { MealCard } from "../shared/meal-card";
import type { FC } from "react";
import "./index.css";

const categories = ["Burgers", "Soups", "Chicken", "Pizza", "Pasta"];

// Map each category to its item count
const categoryCounts: Record<string, number> = {
  Burgers: 4,
  Soups: 2,
  Chicken: 5,
  Pizza: 3,
  Pasta: 6,
};

export const Customer_MenuPage: FC = () => {
  return (
    <main className="customer-menu-content">
      <Typography variant="h4" component="h2" className="customer-menu-header">
        Menu
      </Typography>
      <Box>
        {categories.map((category, index) => {
          const count = categoryCounts[category] || 0;
          return (
            <Accordion key={index} className="customer-menu-category">
              <AccordionSummary expandIcon={<ExpandMoreIcon />}>
                <Typography sx={{ flexGrow: 1 }}>{category}</Typography>
                <Typography color="text.secondary">{count} items</Typography>
              </AccordionSummary>
              <AccordionDetails>
                <Box className="customer-menu-meal-grid">
                  {[...Array(count)].map((_, i) => (
                    <MealCard
                      key={i}
                      mealId={"1"}
                      imageUrl={"/item1.png"}
                      name={"Margerita Pizza"}
                      price={3560}
                      status={"Available"}
                      desc={"The most basic pizza."}
                    />
                  ))}
                </Box>
              </AccordionDetails>
            </Accordion>
          );
        })}
      </Box>
    </main>
  );
};