import type { TakeAwayOrder } from "@/interfaces/take-away-order";
import { formatCurrency } from "@/utils/currency-format";
import { formatDateTime } from "@/utils/time-format";
import { Box, Chip, Stack, Typography } from "@mui/material";
import type { FC } from "react";

export const TakeAwayOrderItem: FC<{
  isActive: boolean;
  setActive: () => void;
  order: TakeAwayOrder;
}> = ({ isActive, setActive, order }) => {
  return (
    <Box
      p={1}
      boxShadow={1}
      borderRadius={2}
      role="button"
      onClick={setActive}
      sx={{
        backgroundColor: isActive ? "primary.dark" : "primary.light",
        color: isActive ? "background.paper" : "black",
        cursor: "pointer",
      }}
    >
      <Stack direction={"row"} alignItems={"center"} gap={1}>
        <Typography variant="body1" sx={{ mb: 1.5, mr: "auto" }}>
          #{order.id}
        </Typography>
        <Chip
          label={
            {
              New: "To be Accepted",
              Preparing: "Preparing",
              Prepared: "Ready for Pickup",
              Completed: "Completed",
              Cancelled: "Cancelled",
            }[order.status]
          }
          sx={{
            textTransform: "uppercase",
            fontWeight: 500,
          }}
          size="small"
          color={
            order.status === "New"
              ? "info"
              : order.status === "Prepared"
              ? "success"
              : order.status === "Completed"
              ? "default"
              : "warning"
          }
        />
      </Stack>
      <Stack p={2}>
        <Typography variant="body2">
          {" "}
          Customer: {order.customerName}({order.customerPhone})
          <br />
          Total Amount of {formatCurrency(order.totalAmount)}
          <br /> Placed at {formatDateTime(order.createdAt)}
        </Typography>
      </Stack>
    </Box>
  );
};
