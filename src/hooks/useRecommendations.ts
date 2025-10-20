import { useState, useEffect } from 'react';
import { customerBackend } from '@/lib/customer-backend';

interface Recommendation {
  id: number;
  name: string;
  description: string;
  price: number;
  image: string;
  category: {
    id: number;
    name: string;
  };
  recommendationScore: number;
  reason: string;
}

interface UseRecommendationsProps {
  customerId?: number;
  mealType?: string;
  categoryId?: number;
  limit?: number;
}

export const useRecommendations = ({
  customerId,
  mealType,
  categoryId,
  limit = 10
}: UseRecommendationsProps) => {
  const [recommendations, setRecommendations] = useState<Recommendation[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchRecommendations = async () => {
    if (!customerId) return;

    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (mealType) params.append('mealType', mealType);
      if (categoryId) params.append('categoryId', categoryId.toString());

      const response = await customerBackend.get(
        `/recommendations/customer/${customerId}?${params.toString()}`
      );

      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error('Error fetching recommendations:', err);
      setError('Failed to load recommendations');
    } finally {
      setLoading(false);
    }
  };

  const fetchPopular = async () => {
    setLoading(true);
    setError(null);

    try {
      const params = new URLSearchParams();
      params.append('limit', limit.toString());
      if (mealType) params.append('mealType', mealType);
      if (categoryId) params.append('categoryId', categoryId.toString());

      const response = await customerBackend.get(
        `/recommendations/popular?${params.toString()}`
      );

      setRecommendations(response.data.recommendations);
    } catch (err) {
      console.error('Error fetching popular dishes:', err);
      setError('Failed to load popular dishes');
    } finally {
      setLoading(false);
    }
  };

  const recordFeedback = async (dishId: number, feedbackType: string, rating?: number) => {
    if (!customerId) return;

    try {
      await customerBackend.post('/recommendations/feedback', {
        customerId,
        dishId,
        feedbackType,
        rating
      });
    } catch (err) {
      console.error('Error recording feedback:', err);
    }
  };

  useEffect(() => {
    if (customerId) {
      fetchRecommendations();
    } else {
      fetchPopular();
    }
  }, [customerId, mealType, categoryId, limit]);

  return {
    recommendations,
    loading,
    error,
    refetch: customerId ? fetchRecommendations : fetchPopular,
    recordFeedback
  };
};