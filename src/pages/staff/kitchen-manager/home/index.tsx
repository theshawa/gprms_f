import {
  Box,
  Card,
  CardContent,
  CardHeader,
  Typography,
  Chip,
  Select,
  MenuItem,
  FormControl,
  InputLabel,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Button,
  SvgIcon,
} from "@mui/material";
import { Star, Timer, ShoppingBag, Search } from "@mui/icons-material";
import { useState } from "react";
import type { FC } from "react";
import "./index.css";

// Dummy data
const lowStockIngredients = [
  { name: "Cheese", currentStock: 5, minRequired: 10, unit: "kg" },
  { name: "Tomatoes", currentStock: 12, minRequired: 8, unit: "kg" },
];

const orders = [
  {
    id: 1,
    item: "Pizza",
    icon: <Search />,
    address: "Colombo",
    status: "Active",
    statusClass: "active",
    time: "8:00 PM",
  },
];

export const KitchenManagerHomePage: FC = () => {
  const [stockFilter, setStockFilter] = useState("all");

  const handleRequestMore = (item: any) => {
    console.log("Requesting more of:", item.name);
  };

  return (
    <Box className="dashboard-container" p={3}>
      {/* Header */}
      <Box mb={3}>
        <Typography variant="h4">Dashboard</Typography>
      </Box>

      {/* Stats Cards */}
      <Box display="flex" gap={2} mb={3}>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Star color="primary" sx={{ fontSize: 40, mr: 2 }} />
            <Box>
              <Typography variant="h5">4.5</Typography>
              <Typography variant="subtitle2">Average Ratings</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <Timer sx={{ fontSize: 40, color: "#9c27b0", mr: 2 }} />
            <Box>
              <Typography variant="h5">14</Typography>
              <Typography variant="subtitle2">Late Orders</Typography>
            </Box>
          </CardContent>
        </Card>
        <Card sx={{ flex: 1 }}>
          <CardContent sx={{ display: "flex", alignItems: "center" }}>
            <ShoppingBag sx={{ fontSize: 40, color: "#009688", mr: 2 }} />
            <Box>
              <Typography variant="h5">5,985</Typography>
              <Typography variant="subtitle2">
                Orders Delivered This Week
              </Typography>
            </Box>
          </CardContent>
        </Card>
      </Box>

      {/* Low Stock Ingredients */}
      <Card sx={{ mb: 3 }}>
        <CardHeader
          title="Low Stock Ingredients"
          subheader="These ingredients are running low"
          action={
            <FormControl size="small" sx={{ minWidth: 150 }}>
              <InputLabel>Filter</InputLabel>
              <Select
                value={stockFilter}
                label="Filter"
                onChange={(e) => setStockFilter(e.target.value)}
              >
                <MenuItem value="all">All</MenuItem>
                <MenuItem value="critical">Critical Only</MenuItem>
              </Select>
            </FormControl>
          }
        />
        <CardContent>
          <TableContainer>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>Ingredient</TableCell>
                  <TableCell>Current Stock</TableCell>
                  <TableCell>Minimum Required</TableCell>
                  <TableCell>Status</TableCell>
                  <TableCell>Action</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {lowStockIngredients
                  .filter((item) =>
                    stockFilter === "critical"
                      ? item.currentStock < item.minRequired
                      : true
                  )
                  .map((item, index) => (
                    <TableRow key={index}>
                      <TableCell>{item.name}</TableCell>
                      <TableCell>
                        {item.currentStock} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.minRequired} {item.unit}
                      </TableCell>
                      <TableCell>
                        {item.currentStock < item.minRequired ? (
                          <Chip label="Low" color="error" />
                        ) : (
                          <Chip label="OK" color="success" />
                        )}
                      </TableCell>
                      <TableCell>
                        <Button
                          variant="outlined"
                          onClick={() => handleRequestMore(item)}
                        >
                          Request More
                        </Button>
                      </TableCell>
                    </TableRow>
                  ))}
              </TableBody>
            </Table>
          </TableContainer>
        </CardContent>
      </Card>

      <div className="orders">
        {/* Orders Pie Chart */}
        <Card sx={{ mb: 3 }}>
          <CardHeader title="Orders" />
          <CardContent>
            <Box display="flex" alignItems="center" gap={3}>
              <SvgIcon sx={{ fontSize: 200 }}>
                <svg viewBox="0 0 200 200">
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#e0e0e0"
                    strokeWidth="20"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#2196f3"
                    strokeWidth="20"
                    strokeDasharray="301.6 502.7"
                    strokeDashoffset="0"
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#9c27b0"
                    strokeWidth="20"
                    strokeDasharray="140.7 502.7"
                    strokeDashoffset="-301.6"
                    transform="rotate(-90 100 100)"
                  />
                  <circle
                    cx="100"
                    cy="100"
                    r="80"
                    fill="none"
                    stroke="#4caf50"
                    strokeWidth="20"
                    strokeDasharray="60.3 502.7"
                    strokeDashoffset="-442.3"
                    transform="rotate(-90 100 100)"
                  />
                  <text
                    x="100"
                    y="100"
                    textAnchor="middle"
                    dy="0.3em"
                    fontSize="24"
                  >
                    60%
                  </text>
                </svg>
              </SvgIcon>
              <Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Box
                    width={12}
                    height={12}
                    bgcolor="#2196f3"
                    borderRadius={1}
                  />
                  <Typography>Accepted</Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Box
                    width={12}
                    height={12}
                    bgcolor="#9c27b0"
                    borderRadius={1}
                  />
                  <Typography>Cancelled</Typography>
                </Box>
                <Box display="flex" gap={1} alignItems="center">
                  <Box
                    width={12}
                    height={12}
                    bgcolor="#4caf50"
                    borderRadius={1}
                  />
                  <Typography>Out of Stock</Typography>
                </Box>
              </Box>
            </Box>
          </CardContent>
        </Card>

        {/* Orders Table */}
        <Card>
          <CardHeader title="Order History" />
          <CardContent>
            <Table>
              <TableHead>
                <TableRow>
                  <TableCell>ORDER ID</TableCell>
                  <TableCell>ITEM</TableCell>
                  <TableCell>ADDRESS</TableCell>
                  <TableCell>STATUS</TableCell>
                  <TableCell>ESTIMATED DELIVERY TIME</TableCell>
                </TableRow>
              </TableHead>
              <TableBody>
                {orders.map((order) => (
                  <TableRow key={order.id}>
                    <TableCell>{order.id}</TableCell>
                    <TableCell>
                      <Box display="flex" alignItems="center" gap={1}>
                        <Search fontSize="small" />
                        {order.item}
                      </Box>
                    </TableCell>
                    <TableCell>{order.address}</TableCell>
                    <TableCell>
                      <Chip label={order.status} color="primary" />
                    </TableCell>
                    <TableCell>{order.time}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </Box>
  );
};
