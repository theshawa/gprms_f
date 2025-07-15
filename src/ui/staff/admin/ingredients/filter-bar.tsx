import { Close } from "@mui/icons-material";
import {
  Chip,
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { FC } from "react";

export const FilterBar: FC<{
  stockLevelFilter: string;
  setStockLevelFilter: (v: string) => void;
  searchFilter: string;
  setSearchFilter: (v: string) => void;
}> = ({
  setStockLevelFilter,
  stockLevelFilter,
  searchFilter,
  setSearchFilter,
}) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 4 }}
      alignItems={{ xs: "start", sm: "center" }}
      mb={4}
    >
      <Stack>
        <Typography variant="overline">Filter by Stock Level</Typography>
        <Stack
          width={{ xs: "100%", sm: "auto" }}
          direction="row"
          spacing={1}
          flexShrink={0}
        >
          <FormControl sx={{ minWidth: 200 }} size="small" margin="none">
            <InputLabel id="da-filter-select-label">
              Select Stock Level
            </InputLabel>
            <Select
              label="Select Stock Level"
              value={stockLevelFilter}
              onChange={(e) => setStockLevelFilter(e.target.value)}
            >
              <MenuItem value="">
                <em>All Stock Levels</em>
              </MenuItem>
              <MenuItem value="out">
                <Chip
                  size="small"
                  color="error"
                  sx={{ textTransform: "uppercase" }}
                  label="Out of Stock"
                />
              </MenuItem>
              <MenuItem value="low">
                <Chip
                  size="small"
                  color="warning"
                  sx={{ textTransform: "uppercase" }}
                  label="Low Stock"
                />
              </MenuItem>
              <MenuItem value="in">
                <Chip
                  size="small"
                  color="success"
                  sx={{ textTransform: "uppercase" }}
                  label="In Stock"
                />
              </MenuItem>
            </Select>
          </FormControl>
          {stockLevelFilter ? (
            <IconButton disableRipple onClick={() => setStockLevelFilter("")}>
              <Close fontSize="small" />
            </IconButton>
          ) : (
            ""
          )}
        </Stack>
      </Stack>
      <Stack>
        <Typography variant="overline">Search ingredients</Typography>
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
