import { StaffRole } from "@/enums/staff-role";
import { Close } from "@mui/icons-material";
import {
  FormControl,
  IconButton,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
  Typography,
} from "@mui/material";
import type { Dispatch, FC, SetStateAction } from "react";

export const FilterBar: FC<{
  roleFilter: string[];
  setRoleFilter: Dispatch<SetStateAction<string[]>>;
  searchFilter: string;
  setSearchFilter: Dispatch<SetStateAction<string>>;
}> = ({ roleFilter, setRoleFilter, searchFilter, setSearchFilter }) => {
  return (
    <Stack
      direction={{ xs: "column", sm: "row" }}
      spacing={{ xs: 1, sm: 4 }}
      mb={4}
    >
      <Stack>
        <Typography variant="overline">Filter by Role</Typography>
        <Stack
          width={{ xs: "100%", sm: "auto" }}
          direction="row"
          spacing={1}
          flexShrink={0}
        >
          <FormControl sx={{ minWidth: 150 }} size="small" margin="none">
            <InputLabel id="role-filter-select-label">Select Roles</InputLabel>
            <Select
              multiple
              labelId="role-filter-select-label"
              label="Select Roles"
              value={roleFilter}
              onChange={(e) => setRoleFilter(e.target.value as string[])}
            >
              <MenuItem value={StaffRole.Waiter}>Waiter</MenuItem>
              <MenuItem value={StaffRole.Cashier}>Cashier</MenuItem>
              <MenuItem value={StaffRole.KitchenManager}>
                Kitchen Manager
              </MenuItem>
              <MenuItem value={StaffRole.Admin}>Admin</MenuItem>
            </Select>
          </FormControl>
          {roleFilter.length ? (
            <IconButton disableRipple onClick={() => setRoleFilter([])}>
              <Close fontSize="small" />
            </IconButton>
          ) : (
            ""
          )}
        </Stack>
      </Stack>
      <Stack>
        <Typography variant="overline">Search Staff</Typography>
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
