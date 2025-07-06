import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Box,
  Typography,
} from "@mui/material";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import type { FC } from "react";
import { MealCard } from "../shared/meal-card";
import "./index.css";

const categories = ["Burgers", "Soups", "Chicken", "Pizza", "Pasta"];

export const KitchenManagerMealsPage: FC = () => {
  return (
    <main className="content">
      <Typography variant="h5" component="h2" className="sticky-header">
        Meals
      </Typography>

      <Box className="category">
        {categories.map((category, index) => (
          <Accordion key={index}>
            <AccordionSummary expandIcon={<ExpandMoreIcon />}>
              <Typography sx={{ flexGrow: 1 }}>{category}</Typography>
              <Typography className="count">3 items</Typography>
            </AccordionSummary>
            <AccordionDetails>
              <Box className="meal-grid">
                {[...Array(6)].map((_, i) => (
                  <MealCard
                    key={i}
                    mealId={"1"}
                    imageUrl={"/item1.png"}
                    name={"Margerita Pizza"}
                    price={3560}
                    status={"Available"}
                  />
                ))}
              </Box>
            </AccordionDetails>
          </Accordion>
        ))}
      </Box>
    </main>
  );
};
