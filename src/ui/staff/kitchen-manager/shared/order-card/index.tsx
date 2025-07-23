import {
  Card,
  CardHeader,
  CardContent,
  CardActions,
  Avatar,
  Typography,
  Button,
  List,
  ListItem,
  Box,
} from "@mui/material";
import type { FC } from "react";

type OrderItem = {
  name: string;
  quantity: number;
};

type Order = {
  id: string;
  orderCode: string;
  customerName: string;
  createdAt: string;
  tableNumber: number;
  note?: string;
  items: OrderItem[];
};

interface OrderCardProps {
  order: Order;
}

export const OrderCard: FC<OrderCardProps> = ({ order }) => {
  return (
    <Card sx={{ color: "black", borderRadius: 2, boxShadow: 4 }}>
      <CardHeader
        avatar={
          <Avatar
            src="/images/dummy/profile.jpg"
            sx={{ width: 40, height: 40, border: "2px solid #ccc" }}
          />
        }
        title={<Typography variant="subtitle1">{order.orderCode}</Typography>}
        subheader={
          <Typography variant="caption">{order.customerName}</Typography>
        }
      />

      <CardContent>
        <Box display="flex" justifyContent="space-around" mb={1} gap={2}>
          <Typography variant="body2" sx={pillStyle}>
            Table #{order.tableNumber}
          </Typography>
          <Typography variant="body2" sx={pillStyle}>
            {new Date(order.createdAt).toLocaleTimeString([], {
              hour: "2-digit",
              minute: "2-digit",
            })}
          </Typography>
        </Box>

        <List disablePadding>
          {order.items.map((item, index) => (
            <ListItem sx={{ py: 0.5 }} key={index}>
              <Box display="flex" justifyContent="space-between" width="100%">
                <Typography>{item.quantity}x</Typography>
                <Typography>{item.name}</Typography>
              </Box>
            </ListItem>
          ))}
        </List>

        {order.note && (
          <Typography variant="body2" fontStyle="italic" mt={2}>
            <strong>Note:</strong> {order.note}
          </Typography>
        )}
      </CardContent>

      <CardActions>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          sx={{ borderRadius: 2, background: "teal" }}
        >
          Order Details ↗
        </Button>
      </CardActions>
    </Card>
  );
};

const pillStyle = {
  backgroundColor: "rgba(0, 0, 0, 0.1)",
  borderRadius: "1rem",
  px: 2,
  py: 0.5,
};
