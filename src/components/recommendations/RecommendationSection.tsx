import React from 'react';
import { Box, Typography, Grid, CircularProgress, Alert } from '@mui/material';
import { RecommendationCard } from './RecommendationCard';
import { useRecommendations } from '@/hooks/useRecommendations';

interface RecommendationSectionProps {
  customerId?: number;
  mealType?: string;
  categoryId?: number;
  onAddToOrder: (dishId: number) => void;
  title?: string;
}

export const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  customerId,
  mealType,
  categoryId,
  onAddToOrder,
  title = 'Recommended for You'
}) => {
  const { recommendations, loading, error, recordFeedback } = useRecommendations({
    customerId,
    mealType,
    categoryId,
    limit: 6
  });

  const handleFeedback = (dishId: number, feedbackType: string) => {
    recordFeedback(dishId, feedbackType);
  };

  if (loading) {
    return (
      <Box display="flex" justifyContent="center" py={4}>
        <CircularProgress />
      </Box>
    );
  }

  if (error) {
    return (
      <Alert severity="error" sx={{ my: 2 }}>
        {error}
      </Alert>
    );
  }

  if (recommendations.length === 0) {
    return null;
  }

  return (
    <Box my={4}>
      <Typography variant="h5" component="h2" mb={3} fontWeight="bold">
        {title}
        {customerId && !customerId ? '' : ' 🎯'}
      </Typography>
      
      <Grid container spacing={2}>
        {recommendations.map((dish) => (
          <Grid item xs={12} sm={6} md={4} key={dish.id}>
            <RecommendationCard
              dish={dish}
              onAddToOrder={onAddToOrder}
              onFeedback={handleFeedback}
            />
          </Grid>
        ))}
      </Grid>
    </Box>
  );
};