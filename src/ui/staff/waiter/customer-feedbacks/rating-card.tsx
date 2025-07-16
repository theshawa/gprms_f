import {
    AccessTime,
    TableRestaurant,
} from "@mui/icons-material";
import {
    Box,
    Card,
    CardContent,
    Chip,
    Divider,
    Rating,
    Stack,
    Typography,
} from "@mui/material";
import type { FC } from "react";

interface CustomerFeedback {
  id: number;
  rating: number;
  comment: string;
  tableNumber?: number;
  diningAreaName?: string;
  createdAt: string;
}

export const RatingCard: FC<{
  feedback: CustomerFeedback;
}> = ({ feedback }) => {
  const getRatingColor = (rating: number) => {
    if (rating >= 4) return "success";
    if (rating >= 3) return "warning";
    return "error";
  };

  const formatDateTime = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  return (
    <Card 
      sx={{ 
        mb: 0, // Remove margin bottom since grid handles spacing
        height: "100%", // Take full height of grid cell
        display: "flex",
        flexDirection: "column",
        position: "relative",
        transition: "all 0.2s ease-in-out",
        "&:hover": {
          boxShadow: 3,
          transform: "translateY(-2px)",
        }
      }}
    >
      <CardContent sx={{ flexGrow: 1, display: "flex", flexDirection: "column" }}>
        {/* Rating Section */}
        <Box mb={2}>
          <Stack direction="row" alignItems="center" spacing={1} mb={1}>
            <Rating value={feedback.rating} readOnly size="small" />
            <Chip
              size="small"
              label={`${feedback.rating}/5`}
              color={getRatingColor(feedback.rating)}
              variant="outlined"
            />
          </Stack>
          <Typography variant="body1" paragraph sx={{ fontStyle: "italic" }}>
            "{feedback.comment}"
          </Typography>
        </Box>

        <Divider sx={{ mb: 2 }} />

        {/* Footer Section */}
        <Box sx={{ mt: "auto" }}>
          <Stack 
            direction={{ xs: "column", sm: "row" }} 
            spacing={2} 
            alignItems={{ xs: "start", sm: "center" }}
            justifyContent="space-between"
          >
            {feedback.tableNumber && (
              <Stack direction="row" alignItems="center" spacing={0.5}>
                <TableRestaurant fontSize="small" color="action" />
                <Typography variant="body2" color="text.secondary">
                  Table {feedback.tableNumber}
                  {feedback.diningAreaName && ` (${feedback.diningAreaName})`}
                </Typography>
              </Stack>
            )}
            
            <Stack direction="row" alignItems="center" spacing={0.5}>
              <AccessTime fontSize="small" color="action" />
              <Typography variant="body2" color="text.secondary">
                {formatDateTime(feedback.createdAt)}
              </Typography>
            </Stack>
          </Stack>
        </Box>
      </CardContent>
    </Card>
  );
};