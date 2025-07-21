import { getBackendErrorMessage } from "@/backend";
import { DiningAreasService } from "@/services/staff/dining-areas";
import { Close } from "@mui/icons-material";
import {
  Alert,
  CircularProgress,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import type { Dispatch, FC, SetStateAction } from "react";

export const FilterBar: FC<{
  diningAreaFilter: string;
  setDiningAreaFilter: Dispatch<SetStateAction<string>>;
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>;
}> = ({
  diningAreaFilter,
  setDiningAreaFilter,
  searchFilter,
  setSearchFilter,
}) => {
  const {
    data: diningAreas,
    isPending,
    error,
  } = useQuery({
    queryKey: ["admin_diningTables_filterBar"],
    queryFn: () => DiningAreasService.getAll(),
  });
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 4 }}
      alignItems={{ xs: "start", sm: "center" }}
      mb={4}
    >
      {isPending ? (
        <CircularProgress size={20} />
      ) : error ? (
        <Alert sx={{ maxWidth: { xs: "auto", sm: 300 } }} severity="error">
          Failed to dining areas list: {getBackendErrorMessage(error)}
        </Alert>
      ) : (
        <Stack>
          <Typography variant="overline">Filter by Dining Area</Typography>
          <Stack
            width={{ xs: "100%", sm: "auto" }}
            direction="row"
            spacing={1}
            flexShrink={0}
          >
            <FormControl sx={{ minWidth: 200 }} size="small" margin="none">
              <InputLabel id="da-filter-select-label">
                Select Dining Area
              </InputLabel>
              <Select
                labelId="da-filter-select-label"
                label="Select Dining Area"
                value={diningAreaFilter}
                onChange={(e) => setDiningAreaFilter(e.target.value)}
              >
                <MenuItem value="">
                  <em>All Dining Areas</em>
                </MenuItem>
                {diningAreas.map((da) => (
                  <MenuItem value={da.id} key={da.id}>
                    {da.name}
                  </MenuItem>
                ))}
              </Select>
            </FormControl>
            {diningAreaFilter ? (
              <IconButton disableRipple onClick={() => setDiningAreaFilter("")}>
                <Close fontSize="small" />
              </IconButton>
            ) : (
              ""
            )}
          </Stack>
        </Stack>
      )}
      <Stack>
        <Typography variant="overline">Search dining Tables</Typography>
        <Stack
          width={{ xs: "100%", sm: "auto" }}
          direction="row"
          spacing={1}
          flexShrink={0}
        >
          <TextField
            placeholder="Type a name..."
            size="small"
            value={searchFilter}
            onChange={(e) => setSearchFilter(e.target.value)}
          />

          {searchFilter.trim().length ? (
            <IconButton disableRipple onClick={() => setSearchFilter("")}>
              <Close fontSize="small" />
            </IconButton>
          ) : (
            ""
          )}
        </Stack>
      </Stack>
    </Stack>
  );
};
