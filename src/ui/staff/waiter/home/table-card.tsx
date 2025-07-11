import type { DiningTable } from "@/interfaces/dining-table";
import {
  Card,
  CardActions,
  CardContent,
  Chip,
  Grid,
  Typography,
} from "@mui/material";
import { type FC, useState } from "react";

export const TableCard: FC<{ diningTable: DiningTable }> = ({
  diningTable,
}) => {
  const [ongoing, setOngoing] = useState(false);

  return (
    <Grid size={1}>
      <Card>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            {diningTable.name}
          </Typography>
          <Typography variant="body2" color="textSecondary">
            Area {diningTable.diningArea.name}
            <br />
            {diningTable.maxSeats} Seats
          </Typography>
        </CardContent>
        <CardActions>
          <Chip
            label={ongoing ? "Order Ongoing" : "Available"}
            size="small"
            color={ongoing ? "success" : "default"}
          />
        </CardActions>
      </Card>
    </Grid>
  );
};
