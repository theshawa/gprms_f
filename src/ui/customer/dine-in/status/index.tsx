import { Alert, AlertTitle, Typography } from "@mui/material";
import type { FC } from "react";

export const Customer_DineInStatusPage: FC = () => {
  return (
    <>
      <Typography variant="h4" gutterBottom mb={5}>
        Order Status
      </Typography>
      <Alert severity="info">
        <AlertTitle>Your order is being prepared.</AlertTitle>
        Please wait for the waiter to bring your order to the table.
      </Alert>
    </>
  );
};
