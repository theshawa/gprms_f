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

// type OrderItem = {
//   name: string;
//   quantity: number;
// };

// type Order = {
//   orderCode: string;
//   customerName: string;
//   createdAt: string;
//   tableNumber: number;
//   note?: string;
//   items: OrderItem[];
// };

export const OrderCard: FC = () => {
  return (
    <Card sx={{ color: "black", borderRadius: 2, boxShadow: 4 }}>
      <CardHeader
        avatar={
          <Avatar
            src="/images/dummy/profile.jpg"
            sx={{ width: 40, height: 40, border: "2px solid #ccc" }}
          />
        }
        title={<Typography variant="subtitle1">Order #1</Typography>}
        subheader={<Typography variant="caption">John Doe</Typography>}
      />

      <CardContent>
        {/* Order Info */}
        <Box
          display="flex"
          justifyContent="space-around"
          mb={1}
          className="details"
        >
          <Typography variant="body2" sx={pillStyle}>
            Table #12
          </Typography>
          <Typography variant="body2" sx={pillStyle}>
            10:45AM
          </Typography>
        </Box>

        {/* Order Items */}
        <List disablePadding>
          {/* {order.items.map((item, index) => ( */}
          <ListItem sx={{ py: 0.5 }}>
            <Box
              display="flex"
              justifyContent="space-between"
              width="100%"
              gap={4}
              className="order-item"
            >
              <Typography>2x</Typography>
              <Typography>Pizza</Typography>
            </Box>
          </ListItem>
          {/* ))} */}
        </List>

        {/* Note */}
        {/* {order.note && ( */}
        <Typography variant="body2" fontStyle="italic" mt={2} className="note">
          <strong>Note:</strong> extra cheese
        </Typography>
        {/* )} */}
      </CardContent>

      {/* Actions */}
      <CardActions>
        <Button
          fullWidth
          variant="contained"
          color="secondary"
          //   onClick={() => onOpenDetails?.(order)}
          sx={{ borderRadius: 2 }}
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
