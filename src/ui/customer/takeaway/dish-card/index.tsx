import { Star } from "@mui/icons-material";
import {
  Badge,
  Box,
  Button,
  Card,
  CardActions,
  CardContent,
  CardMedia,
  Typography,
} from "@mui/material";
import { type FC, useState } from "react";
import { QuantitySelectorDialog } from "./quantity-selector-dialog";

export const DishCard: FC<{ item: any }> = ({ item }) => {
  const [quantitySelectorDialogOpen, setQuantitySelectorDialogOpen] =
    useState(false);
  return (
    <>
      {" "}
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
                // transform: "scale(1.03)",
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
                  <Star
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
                <CardActions>
                  <Button
                    onClick={() => setQuantitySelectorDialogOpen(true)}
                    fullWidth
                    size="small"
                    variant="contained"
                  >
                    Add to Cart
                  </Button>
                </CardActions>
              </Box>
            </CardContent>
          </Card>
        </Badge>
      </Box>
      <QuantitySelectorDialog
        open={quantitySelectorDialogOpen}
        onClose={() => setQuantitySelectorDialogOpen(false)}
        dish={item}
      />
    </>
  );
};
