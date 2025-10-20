import React from 'react';
import { 
  Container, 
  Typography, 
  Card, 
  CardContent, 
  Button, 
  Alert,
  Box,
  Chip
} from '@mui/material';
import { RestaurantMenu, TableBar } from '@mui/icons-material';

export const DineInTestPage: React.FC = () => {
  const testTables = [
    { id: 1, name: 'Table 1', capacity: 4 },
    { id: 2, name: 'Table 2', capacity: 6 },
    { id: 3, name: 'Table 3', capacity: 2 },
    { id: 4, name: 'Table 4', capacity: 8 },
    { id: 5, name: 'Table 5', capacity: 4 },
  ];

  const handleStartDineIn = (tableId: number) => {
    // Navigate to the new dine-in route structure
    window.location.href = `/dine-in/${tableId}`;
  };

  return (
    <Container maxWidth="lg" sx={{ py: 4 }}>
      <Typography variant="h3" component="h1" gutterBottom align="center">
        🍽️ Dine-In Process - New Route Structure
      </Typography>
      
      <Alert severity="info" sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          New Dine-In Routes:
        </Typography>
        <Box component="ul" sx={{ m: 0 }}>
          <li><code>/dine-in/:tableId</code> → Main menu page</li>
          <li><code>/dine-in/:tableId/menu</code> → Explicit menu access</li>
          <li><code>/dine-in/:tableId/dish/:dishId</code> → Dish details</li>
          <li><code>/dine-in/:tableId/confirm-order</code> → Order confirmation</li>
          <li><code>/dine-in/:tableId/order-status</code> → Current order status</li>
          <li><code>/dine-in/:tableId/orders/:orderCode/status</code> → Specific order tracking</li>
        </Box>
      </Alert>

      <Typography variant="h4" component="h2" gutterBottom sx={{ mt: 4 }}>
        Available Tables for Testing
      </Typography>

      <Box sx={{ display: 'grid', gridTemplateColumns: 'repeat(auto-fit, minmax(300px, 1fr))', gap: 3 }}>
        {testTables.map((table) => (
          <Card key={table.id}>
              <CardContent>
                <Box display="flex" alignItems="center" gap={1} mb={2}>
                  <TableBar color="primary" />
                  <Typography variant="h5" component="h3">
                    {table.name}
                  </Typography>
                </Box>
                <Typography color="text.secondary" gutterBottom>
                  Capacity: {table.capacity} people
                </Typography>
                <Chip label={`Table ID: ${table.id}`} size="small" sx={{ mb: 2 }} />
                <Box>
                  <Button
                    variant="contained"
                    color="primary"
                    startIcon={<RestaurantMenu />}
                    fullWidth
                    onClick={() => handleStartDineIn(table.id)}
                    sx={{ mb: 1 }}
                  >
                    Start Dine-In Process
                  </Button>
                  <Typography variant="caption" display="block">
                    Will navigate to: <code>/dine-in/{table.id}</code>
                  </Typography>
                </Box>
              </CardContent>
            </Card>
        ))}
      </Box>

      <Alert severity="success" sx={{ mt: 4 }}>
        <Typography variant="h6" gutterBottom>
          ✅ What's Working:
        </Typography>
        <Box component="ul" sx={{ m: 0 }}>
          <li>New routing structure with proper table-based URLs</li>
          <li>Enhanced service layer with backend-ready endpoints</li>
          <li>Real-time WebSocket integration for order updates</li>
          <li>Waiter assignment system (frontend ready)</li>
          <li>Comprehensive order and session management</li>
          <li>All existing dine-in functionality preserved</li>
        </Box>
      </Alert>

      <Alert severity="warning" sx={{ mt: 2 }}>
        <Typography variant="h6" gutterBottom>
          ⚠️ Backend Requirements:
        </Typography>
        <Typography>
          The new service endpoints need to be implemented in the backend. 
          Until then, you may see errors when trying to initialize a dine-in session.
          Check the console for detailed error messages.
        </Typography>
      </Alert>

      <Box sx={{ mt: 4, p: 3, bgcolor: 'grey.50', borderRadius: 2 }}>
        <Typography variant="h6" gutterBottom>
          🧪 Testing Instructions:
        </Typography>
        <Typography component="div">
          1. Click on any table above to start the dine-in process<br />
          2. You'll be redirected to <code>/dine-in/:tableId</code><br />
          3. The system will try to initialize the session using the new service<br />
          4. If backend endpoints are not ready, you'll see a friendly error message<br />
          5. The routing structure and UI components are fully working
        </Typography>
      </Box>
    </Container>
  );
};
