import type { TakeAwayOrder } from "@/interfaces/take-away-order";
import { formatCurrency } from "@/utils/currency-format";
import {
  Button,
  Chip,
  Stack,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Typography,
} from "@mui/material";
import type { FC } from "react";

export const TakeAwayOrderPreview: FC<{ order: TakeAwayOrder; close: () => void }> = ({
  order,
  close,
}) => {
  const subTotal = order.items.reduce((pv, i) => pv + i.dish.price * i.quantity, 0);
  return (
    <Stack height={"100%"}>
      <Stack
        p={2}
        direction="row"
        alignItems={"center"}
        justifyContent={"space-between"}
        bgcolor={"background.paper"}
        borderBottom={1}
        borderColor={"divider"}
        position="sticky"
        top={0}
      >
        <Typography variant="h6" fontWeight={700}>
          Take Away Order #{order.id}
        </Typography>
        <Chip
          label={
            {
              New: "To be Accepted",
              Preparing: "Ready for Pickup",
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
      <TableContainer sx={{ flex: 1 }}>
        <Table aria-label="items table">
          <TableHead>
            <TableRow>
              <TableCell>Item</TableCell>
              <TableCell align="right">Total</TableCell>
            </TableRow>
          </TableHead>
          <TableBody>
            {order.items.map((item) => (
              <TableRow
                key={item.dish.id}
                sx={{ "&:last-child td, &:last-child th": { border: 0 } }}
              >
                <TableCell component="th" scope="row" sx={{ textTransform: "capitalize" }}>
                  {item.dish.name}
                </TableCell>
                <TableCell align="right">
                  {item.quantity} x {formatCurrency(item.priceAtOrder)} ={" "}
                  {formatCurrency(item.quantity * item.priceAtOrder)}
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </TableContainer>
      <Stack p={2} gap={2} bgcolor={"background.paper"} position="sticky" bottom={0}>
        <Typography variant="h6">Total Amount: {formatCurrency(subTotal)}</Typography>
        <Stack direction="row" gap={1}>
          <Button
            onClick={close}
            color="inherit"
            variant="contained"
            sx={{
              flex: 1,
            }}
          >
            Close
          </Button>
          <Button
            variant="contained"
            color="error"
            disabled={!["New", "Prepared"].includes(order.status)}
            sx={{
              flex: 1,
            }}
          >
            Cancel
          </Button>
          <Button
            variant="contained"
            disabled={!["Prepared"].includes(order.status)}
            sx={{
              flex: 1,
            }}
          >
            Complete
          </Button>
        </Stack>
      </Stack>
    </Stack>
  );
};
