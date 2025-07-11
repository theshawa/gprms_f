import type { DiningTable } from "@/interfaces/dining-table";
import { Box, Chip, Grid, Stack, Typography } from "@mui/material";
import { type FC, useState } from "react";
import { TableCard } from "./table-card";

export const Waiter_HomePage: FC = () => {
  const [diningTables, setDiningTables] = useState<DiningTable[]>([]);

  return (
    <Box p={3}>
      <Stack direction={{ xs: "column", sm: "row" }} spacing={2}>
        <Typography variant="h5" flex={1}>
          Dining Table Status
        </Typography>
        <Stack direction="row" ml="auto" spacing={1}>
          <Chip color="success" label="5 Ongoing Orders" />
        </Stack>
      </Stack>
      <Grid
        columns={{ xs: 2, sm: 3, md: 4, lg: 5, xl: 6 }}
        container
        spacing={2}
        mt={5}
      >
        {diningTables.map((dt) => (
          <TableCard key={dt.id} diningTable={dt} />
        ))}
        {diningTables.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No tables assigned to you.
          </Typography>
        )}
      </Grid>
    </Box>
  );
};
