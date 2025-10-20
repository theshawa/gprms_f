import React from 'react';
import { Card, CardContent, CardMedia, Typography, Chip, Button, Box } from '@mui/material';
import { Star, ThumbUp, ThumbDown } from '@mui/icons-material';

interface RecommendationCardProps {
  dish: {
    id: number;
    name: string;
    description: string;
    price: number;
    image: string;
    category: {
      name: string;
    };
    recommendationScore: number;
    reason: string;
  };
  onAddToOrder: (dishId: number) => void;
  onFeedback: (dishId: number, feedbackType: string) => void;
}

export const RecommendationCard: React.FC<RecommendationCardProps> = ({
  dish,
  onAddToOrder,
  onFeedback
}) => {
  const getScoreColor = (score: number) => {
    if (score > 0.8) return '#4caf50'; // Green
    if (score > 0.6) return '#ff9800'; // Orange
    return '#2196f3'; // Blue
  };

  return (
    <Card sx={{ maxWidth: 345, margin: 1 }}>
      <CardMedia
        component="img"
        height="200"
        image={dish.image}
        alt={dish.name}
      />
      <CardContent>
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" component="div">
            {dish.name}
          </Typography>
          <Chip
            icon={<Star />}
            label={Math.round(dish.recommendationScore * 100)}
            size="small"
            sx={{ backgroundColor: getScoreColor(dish.recommendationScore), color: 'white' }}
          />
        </Box>
        
        <Typography variant="body2" color="text.secondary" mb={1}>
          {dish.description}
        </Typography>
        
        <Box display="flex" justifyContent="space-between" alignItems="center" mb={1}>
          <Typography variant="h6" color="primary">
            ${dish.price.toFixed(2)}
          </Typography>
          <Chip label={dish.category.name} size="small" variant="outlined" />
        </Box>
        
        <Typography variant="caption" color="text.secondary" mb={2} display="block">
          💡 {dish.reason}
        </Typography>
        
        <Box display="flex" gap={1} flexWrap="wrap">
          <Button
            variant="contained"
            color="primary"
            onClick={() => onAddToOrder(dish.id)}
            sx={{ flex: 1 }}
          >
            Add to Order
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ThumbUp />}
            onClick={() => onFeedback(dish.id, 'like')}
          >
            Like
          </Button>
          <Button
            variant="outlined"
            size="small"
            startIcon={<ThumbDown />}
            onClick={() => onFeedback(dish.id, 'dislike')}
          >
            Pass
          </Button>
        </Box>
      </CardContent>
    </Card>
  );
};