import {
  MenuBook,
  Add,
  Edit,
  Delete,
  Visibility,
  VisibilityOff,
  Restaurant,
  Fastfood,
  LocalDining,
  Coffee,
  Cake,
  Search,
  FilterList,
  Close,
  Star,
  TrendingUp,
  Schedule,
  CheckCircle,
  Cancel,
} from "@mui/icons-material";
import {
  Box,
  Card,
  CardContent,
  Typography,
  Grid,
  Chip,
  Stack,
  TextField,
  FormControl,
  InputLabel,
  Select,
  MenuItem,
  Button,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
  Paper,
  Avatar,
  IconButton,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Divider,
  Badge,
  LinearProgress,
  Tabs,
  Tab,
  Accordion,
  AccordionSummary,
  AccordionDetails,
} from "@mui/material";
import type { FC } from "react";
import { useState, useMemo } from "react";
import { PageLayout } from "../../shared/page-layout";

// Mock data for menus
const mockMenus = [
  {
    id: "MENU-001",
    name: "Breakfast Specials",
    description: "Start your day with our traditional Sri Lankan breakfast items",
    meal: "breakfast",
    status: "active",
    isActive: true,
    createdDate: "2024-01-15",
    itemCount: 12,
    avgPrice: 850,
    popularity: 85,
    sections: [
      {
        id: "SEC-001",
        name: "Traditional Breakfast",
        description: "Authentic Sri Lankan morning meals",
        items: [
          { id: "ITEM-001", name: "Hoppers (2 pcs)", price: 320, description: "Traditional bowl-shaped pancakes", isAvailable: true, category: "main" },
          { id: "ITEM-002", name: "String Hoppers", price: 280, description: "Steamed rice noodle nests", isAvailable: true, category: "main" },
          { id: "ITEM-003", name: "Roti with Curry", price: 450, description: "Flatbread with dhal curry", isAvailable: true, category: "main" },
          { id: "ITEM-004", name: "Coconut Sambol", price: 150, description: "Spicy coconut relish", isAvailable: true, category: "side" },
        ]
      },
      {
        id: "SEC-002",
        name: "Continental Options",
        description: "International breakfast choices",
        items: [
          { id: "ITEM-005", name: "English Breakfast", price: 1250, description: "Eggs, bacon, sausage, beans, toast", isAvailable: true, category: "main" },
          { id: "ITEM-006", name: "Pancakes Stack", price: 890, description: "Fluffy pancakes with syrup", isAvailable: true, category: "main" },
          { id: "ITEM-007", name: "Fresh Fruit Bowl", price: 650, description: "Seasonal tropical fruits", isAvailable: true, category: "healthy" },
        ]
      }
    ]
  },
  {
    id: "MENU-002",
    name: "Lunch Favorites",
    description: "Hearty midday meals featuring local and international cuisine",
    meal: "lunch",
    status: "active",
    isActive: true,
    createdDate: "2024-01-20",
    itemCount: 18,
    avgPrice: 1450,
    popularity: 92,
    sections: [
      {
        id: "SEC-003",
        name: "Rice & Curry",
        description: "Traditional Sri Lankan rice meals",
        items: [
          { id: "ITEM-008", name: "Fish Curry with Rice", price: 1850, description: "Fresh fish in spicy coconut curry", isAvailable: true, category: "main" },
          { id: "ITEM-009", name: "Chicken Curry with Rice", price: 1650, description: "Tender chicken in aromatic spices", isAvailable: true, category: "main" },
          { id: "ITEM-010", name: "Vegetable Curry with Rice", price: 1250, description: "Mixed vegetables in curry sauce", isAvailable: true, category: "vegetarian" },
          { id: "ITEM-011", name: "Dhal Curry", price: 450, description: "Lentil curry side dish", isAvailable: true, category: "side" },
        ]
      },
      {
        id: "SEC-004", 
        name: "International Mains",
        description: "Global cuisine favorites",
        items: [
          { id: "ITEM-012", name: "Grilled Salmon", price: 2850, description: "Atlantic salmon with vegetables", isAvailable: true, category: "seafood" },
          { id: "ITEM-013", name: "Beef Steak", price: 3200, description: "Premium beef with garlic mash", isAvailable: true, category: "meat" },
          { id: "ITEM-014", name: "Pasta Carbonara", price: 1950, description: "Creamy pasta with bacon", isAvailable: true, category: "pasta" },
        ]
      }
    ]
  },
  {
    id: "MENU-003",
    name: "Dinner Delights",
    description: "Elegant evening dining with premium selections",
    meal: "dinner",
    status: "active",
    isActive: true,
    createdDate: "2024-02-01",
    itemCount: 22,
    avgPrice: 2150,
    popularity: 88,
    sections: [
      {
        id: "SEC-005",
        name: "Seafood Specialties",
        description: "Fresh catches from the ocean",
        items: [
          { id: "ITEM-015", name: "Lobster Thermidor", price: 4500, description: "Grilled lobster with cheese sauce", isAvailable: true, category: "premium" },
          { id: "ITEM-016", name: "Crab Curry", price: 3200, description: "Sri Lankan style crab curry", isAvailable: true, category: "seafood" },
          { id: "ITEM-017", name: "Grilled Prawns", price: 2850, description: "Jumbo prawns with garlic butter", isAvailable: true, category: "seafood" },
        ]
      },
      {
        id: "SEC-006",
        name: "Meat & Poultry",
        description: "Premium cuts and preparations",
        items: [
          { id: "ITEM-018", name: "Lamb Chops", price: 3650, description: "Herb-crusted lamb with mint sauce", isAvailable: true, category: "meat" },
          { id: "ITEM-019", name: "Roast Chicken", price: 2450, description: "Whole roasted chicken with herbs", isAvailable: true, category: "poultry" },
          { id: "ITEM-020", name: "Pork Ribs", price: 2950, description: "BBQ glazed spare ribs", isAvailable: false, category: "meat" },
        ]
      }
    ]
  },
  {
    id: "MENU-004",
    name: "Beverages & Desserts",
    description: "Drinks and sweet treats to complete your meal",
    meal: "all_day",
    status: "active",
    isActive: true,
    createdDate: "2024-02-10",
    itemCount: 15,
    avgPrice: 650,
    popularity: 78,
    sections: [
      {
        id: "SEC-007",
        name: "Hot Beverages",
        description: "Coffee, tea, and hot drinks",
        items: [
          { id: "ITEM-021", name: "Ceylon Tea", price: 280, description: "Premium local black tea", isAvailable: true, category: "beverages" },
          { id: "ITEM-022", name: "Coffee Latte", price: 450, description: "Espresso with steamed milk", isAvailable: true, category: "beverages" },
          { id: "ITEM-023", name: "Hot Chocolate", price: 520, description: "Rich chocolate drink", isAvailable: true, category: "beverages" },
        ]
      },
      {
        id: "SEC-008",
        name: "Desserts",
        description: "Sweet endings to your meal",
        items: [
          { id: "ITEM-024", name: "Watalappan", price: 650, description: "Traditional coconut custard", isAvailable: true, category: "dessert" },
          { id: "ITEM-025", name: "Chocolate Cake", price: 850, description: "Rich chocolate layer cake", isAvailable: true, category: "dessert" },
          { id: "ITEM-026", name: "Ice Cream Sundae", price: 750, description: "Vanilla ice cream with toppings", isAvailable: true, category: "dessert" },
        ]
      }
    ]
  },
  {
    id: "MENU-005",
    name: "Kids Menu",
    description: "Child-friendly portions and flavors",
    meal: "all_day",
    status: "inactive",
    isActive: false,
    createdDate: "2024-03-01",
    itemCount: 8,
    avgPrice: 750,
    popularity: 65,
    sections: [
      {
        id: "SEC-009",
        name: "Kids Mains",
        description: "Small portions for little appetites",
        items: [
          { id: "ITEM-027", name: "Mini Burger", price: 850, description: "Small beef burger with fries", isAvailable: true, category: "main" },
          { id: "ITEM-028", name: "Chicken Nuggets", price: 750, description: "Crispy chicken pieces", isAvailable: true, category: "main" },
          { id: "ITEM-029", name: "Spaghetti Bolognese", price: 950, description: "Pasta with meat sauce", isAvailable: true, category: "pasta" },
        ]
      }
    ]
  }
];

const getMealIcon = (meal: string) => {
  switch (meal) {
    case "breakfast": return <Coffee />;
    case "lunch": return <Restaurant />;
    case "dinner": return <LocalDining />;
    case "all_day": return <Fastfood />;
    default: return <MenuBook />;
  }
};

const getStatusColor = (status: string) => {
  switch (status) {
    case "active": return "success";
    case "inactive": return "default";
    default: return "default";
  }
};

const formatCurrency = (amount: number) => {
  return `LKR ${amount.toLocaleString()}`;
};

const formatDate = (dateString: string) => {
  return new Date(dateString).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
};

export const Admin_MenusPage: FC = () => {
  const [searchTerm, setSearchTerm] = useState("");
  const [mealFilter, setMealFilter] = useState("all");
  const [statusFilter, setStatusFilter] = useState("all");
  const [selectedMenu, setSelectedMenu] = useState<any>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [newMenuOpen, setNewMenuOpen] = useState(false);
  const [activeTab, setActiveTab] = useState(0);

  const filteredMenus = useMemo(() => {
    return mockMenus.filter((menu) => {
      const matchesSearch = 
        menu.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
        menu.description.toLowerCase().includes(searchTerm.toLowerCase());
      
      const matchesMeal = mealFilter === "all" || menu.meal === mealFilter;
      const matchesStatus = statusFilter === "all" || menu.status === statusFilter;

      return matchesSearch && matchesMeal && matchesStatus;
    });
  }, [searchTerm, mealFilter, statusFilter]);

  const menuStats = useMemo(() => {
    const stats = {
      total: mockMenus.length,
      active: mockMenus.filter(m => m.status === "active").length,
      totalItems: mockMenus.reduce((sum, m) => sum + m.itemCount, 0),
      avgPrice: Math.round(mockMenus.reduce((sum, m) => sum + m.avgPrice, 0) / mockMenus.length),
      popularityScore: Math.round(mockMenus.reduce((sum, m) => sum + m.popularity, 0) / mockMenus.length),
    };
    return stats;
  }, []);

  const mealCounts = useMemo(() => {
    const counts: Record<string, number> = {};
    mockMenus.forEach(menu => {
      counts[menu.meal] = (counts[menu.meal] || 0) + 1;
    });
    return counts;
  }, []);

  const handleViewDetails = (menu: any) => {
    setSelectedMenu(menu);
    setDetailsOpen(true);
  };

  const handleToggleStatus = (menuId: string) => {
    console.log(`Toggling status for menu ${menuId}`);
  };

  const handleDeleteMenu = (menuId: string) => {
    console.log(`Deleting menu ${menuId}`);
  };

  const handleSetActiveForMeal = (menuId: string, meal: string) => {
    console.log(`Setting menu ${menuId} as active for ${meal}`);
  };

  return (
    <PageLayout
      title="Menu Management"
      subtitle="Create and manage restaurant menus with sections, items, and pricing"
      button={{
        text: "New Menu",
        icon: <Add />,
        onClick: () => setNewMenuOpen(true),
      }}
    >
      {/* Stats Overview */}
      <Grid container spacing={2} mb={3}>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="primary.main" fontWeight="bold">
                {menuStats.total}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Total Menus
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="success.main" fontWeight="bold">
                {menuStats.active}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Active Menus
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="warning.main" fontWeight="bold">
                {menuStats.totalItems}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Menu Items
              </Typography>
            </CardContent>
          </Card>
        </Grid>
        <Grid size={{ xs: 6, sm: 3 }}>
          <Card>
            <CardContent sx={{ textAlign: "center", py: 2 }}>
              <Typography variant="h4" color="info.main" fontWeight="bold">
                {formatCurrency(menuStats.avgPrice).replace('LKR ', '')}
              </Typography>
              <Typography variant="body2" color="text.secondary">
                Avg Item Price
              </Typography>
            </CardContent>
          </Card>
        </Grid>
      </Grid>

      {/* Meal Distribution */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Typography variant="h6" gutterBottom>
            Menu Distribution by Meal Type
          </Typography>
          <Grid container spacing={3}>
            {Object.entries(mealCounts).map(([meal, count]) => (
              <Grid size={{ xs: 6, sm: 4, md: 3 }} key={meal}>
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "primary.main" }}>
                    {getMealIcon(meal)}
                  </Avatar>
                  <Stack>
                    <Typography variant="h6" fontWeight="bold">
                      {count}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {meal.replace('_', ' ').charAt(0).toUpperCase() + meal.replace('_', ' ').slice(1)}
                    </Typography>
                  </Stack>
                </Stack>
              </Grid>
            ))}
          </Grid>
        </CardContent>
      </Card>

      {/* Filters */}
      <Card sx={{ mb: 3 }}>
        <CardContent>
          <Grid container spacing={2} alignItems="center">
            <Grid size={{ xs: 12, sm: 6, md: 4 }}>
              <TextField
                fullWidth
                size="small"
                placeholder="Search menus..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                InputProps={{
                  startAdornment: <Search sx={{ mr: 1, color: "text.secondary" }} />,
                }}
              />
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Meal Type</InputLabel>
                <Select
                  value={mealFilter}
                  label="Meal Type"
                  onChange={(e) => setMealFilter(e.target.value)}
                >
                  <MenuItem value="all">All Meals</MenuItem>
                  <MenuItem value="breakfast">Breakfast</MenuItem>
                  <MenuItem value="lunch">Lunch</MenuItem>
                  <MenuItem value="dinner">Dinner</MenuItem>
                  <MenuItem value="all_day">All Day</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, sm: 6, md: 3 }}>
              <FormControl fullWidth size="small">
                <InputLabel>Status</InputLabel>
                <Select
                  value={statusFilter}
                  label="Status"
                  onChange={(e) => setStatusFilter(e.target.value)}
                >
                  <MenuItem value="all">All Status</MenuItem>
                  <MenuItem value="active">Active</MenuItem>
                  <MenuItem value="inactive">Inactive</MenuItem>
                </Select>
              </FormControl>
            </Grid>
            <Grid size={{ xs: 12, md: 2 }}>
              <Button
                fullWidth
                variant="outlined"
                startIcon={<FilterList />}
                onClick={() => {
                  setSearchTerm("");
                  setMealFilter("all");
                  setStatusFilter("all");
                }}
              >
                Reset
              </Button>
            </Grid>
          </Grid>
        </CardContent>
      </Card>

      {/* Menus Grid */}
      <Grid container spacing={3}>
        {filteredMenus.map((menu) => (
          <Grid size={{ xs: 12, sm: 6, lg: 4 }} key={menu.id}>
            <Card 
              sx={{ 
                height: "100%", 
                cursor: "pointer",
                transition: "transform 0.2s, box-shadow 0.2s",
                "&:hover": {
                  transform: "translateY(-2px)",
                  boxShadow: 4,
                }
              }}
              onClick={() => handleViewDetails(menu)}
            >
              <CardContent>
                {/* Header */}
                <Stack direction="row" justifyContent="space-between" alignItems="start" mb={2}>
                  <Stack direction="row" alignItems="center" spacing={1}>
                    <Avatar sx={{ bgcolor: "primary.main", width: 40, height: 40 }}>
                      {getMealIcon(menu.meal)}
                    </Avatar>
                    <Stack>
                      <Typography variant="h6" fontWeight="bold">
                        {menu.name}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        {menu.meal.replace('_', ' ').charAt(0).toUpperCase() + menu.meal.replace('_', ' ').slice(1)}
                      </Typography>
                    </Stack>
                  </Stack>
                  <Chip
                    label={menu.status.charAt(0).toUpperCase() + menu.status.slice(1)}
                    color={getStatusColor(menu.status)}
                    size="small"
                  />
                </Stack>

                {/* Description */}
                <Typography variant="body2" color="text.secondary" mb={2}>
                  {menu.description}
                </Typography>

                {/* Menu Stats */}
                <Grid container spacing={2} mb={2}>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography variant="h6" color="primary.main" fontWeight="bold">
                        {menu.itemCount}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Items
                      </Typography>
                    </Stack>
                  </Grid>
                  <Grid size={6}>
                    <Stack alignItems="center">
                      <Typography variant="h6" color="success.main" fontWeight="bold">
                        {formatCurrency(menu.avgPrice).replace('LKR ', '')}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">
                        Avg Price
                      </Typography>
                    </Stack>
                  </Grid>
                </Grid>

                {/* Popularity */}
                <Stack spacing={1} mb={2}>
                  <Stack direction="row" justifyContent="space-between" alignItems="center">
                    <Typography variant="body2" color="text.secondary">
                      Popularity
                    </Typography>
                    <Typography variant="body2" fontWeight="medium">
                      {menu.popularity}%
                    </Typography>
                  </Stack>
                  <LinearProgress 
                    variant="determinate" 
                    value={menu.popularity} 
                    sx={{ height: 6, borderRadius: 3 }}
                    color={menu.popularity > 80 ? "success" : menu.popularity > 60 ? "warning" : "error"}
                  />
                </Stack>

                {/* Meta Info */}
                <Stack direction="row" justifyContent="space-between" alignItems="center" mb={2}>
                  <Typography variant="caption" color="text.secondary">
                    Created: {formatDate(menu.createdDate)}
                  </Typography>
                  {menu.isActive && (
                    <Chip label="Live" color="success" size="small" />
                  )}
                </Stack>

                {/* Actions */}
                <Stack direction="row" spacing={1} onClick={(e) => e.stopPropagation()}>
                  <Button
                    size="small"
                    variant="outlined"
                    startIcon={<Edit />}
                    sx={{ flex: 1 }}
                    onClick={() => handleViewDetails(menu)}
                  >
                    Edit
                  </Button>
                  {menu.status === "active" ? (
                    <Button
                      size="small"
                      variant="outlined"
                      color="warning"
                      startIcon={<VisibilityOff />}
                      onClick={() => handleToggleStatus(menu.id)}
                    >
                      Disable
                    </Button>
                  ) : (
                    <Button
                      size="small"
                      variant="outlined"
                      color="success"
                      startIcon={<Visibility />}
                      onClick={() => handleToggleStatus(menu.id)}
                    >
                      Enable
                    </Button>
                  )}
                  <IconButton
                    size="small"
                    color="error"
                    onClick={() => handleDeleteMenu(menu.id)}
                  >
                    <Delete />
                  </IconButton>
                </Stack>
              </CardContent>
            </Card>
          </Grid>
        ))}
        
        {filteredMenus.length === 0 && (
          <Grid size={12}>
            <Card>
              <CardContent sx={{ textAlign: "center", py: 6 }}>
                <MenuBook sx={{ fontSize: 64, color: "text.secondary", mb: 2 }} />
                <Typography variant="h6" color="text.secondary" gutterBottom>
                  No menus found
                </Typography>
                <Typography variant="body2" color="text.secondary" mb={3}>
                  Create your first menu to get started
                </Typography>
                <Button 
                  variant="contained" 
                  startIcon={<Add />}
                  onClick={() => setNewMenuOpen(true)}
                >
                  Create Menu
                </Button>
              </CardContent>
            </Card>
          </Grid>
        )}
      </Grid>

      {/* Menu Details Dialog */}
      <Dialog 
        open={detailsOpen} 
        onClose={() => setDetailsOpen(false)}
        maxWidth="lg"
        fullWidth
      >
        {selectedMenu && (
          <>
            <DialogTitle>
              <Stack direction="row" justifyContent="space-between" alignItems="center">
                <Stack direction="row" alignItems="center" spacing={2}>
                  <Avatar sx={{ bgcolor: "primary.main", width: 48, height: 48 }}>
                    {getMealIcon(selectedMenu.meal)}
                  </Avatar>
                  <Stack>
                    <Typography variant="h6">
                      {selectedMenu.name}
                    </Typography>
                    <Typography variant="body2" color="text.secondary">
                      {selectedMenu.meal.replace('_', ' ').charAt(0).toUpperCase() + selectedMenu.meal.replace('_', ' ').slice(1)} Menu
                    </Typography>
                  </Stack>
                </Stack>
                <IconButton onClick={() => setDetailsOpen(false)}>
                  <Close />
                </IconButton>
              </Stack>
            </DialogTitle>
            <DialogContent>
              {/* Tabs */}
              <Tabs value={activeTab} onChange={(_, newValue) => setActiveTab(newValue)} sx={{ mb: 3 }}>
                <Tab label="Menu Items" />
                <Tab label="Menu Settings" />
                <Tab label="Performance" />
              </Tabs>

              {/* Menu Items Tab */}
              {activeTab === 0 && (
                <Stack spacing={3}>
                  <Typography variant="h6" gutterBottom>
                    Menu Sections & Items
                  </Typography>
                  {selectedMenu.sections.map((section: any) => (
                    <Accordion key={section.id} defaultExpanded>
                      <AccordionSummary expandIcon={<Fastfood />}>
                        <Stack direction="row" justifyContent="space-between" alignItems="center" width="100%">
                          <Stack>
                            <Typography variant="subtitle1" fontWeight="bold">
                              {section.name}
                            </Typography>
                            <Typography variant="body2" color="text.secondary">
                              {section.description}
                            </Typography>
                          </Stack>
                          <Chip 
                            label={`${section.items.length} items`} 
                            size="small" 
                            color="primary"
                            sx={{ mr: 2 }}
                          />
                        </Stack>
                      </AccordionSummary>
                      <AccordionDetails>
                        <TableContainer>
                          <Table size="small">
                            <TableHead>
                              <TableRow>
                                <TableCell>Item Name</TableCell>
                                <TableCell>Description</TableCell>
                                <TableCell>Price</TableCell>
                                <TableCell>Category</TableCell>
                                <TableCell>Status</TableCell>
                              </TableRow>
                            </TableHead>
                            <TableBody>
                              {section.items.map((item: any) => (
                                <TableRow key={item.id}>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium">
                                      {item.name}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" color="text.secondary">
                                      {item.description}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Typography variant="body2" fontWeight="medium" color="success.main">
                                      {formatCurrency(item.price)}
                                    </Typography>
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={item.category}
                                      size="small"
                                      variant="outlined"
                                    />
                                  </TableCell>
                                  <TableCell>
                                    <Chip
                                      label={item.isAvailable ? "Available" : "Unavailable"}
                                      color={item.isAvailable ? "success" : "error"}
                                      size="small"
                                    />
                                  </TableCell>
                                </TableRow>
                              ))}
                            </TableBody>
                          </Table>
                        </TableContainer>
                      </AccordionDetails>
                    </Accordion>
                  ))}
                </Stack>
              )}

              {/* Menu Settings Tab */}
              {activeTab === 1 && (
                <Grid container spacing={3}>
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Basic Information
                        </Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Menu ID:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedMenu.id}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Name:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedMenu.name}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Meal Type:
                            </Typography>
                            <Chip
                              label={selectedMenu.meal.replace('_', ' ').charAt(0).toUpperCase() + selectedMenu.meal.replace('_', ' ').slice(1)}
                              size="small"
                              color="primary"
                            />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Status:
                            </Typography>
                            <Chip
                              label={selectedMenu.status.charAt(0).toUpperCase() + selectedMenu.status.slice(1)}
                              color={getStatusColor(selectedMenu.status)}
                              size="small"
                            />
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Created:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {formatDate(selectedMenu.createdDate)}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={6}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Menu Statistics
                        </Typography>
                        <Stack spacing={2}>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Total Items:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedMenu.itemCount}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Average Price:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium" color="success.main">
                              {formatCurrency(selectedMenu.avgPrice)}
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Popularity Score:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedMenu.popularity}%
                            </Typography>
                          </Stack>
                          <Stack direction="row" justifyContent="space-between">
                            <Typography variant="body2" color="text.secondary">
                              Sections:
                            </Typography>
                            <Typography variant="body2" fontWeight="medium">
                              {selectedMenu.sections.length}
                            </Typography>
                          </Stack>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="subtitle1" gutterBottom>
                          Description
                        </Typography>
                        <Typography variant="body1">
                          {selectedMenu.description}
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}

              {/* Performance Tab */}
              {activeTab === 2 && (
                <Grid container spacing={3}>
                  <Grid size={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="primary.main" fontWeight="bold">
                          {selectedMenu.popularity}%
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Popularity Score
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="success.main" fontWeight="bold">
                          {formatCurrency(selectedMenu.avgPrice).replace('LKR ', '')}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Average Item Price
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={4}>
                    <Card variant="outlined">
                      <CardContent sx={{ textAlign: "center" }}>
                        <Typography variant="h4" color="warning.main" fontWeight="bold">
                          {selectedMenu.itemCount}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">
                          Total Items
                        </Typography>
                      </CardContent>
                    </Card>
                  </Grid>
                  <Grid size={12}>
                    <Card variant="outlined">
                      <CardContent>
                        <Typography variant="h6" gutterBottom>
                          Performance Insights
                        </Typography>
                        <Stack spacing={2}>
                          <Typography variant="body2">
                            • This menu has a {selectedMenu.popularity > 80 ? "high" : selectedMenu.popularity > 60 ? "moderate" : "low"} popularity score
                          </Typography>
                          <Typography variant="body2">
                            • Average item price is {selectedMenu.avgPrice > 2000 ? "premium" : selectedMenu.avgPrice > 1000 ? "moderate" : "budget"} range
                          </Typography>
                          <Typography variant="body2">
                            • Menu contains {selectedMenu.itemCount} items across {selectedMenu.sections.length} sections
                          </Typography>
                          <Typography variant="body2">
                            • Status: Currently {selectedMenu.status === "active" ? "active and available" : "inactive"}
                          </Typography>
                        </Stack>
                      </CardContent>
                    </Card>
                  </Grid>
                </Grid>
              )}
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setDetailsOpen(false)}>
                Close
              </Button>
              <Button variant="outlined" startIcon={<Edit />}>
                Edit Menu
              </Button>
              {selectedMenu.status === "active" ? (
                <Button 
                  variant="outlined"
                  color="warning"
                  startIcon={<VisibilityOff />}
                  onClick={() => {
                    handleToggleStatus(selectedMenu.id);
                    setDetailsOpen(false);
                  }}
                >
                  Disable Menu
                </Button>
              ) : (
                <Button 
                  variant="contained"
                  color="success"
                  startIcon={<Visibility />}
                  onClick={() => {
                    handleToggleStatus(selectedMenu.id);
                    setDetailsOpen(false);
                  }}
                >
                  Enable Menu
                </Button>
              )}
              {!selectedMenu.isActive && (
                <Button 
                  variant="contained"
                  startIcon={<CheckCircle />}
                  onClick={() => handleSetActiveForMeal(selectedMenu.id, selectedMenu.meal)}
                >
                  Set as Active
                </Button>
              )}
            </DialogActions>
          </>
        )}
      </Dialog>

      {/* New Menu Dialog Placeholder */}
      <Dialog
        open={newMenuOpen}
        onClose={() => setNewMenuOpen(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle>
          <Stack direction="row" justifyContent="space-between" alignItems="center">
            <Typography variant="h6">
              Create New Menu
            </Typography>
            <IconButton onClick={() => setNewMenuOpen(false)}>
              <Close />
            </IconButton>
          </Stack>
        </DialogTitle>
        <DialogContent>
          <Typography variant="body2" color="text.secondary" sx={{ mb: 2 }}>
            Create new restaurant menus with the following features:
          </Typography>
          <Stack spacing={2}>
            <Typography variant="body2">• Menu name and description</Typography>
            <Typography variant="body2">• Meal type assignment (Breakfast, Lunch, Dinner, All Day)</Typography>
            <Typography variant="body2">• Menu sections organization</Typography>
            <Typography variant="body2">• Item management with pricing and descriptions</Typography>
            <Typography variant="body2">• Category assignments for filtering</Typography>
            <Typography variant="body2">• Availability status control</Typography>
            <Typography variant="body2">• Image upload for menu items</Typography>
            <Typography variant="body2">• Nutritional information and allergen warnings</Typography>
          </Stack>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setNewMenuOpen(false)}>
            Cancel
          </Button>
          <Button variant="contained">
            Create Menu
          </Button>
        </DialogActions>
      </Dialog>
    </PageLayout>
  );
};
