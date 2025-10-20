import React, { useState, useEffect } from 'react';
import {
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  TextField,
  Alert,
  Typography,
  Box,
  Chip,
  Stack
} from '@mui/material';
import { CustomerWaiterService, type WaiterInfo, type WaiterAssistanceRequest } from '@/services/customer/waiter';

interface WaiterAssistanceDialogProps {
  open: boolean;
  onClose: () => void;
  tableId: number;
}

export const WaiterAssistanceDialog: React.FC<WaiterAssistanceDialogProps> = ({
  open,
  onClose,
  tableId
}) => {
  const [assistanceType, setAssistanceType] = useState<WaiterAssistanceRequest['assistanceType']>('call_waiter');
  const [priority, setPriority] = useState<WaiterAssistanceRequest['priority']>('medium');
  const [notes, setNotes] = useState('');
  const [loading, setLoading] = useState(false);
  const [success, setSuccess] = useState(false);
  const [assignedWaiter, setAssignedWaiter] = useState<WaiterInfo | null>(null);

  useEffect(() => {
    if (open) {
      fetchAssignedWaiter();
    }
  }, [open, tableId]);

  const fetchAssignedWaiter = async () => {
    try {
      const waiter = await CustomerWaiterService.getAssignedWaiter(tableId);
      setAssignedWaiter(waiter);
    } catch (error) {
      console.error('Failed to fetch assigned waiter:', error);
    }
  };

  const handleSubmit = async () => {
    setLoading(true);
    setSuccess(false);
    
    try {
      await CustomerWaiterService.requestWaiterAssistance(tableId, {
        assistanceType,
        priority,
        notes: notes || undefined
      });
      
      setSuccess(true);
      setTimeout(() => {
        onClose();
        setSuccess(false);
        setNotes('');
      }, 2000);
    } catch (error) {
      console.error('Failed to request waiter assistance:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleRequestWaiterAssignment = async () => {
    try {
      setLoading(true);
      await CustomerWaiterService.requestWaiterAssignment(tableId);
      // Refresh waiter info
      await fetchAssignedWaiter();
    } catch (error) {
      console.error('Failed to request waiter assignment:', error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onClose={onClose} maxWidth="sm" fullWidth>
      <DialogTitle>Waiter Assistance</DialogTitle>
      <DialogContent>
        {assignedWaiter ? (
          <Box mb={3}>
            <Typography variant="subtitle2" gutterBottom>
              Your Assigned Waiter:
            </Typography>
            <Stack direction="row" spacing={1} alignItems="center">
              <Typography variant="body1" fontWeight="bold">
                {assignedWaiter.name}
              </Typography>
              <Chip label={assignedWaiter.status} size="small" />
            </Stack>
          </Box>
        ) : (
          <Box mb={3}>
            <Alert severity="info" action={
              <Button onClick={handleRequestWaiterAssignment} disabled={loading}>
                Request Waiter
              </Button>
            }>
              No waiter assigned yet. Click to request automatic waiter assignment.
            </Alert>
          </Box>
        )}

        {success && (
          <Alert severity="success" sx={{ mb: 2 }}>
            Waiter assistance request sent successfully!
          </Alert>
        )}

        <FormControl fullWidth margin="normal">
          <InputLabel>Assistance Type</InputLabel>
          <Select
            value={assistanceType}
            onChange={(e) => setAssistanceType(e.target.value as WaiterAssistanceRequest['assistanceType'])}
            label="Assistance Type"
          >
            <MenuItem value="call_waiter">Call Waiter</MenuItem>
            <MenuItem value="request_bill">Request Bill</MenuItem>
            <MenuItem value="complaint">Complaint</MenuItem>
            <MenuItem value="help">General Help</MenuItem>
            <MenuItem value="order_assistance">Order Assistance</MenuItem>
          </Select>
        </FormControl>

        <FormControl fullWidth margin="normal">
          <InputLabel>Priority</InputLabel>
          <Select
            value={priority}
            onChange={(e) => setPriority(e.target.value as WaiterAssistanceRequest['priority'])}
            label="Priority"
          >
            <MenuItem value="low">Low</MenuItem>
            <MenuItem value="medium">Medium</MenuItem>
            <MenuItem value="high">High</MenuItem>
          </Select>
        </FormControl>

        <TextField
          fullWidth
          margin="normal"
          label="Additional Notes (Optional)"
          multiline
          rows={3}
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          placeholder="Describe what you need help with..."
        />
      </DialogContent>
      <DialogActions>
        <Button onClick={onClose} disabled={loading}>
          Cancel
        </Button>
        <Button 
          onClick={handleSubmit} 
          variant="contained" 
          disabled={loading || success}
        >
          {loading ? 'Sending...' : 'Request Assistance'}
        </Button>
      </DialogActions>
    </Dialog>
  );
};
