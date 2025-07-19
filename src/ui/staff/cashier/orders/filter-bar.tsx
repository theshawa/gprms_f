import {
    Box,
    Chip,
    FormControl,
    InputLabel,
    MenuItem,
    Select,
    Stack,
    TextField,
    Typography,
} from "@mui/material";
import type { FC } from "react";

interface FilterBarProps {
  month: string;
  setMonth: (value: string) => void;
  year: string;
  setYear: (value: string) => void;
  date: string;
  setDate: (value: string) => void;
  tableNumber: string;
  setTableNumber: (value: string) => void;
  hourRange: string;
  setHourRange: (value: string) => void;
  onClearFilters: () => void;
}

export const OrderFilterBar: FC<FilterBarProps> = ({
  month,
  setMonth,
  year,
  setYear,
  date,
  setDate,
  tableNumber,
  setTableNumber,
  hourRange,
  setHourRange,
  onClearFilters,
}) => {
  const months = [
    { value: "01", label: "January" },
    { value: "02", label: "February" },
    { value: "03", label: "March" },
    { value: "04", label: "April" },
    { value: "05", label: "May" },
    { value: "06", label: "June" },
    { value: "07", label: "July" },
    { value: "08", label: "August" },
    { value: "09", label: "September" },
    { value: "10", label: "October" },
    { value: "11", label: "November" },
    { value: "12", label: "December" },
  ];

  const years = ["2023", "2024", "2025", "2026"];

  const hourRanges = [
    "00:00 - 01:00", "01:00 - 02:00", "02:00 - 03:00", "03:00 - 04:00",
    "04:00 - 05:00", "05:00 - 06:00", "06:00 - 07:00", "07:00 - 08:00",
    "08:00 - 09:00", "09:00 - 10:00", "10:00 - 11:00", "11:00 - 12:00",
    "12:00 - 13:00", "13:00 - 14:00", "14:00 - 15:00", "15:00 - 16:00",
    "16:00 - 17:00", "17:00 - 18:00", "18:00 - 19:00", "19:00 - 20:00",
    "20:00 - 21:00", "21:00 - 22:00", "22:00 - 23:00", "23:00 - 24:00",
  ];

  const getActiveFiltersCount = () => {
    let count = 0;
    if (month) count++;
    if (year) count++;
    if (date) count++;
    if (tableNumber) count++;
    if (hourRange) count++;
    return count;
  };

  return (
    <Box sx={{ mb: 3 }}>
      <Box display="flex" justifyContent="space-between" alignItems="center" mb={2}>
        <Typography variant="h6">Filter & Sort Orders</Typography>
        {getActiveFiltersCount() > 0 && (
          <Stack direction="row" spacing={1} alignItems="center">
            <Chip 
              label={`${getActiveFiltersCount()} filter(s) active`} 
              size="small" 
              variant="outlined" 
            />
            <Chip 
              label="Clear All" 
              size="small" 
              variant="outlined" 
              onClick={onClearFilters}
              clickable
              color="error"
            />
          </Stack>
        )}
      </Box>

      <Box
        sx={{
          display: "grid",
          gridTemplateColumns: {
            xs: "1fr",
            sm: "repeat(2, 1fr)",
            md: "repeat(3, 1fr)",
            lg: "repeat(5, 1fr)",
          },
          gap: 2,
        }}
      >
        {/* Month Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Month</InputLabel>
          <Select
            value={month}
            label="Month"
            onChange={(e) => setMonth(e.target.value)}
          >
            <MenuItem value="">
              <em>All Months</em>
            </MenuItem>
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Year Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Year</InputLabel>
          <Select
            value={year}
            label="Year"
            onChange={(e) => setYear(e.target.value)}
          >
            <MenuItem value="">
              <em>All Years</em>
            </MenuItem>
            {years.map((y) => (
              <MenuItem key={y} value={y}>
                {y}
              </MenuItem>
            ))}
          </Select>
        </FormControl>

        {/* Date Filter */}
        <TextField
          size="small"
          label="Date"
          type="date"
          value={date}
          onChange={(e) => setDate(e.target.value)}
          InputLabelProps={{
            shrink: true,
          }}
          fullWidth
        />

        {/* Table Number Filter */}
        <TextField
          size="small"
          label="Table Number"
          value={tableNumber}
          onChange={(e) => setTableNumber(e.target.value)}
          placeholder="e.g., 005"
          fullWidth
        />

        {/* Hour Range Filter */}
        <FormControl size="small" fullWidth>
          <InputLabel>Hour Range</InputLabel>
          <Select
            value={hourRange}
            label="Hour Range"
            onChange={(e) => setHourRange(e.target.value)}
          >
            <MenuItem value="">
              <em>All Hours</em>
            </MenuItem>
            {hourRanges.map((range) => (
              <MenuItem key={range} value={range}>
                {range}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Box>
    </Box>
  );
};
