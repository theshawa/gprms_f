import React, { useState } from "react";
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Typography,
  List,
  ListItem,
  ListItemText,
  Divider,
} from "@mui/material";

interface MenuItemDetails {
  name: string;
  price: string;
  description: string;
  ingredients: string[];
  steps: string[];
  status: string;
}

const MenuDialog = () => {
  const [open, setOpen] = useState(false);

  const menuItem: MenuItemDetails = {
    name: "Grilled Chicken Burger",
    price: "$8.99",
    description:
      "A juicy grilled chicken burger with melted cheese, lettuce, tomato, and our signature sauce.",
    ingredients: [
      "Chicken",
      "Cheddar Cheese",
      "Lettuce",
      "Tomato",
      "Burger Bun",
      "Gluten",
      "Dairy",
    ],
    steps: [
      "Grill the chicken breast for 5–6 minutes on each side.",
      "Toast the buns with a little butter.",
      "Assemble with sauce, lettuce, tomato, cheese, and chicken.",
    ],
    status: "Available",
  };

  return (
    <>
      <Button variant="contained" onClick={() => setOpen(true)}>
        View Item
      </Button>

      <Dialog
        open={open}
        onClose={() => setOpen(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogTitle>
          {menuItem.name} - {menuItem.price}
        </DialogTitle>
        <DialogContent dividers>
          {/* Description */}
          <Typography variant="subtitle1" gutterBottom>
            Description
          </Typography>
          <Typography variant="body2" paragraph>
            {menuItem.description}
          </Typography>
          <Divider sx={{ my: 2 }} />

          {/* Ingredients */}
          <Typography variant="subtitle1" gutterBottom>
            Ingredients
          </Typography>
          <List dense>
            {menuItem.ingredients.map((ingredient, i) => (
              <ListItem key={i}>
                <ListItemText primary={ingredient} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />

          {/* Preparation Steps */}
          <Typography variant="subtitle1" gutterBottom>
            Preparation Steps
          </Typography>
          <List dense>
            {menuItem.steps.map((step, i) => (
              <ListItem key={i}>
                <ListItemText primary={`${i + 1}. ${step}`} />
              </ListItem>
            ))}
          </List>
          <Divider sx={{ my: 2 }} />

          {/* Status */}
          <Typography variant="subtitle1" gutterBottom>
            Current Status
          </Typography>
          <Typography
            variant="body2"
            sx={{
              color: menuItem.status === "Available" ? "green" : "red",
              fontWeight: "bold",
            }}
          >
            {menuItem.status}
          </Typography>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpen(false)}>Close</Button>
          <Button variant="contained" color="primary">
            Add to Cart
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default MenuDialog;
