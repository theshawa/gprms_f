import { ArrowBack } from '@mui/icons-material';
import { Box, Button, Card, CardContent, Typography } from '@mui/material';
import type { FC } from 'react';
import { useNavigate, useParams } from 'react-router-dom';

export const Waiter_TableDetailsPage: FC = () => {
  const { tableId } = useParams<{ tableId: string }>();
  const navigate = useNavigate();

  const handleBack = () => {
    navigate('/staff/waiter');
  };

  return (
    <Box className="p-4">
      <Box className="flex items-center gap-4 mb-6">
        <Button 
          startIcon={<ArrowBack />} 
          onClick={handleBack}
          variant="outlined"
        >
          Back to Tables
        </Button>
        <Typography variant="h4" className="text-teal-700">
          Table {tableId}
        </Typography>
      </Box>
      
      <Card>
        <CardContent>
          <Typography variant="h6" className="mb-4">
            Order Details
          </Typography>
          <Typography>
            Table {tableId} details will be shown here
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};