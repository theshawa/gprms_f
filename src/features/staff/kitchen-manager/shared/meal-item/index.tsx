import ArrowBackIcon from "@mui/icons-material/ArrowBack";
import {
  Avatar,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
  FormControlLabel,
  Grid,
  IconButton,
  Switch,
  Typography,
} from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router";
import "./index.css";

export const MealItem: FC = () => {
  return (
    <Box className="meal-item">
      {/* Back Button */}
      <Box className="back-button">
        <Link to={"/staff/kitchen-manager/meals"}>
          <IconButton>
            <ArrowBackIcon />
          </IconButton>
        </Link>
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
                <Grid key={i}>
                  <Chip label={ing} color="primary" />
                </Grid>
              ))}
              {["Gluten", "Dairy"].map((warn, i) => (
                <Grid key={`warn-${i}`}>
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
