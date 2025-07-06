import {
  Box,
  Typography,
  Card,
  CardHeader,
  Avatar,
  CardContent,
  Chip,
  Grid,
  CardActions,
  Button,
  IconButton,
  Switch,
  FormControlLabel,
} from "@mui/material";
import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import type { FC } from "react";
import { useNavigate } from "react-router-dom";
import "./index.css";

export const MealItem: FC = () => {
  const navigate = useNavigate();

  return (
    <Box className="meal-item">
      {/* Back Button */}
      <Box className="back-button">
        <IconButton onClick={() => navigate("/staff/kitchen-manager/meals")}>
          <ArrowBackIcon />
        </IconButton>
      </Box>

      {/* Meal Details */}
      <Card className="food-detail-card">
        <CardHeader
          avatar={
            <Avatar
              sx={{ width: 156, height: 156, borderRadius: 2 }}
              src="/item1.png"
              alt="Food Image"
              variant="square"
            />
          }
          title="Grilled Chicken Burger"
          subheader="Contains Gluten, Dairy"
          titleTypographyProps={{ variant: "h6", textAlign: "center" }}
          subheaderTypographyProps={{ textAlign: "center" }}
        />

        <CardContent>
          <Box className="section">
            <Typography variant="h6">Description</Typography>
            <Typography>
              A juicy grilled chicken burger with melted cheese, lettuce,
              tomato, and our signature sauce.
            </Typography>
          </Box>

          <Box className="section">
            <Typography variant="h6">Ingredients</Typography>
            <Grid container spacing={1}>
              {[
                "Chicken",
                "Cheddar Cheese",
                "Lettuce",
                "Tomato",
                "Burger Bun",
              ].map((ing, i) => (
                <Grid item key={i}>
                  <Chip label={ing} color="primary" />
                </Grid>
              ))}
              {["Gluten", "Dairy"].map((warn, i) => (
                <Grid item key={`warn-${i}`}>
                  <Chip label={warn} color="error" />
                </Grid>
              ))}
            </Grid>
          </Box>

          <Box className="section">
            <Typography variant="h6">Preparation Steps</Typography>
            <ol>
              <li>Grill the chicken breast for 5–6 minutes on each side.</li>
              <li>Toast the buns with a little butter.</li>
              <li>
                Assemble with sauce, lettuce, tomato, cheese, and chicken.
              </li>
            </ol>
          </Box>

          <Box className="section">
            <Typography variant="h6">Current Status</Typography>
            <FormControlLabel
              control={<Switch checked disabled />}
              label="Available"
            />
          </Box>
        </CardContent>

        <CardActions sx={{ justifyContent: "flex-end", gap: 2 }}>
          <Button variant="contained" color="primary">
            Edit Recipe
          </Button>
          <Button variant="outlined" color="error">
            Remove Item
          </Button>
        </CardActions>
      </Card>
    </Box>
  );
};
