
import {
    Box,
    Typography,
} from "@mui/material";
import { type FC } from "react";
import { PageLayout } from "../../shared/page-layout";
import { RatingCard } from "./rating-card";
import { sampleFeedbacks } from "./sample-data";

export const Waiter_CustomerFeedbacksPage: FC = () => {
  return (
    <PageLayout 
      title="Customer's Feedback" 
      subtitle="View feedback from customers about your service"
    >
      <Box>
        {/* Feedback Cards */}
        <Box>
          {sampleFeedbacks.length === 0 ? (
            <Box textAlign="center" py={4}>
              <Typography variant="h6" color="text.secondary" gutterBottom>
                No feedbacks match your current filters
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Try adjusting your search criteria
              </Typography>
            </Box>
          ) : (
            <Box
              sx={{
                display: "grid",
                gridTemplateColumns: {
                  xs: "1fr",
                  sm: "repeat(2, 1fr)",
                  lg: "repeat(3, 1fr)",
                  xl: "repeat(4, 1fr)",
                },
                gap: { xs: 2, sm: 3 },
                alignItems: "stretch", // Ensure all cards have equal height
              }}
            >
              {sampleFeedbacks.map((feedback) => (
                <RatingCard 
                  key={feedback.id}
                  feedback={feedback} 
                />
              ))}
            </Box>
          )}
        </Box>
      </Box>
    </PageLayout>
  );
};

