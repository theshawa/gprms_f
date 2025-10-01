import {
  Avatar,
  Badge,
  Box,
  Button,
  Chip,
  Dialog,
  DialogContent,
  DialogTitle,
  Divider,
  IconButton,
  InputAdornment,
  TextField,
  ToggleButton,
  ToggleButtonGroup,
  Typography,
} from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";
import TuneIcon from "@mui/icons-material/Tune";
import RemoveIcon from "@mui/icons-material/Remove";
import AddIcon from "@mui/icons-material/Add";
import DeleteIcon from "@mui/icons-material/Delete";
import FullscreenIcon from "@mui/icons-material/Fullscreen";
import MonetizationOnIcon from "@mui/icons-material/MonetizationOn";
import RestaurantIcon from "@mui/icons-material/Restaurant";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import LocalDiningIcon from "@mui/icons-material/LocalDining";
import EditIcon from "@mui/icons-material/Edit";
import SaveIcon from "@mui/icons-material/Save";
import type { FC } from "react";
import { useInvoices } from "../shared/invoice-context";
import type { CashierInvoice, InvoiceOrder } from "@/interfaces/cashier-invoice";
import { useState } from "react";
import { Fade, Grow } from "@mui/material";

// Mock data for ready-to-pay orders
const ALL_ORDERS = [
  { 
    id: "1902", 
    customer: "Saman Perera", 
    table: "Table 12", 
    items: 12, 
    total: 4850, 
    status: "ready_to_pay",
    orderType: "dine-in",
    orderItems: [
      { id: "p4", name: "Kottu Roti", price: 650, qty: 4, total: 2600 },
      { id: "p3", name: "Gotu Kola Salad", price: 380, qty: 6, total: 2280 },
      { id: "p2", name: "Chicken Curry", price: 850, qty: 2, total: 1700 },
    ]
  },
  { 
    id: "8991", 
    customer: "Nimal Silva", 
    table: "", 
    items: 4, 
    total: 1620, 
    status: "ready",
    orderType: "takeaway",
    orderItems: [
      { id: "p1", name: "Fish Cutlet", price: 450, qty: 2, total: 900 },
      { id: "p6", name: "Watalappan", price: 320, qty: 2, total: 640 },
      { id: "p8", name: "King Coconut", price: 200, qty: 4, total: 800 },
    ]
  },
  { 
    id: "1712", 
    customer: "Kamala Fernando", 
    table: "Table 10", 
    items: 6, 
    total: 2180, 
    status: "dining",
    orderType: "dine-in",
    orderItems: []
  },
  { 
    id: "8912", 
    customer: "Ruwan Jayasekara", 
    table: "", 
    items: 3, 
    total: 1450, 
    status: "preparing",
    orderType: "takeaway",
    orderItems: []
  },
  // Additional orders for the "View All" modal
  { 
    id: "2301", 
    customer: "Priyanka Wijesinghe", 
    table: "Table 15", 
    items: 8, 
    total: 2950, 
    status: "ready_to_pay",
    orderType: "dine-in",
    orderItems: [
      { id: "p7", name: "String Hoppers", price: 450, qty: 3, total: 1350 },
      { id: "p5", name: "Fish Ambul Thiyal", price: 780, qty: 2, total: 1560 },
    ]
  },
  { 
    id: "7743", 
    customer: "Lasantha Mendis", 
    table: "", 
    items: 5, 
    total: 2340, 
    status: "ready",
    orderType: "takeaway",
    orderItems: [
      { id: "p5", name: "Fish Ambul Thiyal", price: 780, qty: 3, total: 2340 },
    ]
  },
  { 
    id: "4456", 
    customer: "Sanduni Rathnayake", 
    table: "Table 07", 
    items: 7, 
    total: 3150, 
    status: "dining",
    orderType: "dine-in",
    orderItems: []
  },
  { 
    id: "9988", 
    customer: "Chathura Gamage", 
    table: "", 
    items: 4, 
    total: 1290, 
    status: "ready",
    orderType: "takeaway",
    orderItems: [
      { id: "p1", name: "Fish Cutlet", price: 450, qty: 1, total: 450 },
      { id: "p6", name: "Watalappan", price: 320, qty: 2, total: 640 },
      { id: "p8", name: "King Coconut", price: 200, qty: 1, total: 200 },
    ]
  },
  { 
    id: "3344", 
    customer: "Anjali Rajapaksha", 
    table: "", 
    items: 2, 
    total: 970, 
    status: "ready",
    orderType: "takeaway",
    orderItems: []
  },
  { 
    id: "5566", 
    customer: "Mahesh Cooray", 
    table: "", 
    items: 3, 
    total: 1200, 
    status: "preparing",
    orderType: "takeaway",
    orderItems: []
  },
  { 
    id: "6677", 
    customer: "Thilaka Jayawardena", 
    table: "Table 05", 
    items: 5, 
    total: 2150, 
    status: "waiting",
    orderType: "dine-in",
    orderItems: [
      { id: "p2", name: "Chicken Curry", price: 850, qty: 2, total: 1700 },
      { id: "p1", name: "Fish Cutlet", price: 450, qty: 1, total: 450 },
    ]
  },
  { 
    id: "7788", 
    customer: "Kapila Ranawaka", 
    table: "", 
    items: 2, 
    total: 850, 
    status: "waiting",
    orderType: "takeaway",
    orderItems: [
      { id: "p4", name: "Kottu Roti", price: 650, qty: 1, total: 650 },
      { id: "p8", name: "King Coconut", price: 200, qty: 1, total: 200 },
    ]
  },
];

const CATEGORIES = [
  { id: "all", name: "All menu", icon: "📄" },
  { id: "appetizer", name: "Appetizer", icon: "🧄" },
  { id: "soup", name: "Soup", icon: "🍲" },
  { id: "salads", name: "Salads", icon: "🥗" },
  { id: "main", name: "Main Course", icon: "🍽️" },
  { id: "italian", name: "Italian", icon: "🍝" },
  { id: "side", name: "Side Dish", icon: "🥤" },
  { id: "dessert", name: "Dessert", icon: "🧁" },
  { id: "beverages", name: "Beverages", icon: "🥤" },
];

const PRODUCTS = [
  { id: "p1", name: "Fish Cutlet", category: "Appetizer", price: 450, image: "/offer-card-1.png", isBestSeller: true, qty: 0 },
  { id: "p2", name: "Chicken Curry", category: "Main Course", price: 850, image: "/lunch.png", isBestSeller: true, qty: 8 },
  { id: "p3", name: "Gotu Kola Salad", category: "Salads", price: 380, image: "/offer.jpg", isBestSeller: true, qty: 6 },
  { id: "p4", name: "Kottu Roti", category: "Main Course", price: 650, image: "/dinner.png", isBestSeller: true, qty: 4 },
  { id: "p5", name: "Fish Ambul Thiyal", category: "Main Course", price: 780, image: "/brunch.png", isBestSeller: false, qty: 0 },
  { id: "p6", name: "Watalappan", category: "Dessert", price: 320, image: "/hightea.png", isBestSeller: false, qty: 0 },
  { id: "p7", name: "String Hoppers", category: "Main Course", price: 450, image: "/item1.png", isBestSeller: false, qty: 0 },
  { id: "p8", name: "King Coconut", category: "Beverages", price: 200, image: "/desserts.png", isBestSeller: false, qty: 0 },
];

// Base table configuration - 40 tables with fixed properties
const BASE_TABLES = Array.from({ length: 40 }, (_, index) => {
  const tableNumber = index + 1;
  
  return {
    id: tableNumber,
    name: `Table ${tableNumber.toString().padStart(2, '0')}`,
    capacity: tableNumber <= 20 ? 4 : tableNumber <= 30 ? 6 : 8, // Varying capacities
    location: tableNumber <= 10 ? "Main Hall" : 
              tableNumber <= 20 ? "Garden Terrace" : 
              tableNumber <= 30 ? "Rooftop Lounge" : "Private Dining",
    // Some tables have permanent statuses (not affected by orders)
    permanentStatus: (() => {
      const random = Math.random();
      if (tableNumber === 15) return "repairing"; // Table 15 is under repair
      if (tableNumber === 25) return "cleaning"; // Table 25 is being cleaned
      if (tableNumber === 35) return "reserved"; // Table 35 is reserved
      return null; // Most tables can be dynamically assigned
    })()
  };
});

export const Cashier_HomePage: FC = () => {
  const { addInvoice, getNextInvoiceNumber } = useInvoices();
  const [activeCategory, setActiveCategory] = useState("all");
  const [orderType, setOrderType] = useState<"dine-in" | "takeaway">("dine-in");
  const [customerName, setCustomerName] = useState("");
  const [tableNumber, setTableNumber] = useState("");

  const [selectedOrder, setSelectedOrder] = useState<any>(null);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [discount, setDiscount] = useState({ type: "none", value: 0 }); // "none", "percentage", "fixed"
  const [isEditMode, setIsEditMode] = useState(false); // Edit mode for finalized orders
  const [showDiscardDialog, setShowDiscardDialog] = useState(false); // Confirmation dialog for new order
  const [hoveredProduct, setHoveredProduct] = useState<string | null>(null);
  const [activeQuantitySelector, setActiveQuantitySelector] = useState<string | null>(null);
  const [productQuantities, setProductQuantities] = useState<{[key: string]: number}>({});
  const [cartItems, setCartItems] = useState<Array<{id: string, name: string, price: number, qty: number, total: number}>>([]);
  const [allOrders, setAllOrders] = useState(ALL_ORDERS); // State for managing orders
  const [isOrderDetailsBlink, setIsOrderDetailsBlink] = useState(false); // Blink animation for order details
  const [showTableSelector, setShowTableSelector] = useState(false); // Table selection dialog
  
  // Dynamic table status calculation based on current orders
  const getTableStatus = (tableName: string) => {
    const baseTable = BASE_TABLES.find(t => t.name === tableName);
    
    // If table has a permanent status (repairing, cleaning, etc.), use that
    if (baseTable?.permanentStatus) {
      return baseTable.permanentStatus;
    }
    
    // Check if table is currently occupied by any order
    const occupyingOrder = allOrders.find(order => 
      order.orderType === "dine-in" && 
      order.table === tableName &&
      // Table is occupied if order is in any active state
      (order.status === "waiting" || 
       order.status === "preparing" || 
       order.status === "ready_to_pay" || 
       order.status === "dining")
    );
    
    if (occupyingOrder) {
      // Determine status based on order state
      if (occupyingOrder.status === "dining" || occupyingOrder.status === "ready_to_pay") {
        return "dining";
      } else {
        return "reserved"; // waiting or preparing orders reserve the table
      }
    }
    
    return "free";
  };

  // Create dynamic tables data with real-time status
  const TABLES_DATA = BASE_TABLES.map(table => ({
    ...table,
    status: getTableStatus(table.name)
  }));

  // Filter orders that need attention and limit display
  const MAX_DASHBOARD_ORDERS = 7; // Maximum orders to show on dashboard (excluding new order button)
  const ORDERS_NEEDING_ATTENTION = allOrders.filter(order => 
    (order.orderType === "dine-in" && order.status === "ready_to_pay") || 
    (order.orderType === "takeaway" && order.status === "ready")
    // Waiting orders are not actionable by cashiers, so exclude from attention list
  );
  const DASHBOARD_ORDERS = [...ORDERS_NEEDING_ATTENTION, ...allOrders.filter(order => order.status === "waiting")].slice(0, MAX_DASHBOARD_ORDERS);
  const HAS_MORE_ORDERS = [...ORDERS_NEEDING_ATTENTION, ...allOrders.filter(order => order.status === "waiting")].length > MAX_DASHBOARD_ORDERS;
  
  const calculateTotal = (items: any[]) => {
    const subtotal = items.reduce((sum, item) => sum + item.total, 0);
    
    // Calculate discount
    let discountAmount = 0;
    if (discount.type === "percentage") {
      discountAmount = subtotal * (discount.value / 100);
    } else if (discount.type === "fixed") {
      discountAmount = discount.value;
    }
    
    const discountedSubtotal = subtotal - discountAmount;
    const tax = discountedSubtotal * 0.05;
    return { 
      subtotal, 
      discountAmount, 
      discountedSubtotal, 
      tax, 
      total: discountedSubtotal + tax 
    };
  };

  const { subtotal, discountAmount, discountedSubtotal, tax, total } = calculateTotal(cartItems);

  const handleOrderClick = (order: any) => {
    if ((order.orderType === "dine-in" && order.status === "ready_to_pay") || 
        (order.orderType === "takeaway" && order.status === "ready")) {
      setSelectedOrder(order);
      setCustomerName(order.customer);
      setTableNumber(order.table ? order.table.split(" ")[1]?.replace(/^0+/, '') || "" : ""); // Remove leading zeros for display
      setOrderType(order.orderType); // Set order type based on the selected order
      setCartItems(order.orderItems);
      setDiscount({ type: "none", value: 0 }); // Reset discount for new order
      setIsEditMode(false); // Reset edit mode for new order
      setShowAllOrders(false); // Close modal when order is selected
    }
  };

  const readyToPayCount = ALL_ORDERS.filter(order => 
    (order.orderType === "dine-in" && order.status === "ready_to_pay") || 
    (order.orderType === "takeaway" && order.status === "ready")
  ).length;

  // Quantity management functions
  const getProductQuantity = (productId: string) => productQuantities[productId] || 0;
  
  const updateProductQuantity = (productId: string, newQty: number) => {
    const product = PRODUCTS.find(p => p.id === productId);
    if (!product) return;

    const validQty = Math.max(0, newQty);
    
    // Update product quantities
    setProductQuantities(prev => ({
      ...prev,
      [productId]: validQty
    }));
    
    // Update cart items
    if (validQty > 0) {
      setCartItems(prev => {
        const existingItemIndex = prev.findIndex(item => item.id === productId);
        const cartItem = {
          id: productId,
          name: product.name,
          price: product.price,
          qty: validQty,
          total: product.price * validQty
        };
        
        if (existingItemIndex >= 0) {
          // Update existing item
          const updated = [...prev];
          updated[existingItemIndex] = cartItem;
          return updated;
        } else {
          // Add new item
          return [...prev, cartItem];
        }
      });
    } else {
      // Remove from cart when quantity becomes 0
      setCartItems(prev => prev.filter(item => item.id !== productId));
      setActiveQuantitySelector(null);
    }
  };

  const handleImageClick = (productId: string) => {
    const currentQty = getProductQuantity(productId);
    if (currentQty === 0) {
      // First click sets quantity to 1 and shows selector
      updateProductQuantity(productId, 1);
      setActiveQuantitySelector(productId);
    } else {
      // Toggle selector visibility
      setActiveQuantitySelector(
        activeQuantitySelector === productId ? null : productId
      );
    }
  };

  // Close selector when clicking outside
  const handleOutsideClick = () => {
    setActiveQuantitySelector(null);
  };

  // Check if there are unsaved changes
  const hasUnsavedChanges = () => {
    return (
      customerName.trim() !== "" ||
      tableNumber.trim() !== "" ||
      cartItems.length > 0 ||
      Object.keys(productQuantities).length > 0 ||
      discount.type !== "none"
    );
  };

  // Clear all order data
  const clearOrderData = () => {
    setSelectedOrder(null);
    setCustomerName("");
    setTableNumber("");
    setCartItems([]);
    setProductQuantities({});
    setDiscount({ type: "none", value: 0 });
    setIsEditMode(false);
    setOrderType("dine-in");
  };

  // Handle new order button click
  const handleNewOrderClick = () => {
    // Trigger blink animation for order details section
    setIsOrderDetailsBlink(true);
    setTimeout(() => setIsOrderDetailsBlink(false), 600); // Stop blink after 600ms
    
    if (hasUnsavedChanges() && !selectedOrder) {
      setShowDiscardDialog(true);
    } else {
      clearOrderData();
    }
  };

  // Generate invoice from completed order
  const generateInvoice = (orderData: any): CashierInvoice => {
    const invoiceOrders: InvoiceOrder[] = orderData.orderItems.map((item: any) => ({
      id: item.id,
      name: item.name,
      quantity: item.qty,
      unitPrice: item.price,
      totalPrice: item.total
    }));

    const subtotal = invoiceOrders.reduce((sum, item) => sum + item.totalPrice, 0);
    const serviceCharge = orderData.orderType === "dine-in" ? Math.round(subtotal * 0.1) : 0; // 10% service charge for dine-in
    const discountAmount = discount.type === "percentage" ? Math.round(subtotal * (discount.value / 100)) : 
                          discount.type === "fixed" ? discount.value : 0;
    const finalTotal = subtotal + serviceCharge - discountAmount;
    const loyaltyPoints = Math.floor(finalTotal / 100); // 1 point per Rs.100

    return {
      id: `INV-${Date.now()}`,
      invoiceNumber: getNextInvoiceNumber(),
      tableNumber: orderData.orderType === "dine-in" ? orderData.table : undefined,
      customerName: orderData.customer,
      type: orderData.orderType,
      orders: invoiceOrders,
      subtotal: subtotal,
      serviceCharge: serviceCharge,
      discount: discountAmount,
      loyaltyPoints: loyaltyPoints,
      total: finalTotal,
      createdAt: new Date().toISOString(),
      status: "paid"
    };
  };

  // Handle order confirmation
  const handleConfirmOrder = () => {
    if (cartItems.length === 0) return;
    
    if (selectedOrder) {
      // Processing payment for existing order - generate invoice
      const invoiceData = generateInvoice({
        ...selectedOrder,
        customer: customerName,
        table: orderType === "dine-in" ? `Table ${tableNumber.padStart(2, '0')}` : "",
        orderItems: cartItems
      });
      
      // Add invoice to the system
      addInvoice(invoiceData);
      
      // Remove the order from current orders (it's now completed)
      setAllOrders(prevOrders => prevOrders.filter(order => order.id !== selectedOrder.id));
      
      // Clear current order data after payment
      clearOrderData();
      
      // Show success message
      alert(`Payment processed! Invoice ${invoiceData.invoiceNumber} generated. Total: Rs.${invoiceData.total}`);
      
    } else {
      // Creating new order - send to kitchen with waiting status
      const newOrder = {
        id: Date.now().toString(), // Simple ID generation for demo
        customer: customerName,
        table: orderType === "dine-in" ? `Table ${tableNumber.padStart(2, '0')}` : "",
        items: cartItems.length,
        total: total,
        status: "waiting" as const,
        orderType: orderType,
        orderItems: cartItems
      };
      
      // Add the new order to the orders state
      setAllOrders(prevOrders => [...prevOrders, newOrder]);
      
      // In a real app, this would be sent to the backend
      console.log("Order confirmed and sent to kitchen:", newOrder);
      
      // Clear current order data after confirmation
      clearOrderData();
      
      // Show success message
      alert(`Order confirmed! Order #${newOrder.id} is now waiting for kitchen acceptance.`);
    }
  };

  const OrderStatusIndicator = ({ order }: { order: any }) => {
    
    if (order.status === "ready_to_pay") {
      return (
        <Box sx={{ 
          width: 80, 
          height: "100%", 
          bgcolor: "warning.main", 
          borderRadius: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "warning.contrastText",
          fontWeight: "bold",
          fontSize: 11,
          flexDirection: "column",
          gap: 0.5,
          cursor: "pointer",
          "&:hover": { bgcolor: "warning.dark" }
        }}>
          <MonetizationOnIcon sx={{ fontSize: 16 }} />
          <Typography fontSize={9} color="warning.contrastText" fontWeight="bold" textAlign="center" lineHeight={1}>
            CHECKOUT
          </Typography>
        </Box>
      );
    } else if (order.status === "preparing") {
      return (
        <Box sx={{ 
          width: 80, 
          height: "100%", 
          bgcolor: "grey.200", 
          borderRadius: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "text.secondary",
          fontWeight: "bold",
          fontSize: 11,
          flexDirection: "column",
          gap: 0.5
        }}>
          <RestaurantIcon sx={{ fontSize: 16 }} />
          <Typography fontSize={9} color="text.secondary" fontWeight="bold" textAlign="center">PREPARING</Typography>
        </Box>
      );
    } else if (order.status === "ready") {
      return (
        <Box sx={{ 
          width: 80, 
          height: "100%", 
          bgcolor: "success.main", 
          borderRadius: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "success.contrastText",
          fontWeight: "bold",
          fontSize: 11,
          flexDirection: "column",
          gap: 0.5,
          cursor: "pointer",
          "&:hover": { bgcolor: "success.dark" }
        }}>
          <CheckCircleIcon sx={{ fontSize: 16 }} />
          <Typography fontSize={9} color="success.contrastText" fontWeight="bold" textAlign="center">READY</Typography>
        </Box>
      );
    } else if (order.status === "waiting") {
      return (
        <Box sx={{ 
          width: 80, 
          height: "100%", 
          bgcolor: "grey.300", 
          borderRadius: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "text.secondary",
          fontWeight: "bold",
          fontSize: 11,
          flexDirection: "column",
          gap: 0.5
        }}>
          <RestaurantIcon sx={{ fontSize: 16 }} />
          <Typography fontSize={9} color="text.secondary" fontWeight="bold" textAlign="center">WAITING</Typography>
        </Box>
      );
    } else {
      // dining status (only for dine-in orders)
      return (
        <Box sx={{ 
          width: 80, 
          height: "100%", 
          bgcolor: "grey.200", 
          borderRadius: 2, 
          display: "flex", 
          alignItems: "center", 
          justifyContent: "center",
          color: "text.secondary",
          fontWeight: "bold",
          fontSize: 11,
          flexDirection: "column",
          gap: 0.5
        }}>
          <LocalDiningIcon sx={{ fontSize: 16 }} />
          <Typography fontSize={9} color="text.secondary" fontWeight="bold" textAlign="center">DINING</Typography>
        </Box>
      );
    }
  };

  return (
    <Box 
      sx={{ minHeight: "100vh", bgcolor: "grey.50", p: 2 }}
      onClick={activeQuantitySelector ? handleOutsideClick : undefined}
    >

      <Box sx={{ display: "grid", gridTemplateColumns: "1fr 360px", gap: 3 }}>
        {/* Left Column */}
        <Box>
          {/* Current Orders */}
          <Box sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Current order</Typography>
            <Button 
              variant="outlined" 
              size="small"
              onClick={() => setShowAllOrders(true)}
              color="primary"
            >
              View All ({readyToPayCount} ready)
            </Button>
          </Box>
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 2, mb: 2 }}>
            {/* New Order Button Card */}
            <Box
              sx={{
                bgcolor: "primary.main",
                borderRadius: 3,
                p: 2,
                display: "flex",
                flexDirection: "column",
                alignItems: "center",
                justifyContent: "center",
                minHeight: 120,
                cursor: "pointer",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)",
                border: "2px solid transparent",
                "&:hover": {
                  boxShadow: "0 6px 20px rgba(0,0,0,0.20)",
                  transform: "translateY(-2px)",
                  bgcolor: "primary.dark"
                },
                transition: "all 0.2s ease"
              }}
              onClick={handleNewOrderClick}
            >
              <AddIcon sx={{ fontSize: 40, color: "primary.contrastText", mb: 1 }} />
              <Typography variant="body1" fontWeight="bold" color="primary.contrastText" textAlign="center">
                New Order
              </Typography>
            </Box>
            
            {DASHBOARD_ORDERS.map((order, index) => (
              <Box 
                key={order.id} 
                sx={{ 
                  bgcolor: "background.paper", 
                  p: 2, 
                  borderRadius: 3, 
                  display: "flex", 
                  alignItems: "center", 
                  gap: 2,
                  cursor: ((order.orderType === "dine-in" && order.status === "ready_to_pay") || (order.orderType === "takeaway" && order.status === "ready")) ? "pointer" : "default",
                  border: selectedOrder?.id === order.id ? "2px solid" : "1px solid transparent",
                  borderColor: selectedOrder?.id === order.id ? "primary.main" : "transparent",
                  boxShadow: "0 2px 4px rgba(0,0,0,0.08)",
                  "&:hover": ((order.orderType === "dine-in" && order.status === "ready_to_pay") || (order.orderType === "takeaway" && order.status === "ready")) ? { 
                    boxShadow: "0 4px 12px rgba(0,0,0,0.15)",
                    transform: "translateY(-1px)"
                  } : {},
                  transition: "all 0.2s ease",
                  // Staggered slide-in animation
                  animation: "slideIn 0.6s ease-out",
                  animationDelay: `${index * 0.1}s`,
                  animationFillMode: "both",
                  "@keyframes slideIn": {
                    "0%": { 
                      opacity: 0, 
                      transform: "translateX(-20px)" 
                    },
                    "100%": { 
                      opacity: 1, 
                      transform: "translateX(0)" 
                    }
                  }
                }}
                onClick={() => handleOrderClick(order)}
              >
                <OrderStatusIndicator order={order} />
                <Box>
                  <Typography variant="body2" fontWeight="bold">
                    {order.orderType === "dine-in" ? order.table : "Takeaway"}
                  </Typography>
                  <Typography variant="caption" color="text.secondary">#{order.id}</Typography>
                  <Typography variant="caption" color="text.secondary" display="block">{order.customer}</Typography>
                  <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                    <Typography variant="caption">{order.items} Items</Typography>
                    <Typography variant="caption">Rs.{order.total}</Typography>
                  </Box>

                </Box>
              </Box>
            ))}
          </Box>

          {/* Categories */}
          <Typography variant="h6" fontWeight="bold" mb={2}>Categories</Typography>

          <Box sx={{ display: "flex", gap: 1, mb: 3 }}>
            {CATEGORIES.map((cat) => (
              <Button
                key={cat.id}
                variant={activeCategory === cat.id ? "contained" : "outlined"}
                onClick={() => setActiveCategory(cat.id)}
        sx={{
                  borderRadius: 2,
                  bgcolor: activeCategory === cat.id ? "primary.main" : "background.paper",
                  color: activeCategory === cat.id ? "primary.contrastText" : "text.primary",
                  border: "1px solid",
                  borderColor: "divider",
                  minWidth: 120,
                  height: 60,
                  display: "flex",
                  alignItems: "center",
                  gap: 1,
                  px: 2,
                }}
              >
                <Typography fontSize={20}>{cat.icon}</Typography>
                <Typography fontSize={12} fontWeight="bold">{cat.name}</Typography>
              </Button>
            ))}
          </Box>

                    {/* Products Grid */}
          <Box sx={{ display: "grid", gridTemplateColumns: "repeat(4, 1fr)", gap: 3 }}>
            {PRODUCTS.map((product) => (
              <Box 
                key={product.id} 
                sx={{ 
                  bgcolor: "background.paper", 
                  borderRadius: 4, 
                  overflow: "hidden", 
                  position: "relative", 
                  display: "flex", 
                  height: 160,
                  boxShadow: "0 2px 8px rgba(0,0,0,0.08)",
                  border: "1px solid",
                  borderColor: "divider",
                  "&:hover": { 
                    boxShadow: "0 4px 16px rgba(0,0,0,0.12)",
                    transform: "translateY(-2px)",
                    transition: "all 0.2s ease-in-out"
                  }
                }}
              >
                {/* Left Side - Square Image with Quantity Overlay */}
                <Box 
                  sx={{ 
                    position: "relative", 
                    width: 160, 
                    height: 160, 
                    flexShrink: 0,
                    borderRadius: "16px 0 0 16px",
                    overflow: "hidden",
                    cursor: "pointer"
                  }}
                  onMouseEnter={() => setHoveredProduct(product.id)}
                  onMouseLeave={() => setHoveredProduct(null)}
                  onClick={() => handleImageClick(product.id)}
                >
                  <Box
                    sx={{
                      position: "absolute",
                      top: 0,
                      left: 0,
                      width: "100%",
                      height: "100%",
                      borderRadius: "16px 0 0 16px",
                      overflow: "hidden"
                    }}
                  >
                    <img 
                      src={product.image} 
                      alt={product.name} 
                      style={{ 
                        width: "100%", 
                        height: "100%", 
                        objectFit: "cover" 
                      }} 
                    />
                  </Box>
                  
                  {/* Hover Plus Button - Only show when no quantity selector is active */}
                  {hoveredProduct === product.id && activeQuantitySelector !== product.id && getProductQuantity(product.id) === 0 && (
                    <Fade in timeout={200}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: "50%",
                          left: "50%",
                          transform: "translate(-50%, -50%)",
                          bgcolor: "rgba(0,0,0,0.7)",
                          borderRadius: "50%",
                          width: 60,
                          height: 60,
                          display: "flex",
                          alignItems: "center",
                          justifyContent: "center",
                          zIndex: 2
                        }}
                      >
                        <AddIcon sx={{ color: "white", fontSize: 32 }} />
                      </Box>
                    </Fade>
                  )}
                  
                  {/* Quantity Selector Overlay */}
                  {(activeQuantitySelector === product.id && getProductQuantity(product.id) > 0) && (
                    <Grow in timeout={300}>
                      <Box
                        sx={{
                          position: "absolute",
                          top: 0,
                          left: 0,
                          right: 0,
                          bottom: 0,
                          bgcolor: "rgba(0,0,0,0.85)",
                          borderRadius: "16px 0 0 16px",
                          display: "flex",
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "center",
                          gap: 1.5,
                          zIndex: 3,
                          padding: 1
                        }}
                        onClick={(e) => e.stopPropagation()}
                      >
                        {/* Remove Button */}
                        <Box
                          onClick={() => updateProductQuantity(product.id, getProductQuantity(product.id) - 1)}
                          sx={{
                            bgcolor: "rgba(255,255,255,0.9)",
                            color: "text.primary",
                            width: 40,
                            height: "100%",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.2)",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "white",
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.3)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <RemoveIcon sx={{ fontSize: 18 }} />
                        </Box>
                        
                        {/* Quantity Display */}
                        <Typography
                          variant="h2"
                          sx={{
                            color: "white",
                            fontWeight: "800",
                            fontSize: 24,
                            textShadow: "0 2px 8px rgba(0,0,0,0.7)",
                            textAlign: "center",
                            lineHeight: 1,
                            userSelect: "none",
                            minWidth: 32
                          }}
                        >
                          {getProductQuantity(product.id)}
                        </Typography>
                        
                        {/* Add Button */}
                        <Box
                          onClick={() => updateProductQuantity(product.id, getProductQuantity(product.id) + 1)}
                          sx={{
                            bgcolor: "primary.main",
                            color: "primary.contrastText",
                            width: 40,
                            height: "100%",
                            borderRadius: 2,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "center",
                            boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                            cursor: "pointer",
                            "&:hover": {
                              bgcolor: "primary.dark",
                              transform: "scale(1.05)",
                              boxShadow: "0 4px 12px rgba(0,0,0,0.4)"
                            },
                            transition: "all 0.2s ease"
                          }}
                        >
                          <AddIcon sx={{ fontSize: 18 }} />
                        </Box>
                      </Box>
                    </Grow>
                  )}
                  
                  {/* Quantity Badge - Show when item has quantity but selector is hidden */}
                  {getProductQuantity(product.id) > 0 && activeQuantitySelector !== product.id && (
      <Box
        sx={{
          position: "absolute",
                        top: 8,
                        right: 8,
                        bgcolor: "primary.main",
                        color: "primary.contrastText",
                        borderRadius: "50%",
                        width: 32,
                        height: 32,
                        display: "flex",
                        alignItems: "center",
                        justifyContent: "center",
                        fontSize: 14,
                        fontWeight: "bold",
                        boxShadow: "0 2px 8px rgba(0,0,0,0.3)",
                        zIndex: 2
                      }}
                    >
                      {getProductQuantity(product.id)}
                    </Box>
                  )}
                </Box>
                
                {/* Right Side - Content and Controls */}
                <Box sx={{ 
                  p: 3, 
                  flex: 1, 
                  display: "flex", 
                  flexDirection: "column", 
                  justifyContent: "space-between",
                  minWidth: 0
                }}>
                  {/* Product Info */}
                  <Box sx={{ mb: 2 }}>
                    <Typography 
                      variant="h6" 
                      fontWeight="700" 
                      sx={{ 
                        fontSize: 16,
                        lineHeight: 1.3,
                        mb: 0.5
                      }}
                    >
                      {product.name}
                    </Typography>
                    <Typography 
                      variant="body2" 
                      color="text.secondary" 
                      sx={{ 
                        fontSize: 13,
                        mb: 1,
                        fontWeight: 500
                      }}
                    >
                      {product.category}
                    </Typography>
                    <Typography 
                      variant="h6" 
                      fontWeight="700" 
                      sx={{ 
                        color: "primary.main",
                        fontSize: 18
                      }}
                    >
                      Rs.{product.price}
        </Typography>
      </Box>


                </Box>
              </Box>
            ))}
          </Box>
        </Box>

        {/* Right Column - Order Details */}
        <Box sx={{ 
          bgcolor: "background.paper", 
          borderRadius: 3, 
          p: 3, 
          height: "fit-content",
          // Blink animation when new order is clicked
          ...(isOrderDetailsBlink && {
            animation: "orderDetailsBlink 0.6s ease-in-out",
            "@keyframes orderDetailsBlink": {
              "0%": { 
                bgcolor: "background.paper",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
              },
              "50%": { 
                bgcolor: "success.light",
                boxShadow: "0 4px 20px rgba(76,175,80,0.2)",
                transform: "scale(1.01)"
              },
              "100%": { 
                bgcolor: "background.paper",
                boxShadow: "0 2px 8px rgba(0,0,0,0.12)"
              }
            }
          })
        }}>
          <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mb: 2 }}>
            <Typography variant="h6" fontWeight="bold">Order details</Typography>
            {selectedOrder && (
              <Button
                variant={isEditMode ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => setIsEditMode(!isEditMode)}
                startIcon={isEditMode ? <SaveIcon sx={{ fontSize: 14 }} /> : <EditIcon sx={{ fontSize: 14 }} />}
                sx={{ fontSize: 11, minWidth: 90 }}
              >
                {isEditMode ? "Save" : "Edit"}
              </Button>
            )}
          </Box>
          
          {/* Order Type Toggle - Only show when no order is selected or allow changing only for manual orders */}
          <ToggleButtonGroup
            value={orderType}
            exclusive
            onChange={(_, value) => value && !selectedOrder && setOrderType(value)}
            size="small"
            disabled={!!selectedOrder} // Disable when an order is selected
            sx={{ 
              mb: 2,
              "& .MuiToggleButton-root": {
                borderColor: "primary.main",
                color: "primary.main",
                "&.Mui-selected": {
                  bgcolor: "primary.main",
                  color: "primary.contrastText",
                  "&:hover": {
                    bgcolor: "primary.dark",
                  },
                },
                "&:hover": {
                  bgcolor: "primary.light",
                  color: "primary.contrastText",
                },
              },
            }}
          >
            {/* Show only the relevant order type button when an order is selected */}
            {(!selectedOrder || selectedOrder.orderType === "dine-in") && (
              <ToggleButton value="dine-in">Dine-in</ToggleButton>
            )}
            {(!selectedOrder || selectedOrder.orderType === "takeaway") && (
              <ToggleButton value="takeaway">Takeaway</ToggleButton>
            )}
          </ToggleButtonGroup>

          {/* Customer Details */}
          <Box sx={{ display: "grid", gridTemplateColumns: "1fr 1fr", gap: 1, mb: 2 }}>
            <Box>
              <Typography variant="caption" color="text.secondary">Customer name</Typography>
              <TextField 
                size="small" 
                value={customerName} 
                onChange={(e) => setCustomerName(e.target.value)} 
                fullWidth 
                disabled={selectedOrder && !isEditMode}
              />
            </Box>
            {orderType === "dine-in" && (
              <Box>
                <Typography variant="caption" color="text.secondary">Table number</Typography>
                <TextField 
                  size="small" 
                  value={tableNumber} 
                  fullWidth 
                  disabled={selectedOrder && !isEditMode}
                  placeholder="Click to select table"
                  InputProps={{
                    readOnly: true,
                    endAdornment: (
                      <IconButton 
                        size="small" 
                        onClick={() => setShowTableSelector(true)}
                        disabled={selectedOrder && !isEditMode}
                      >
                        🍽️
                      </IconButton>
                    ),
                  }}
                  onClick={() => !selectedOrder || isEditMode ? setShowTableSelector(true) : null}
                  sx={{ cursor: (!selectedOrder || isEditMode) ? "pointer" : "default" }}
                />
              </Box>
            )}
          </Box>



          {/* Ordered Menu */}
          <Typography variant="subtitle2" color="text.secondary" mb={1}>
            Ordered menu <span style={{ float: "right" }}>{cartItems.length} Items</span>
          </Typography>

          {cartItems.length === 0 ? (
            <Box sx={{ 
              display: "flex", 
              flexDirection: "column", 
              alignItems: "center", 
              justifyContent: "center", 
              py: 4,
              color: "text.secondary" 
            }}>
              <Typography variant="body2" color="text.secondary" textAlign="center">
                {selectedOrder ? "No items in this order" : "Select an order to process payment or add items manually"}
              </Typography>
            </Box>
          ) : (
            cartItems.map((item) => (
            <Box key={item.id} sx={{ display: "flex", alignItems: "center", gap: 2, mb: 2 }}>
              <Box sx={{ flex: 1 }}>
                <Typography variant="body2" fontWeight="bold">{item.name}</Typography>
                <Typography variant="caption" color="text.secondary">Rs.{item.price} x{item.qty}</Typography>
                {(isEditMode || !selectedOrder) && (
                  <Box sx={{ display: "flex", alignItems: "center", gap: 1, mt: 0.5 }}>
                    <IconButton 
                      size="small" 
                      sx={{ bgcolor: "grey.100", width: 20, height: 20 }}
                      onClick={() => updateProductQuantity(item.id, item.qty - 1)}
                    >
                      <RemoveIcon fontSize="small" />
                    </IconButton>
                    <Typography variant="body2">{item.qty}</Typography>
                    <IconButton 
                      size="small" 
                      sx={{ bgcolor: "primary.main", color: "primary.contrastText", width: 20, height: 20 }}
                      onClick={() => updateProductQuantity(item.id, item.qty + 1)}
                    >
                      <AddIcon fontSize="small" />
                    </IconButton>
                    <IconButton 
                      size="small" 
                      color="error" 
                      sx={{ ml: 1 }}
                      onClick={() => updateProductQuantity(item.id, 0)}
                    >
                      <DeleteIcon fontSize="small" />
                    </IconButton>
                  </Box>
                )}
              </Box>
              <Typography variant="body2" fontWeight="bold">Rs.{item.total}</Typography>
            </Box>
            ))
          )}

          <Divider sx={{ my: 2 }} />

          {/* Discount Section */}
          <Box sx={{ mb: 2 }}>
            <Typography variant="subtitle2" fontWeight="bold" mb={1}>Discount</Typography>
            <Box sx={{ display: "flex", gap: 1, mb: 1 }}>
              <Button
                variant={discount.type === "none" ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => setDiscount({ type: "none", value: 0 })}
                sx={{ flex: 1, fontSize: 11 }}
              >
                None
              </Button>
              <Button
                variant={discount.type === "percentage" ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => setDiscount({ type: "percentage", value: 10 })}
                sx={{ flex: 1, fontSize: 11 }}
              >
                %
              </Button>
              <Button
                variant={discount.type === "fixed" ? "contained" : "outlined"}
                size="small"
                color="primary"
                onClick={() => setDiscount({ type: "fixed", value: 10 })}
                sx={{ flex: 1, fontSize: 11 }}
              >
                Rs.
              </Button>
            </Box>
            {discount.type !== "none" && (
              <TextField
                size="small"
                type="number"
                value={discount.value}
                onChange={(e) => {
                  const inputValue = parseFloat(e.target.value) || 0;
                  const maxValue = discount.type === "percentage" ? 100 : subtotal; // 0-100% or 0-total
                  const validValue = Math.max(0, Math.min(maxValue, inputValue));
                  setDiscount({ ...discount, value: validValue });
                }}
                placeholder={discount.type === "percentage" ? "Enter %" : "Enter Rs."}
                fullWidth
                InputProps={{
                  endAdornment: discount.type === "percentage" ? "%" : "Rs.",
                  inputProps: { 
                    min: 0, 
                    max: discount.type === "percentage" ? 100 : subtotal 
                  } // Dynamic max based on discount type
                }}
              />
            )}
          </Box>

          {/* Payment Details */}
          <Typography variant="subtitle2" fontWeight="bold" mb={1}>Payment Details</Typography>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Subtotal</Typography>
            <Typography variant="body2">Rs.{subtotal.toFixed(2)}</Typography>
          </Box>
          {discountAmount > 0 && (
            <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
              <Typography variant="body2" color="text.secondary">
                Discount ({discount.type === "percentage" ? `Rs.{discount.value}%` : `Rs.Rs.{discount.value}`})
        </Typography>
              <Typography variant="body2" color="error">-Rs.{discountAmount.toFixed(2)}</Typography>
            </Box>
          )}
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Taxes</Typography>
            <Typography variant="body2">Rs.{tax.toFixed(2)} (5%)</Typography>
          </Box>
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 0.5 }}>
            <Typography variant="body2" color="text.secondary">Additional fee</Typography>
            <Typography variant="body2">-</Typography>
          </Box>
          <Divider sx={{ my: 1 }} />
          <Box sx={{ display: "flex", justifyContent: "space-between", mb: 2 }}>
            <Typography variant="body1" fontWeight="bold">Total</Typography>
            <Typography variant="body1" fontWeight="bold">Rs.{total.toFixed(2)}</Typography>
      </Box>

                              <Button
            variant="contained"
            fullWidth
            color="primary"
            onClick={handleConfirmOrder}
            disabled={cartItems.length === 0 || (!selectedOrder && customerName.trim() === "")}
            sx={{ 
              height: 48, 
              borderRadius: 2,
              fontSize: 16,
              fontWeight: "bold"
            }}
          >
            {selectedOrder ? "Process Payment" : "Confirm Order"}
        </Button>
      </Box>
      </Box>

      {/* All Orders Modal */}
      <Dialog 
        open={showAllOrders} 
        onClose={() => setShowAllOrders(false)}
        maxWidth="lg"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            All Orders Queue ({allOrders.length} orders)
          </Typography>
          <IconButton onClick={() => setShowAllOrders(false)}>✕</IconButton>
        </DialogTitle>
        <DialogContent>
          {/* Orders organized by status priority */}
          <Box sx={{ py: 2 }}>
            {/* Priority Status Orders - Need Attention */}
            {ORDERS_NEEDING_ATTENTION.length > 0 && (
              <Box sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" color="error.main" sx={{ mb: 2, display: "flex", alignItems: "center", gap: 1 }}>
                  🚨 Need Attention ({ORDERS_NEEDING_ATTENTION.length})
                </Typography>
                <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(300px, 1fr))", gap: 2 }}>
                  {ORDERS_NEEDING_ATTENTION
                    .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Sort by queue number (order ID)
                    .map((order, index) => (
                    <Box 
                      key={order.id} 
                      sx={{ 
                        bgcolor: "background.paper", 
                        p: 2.5, 
                        borderRadius: 3, 
                        border: "2px solid",
                        borderColor: order.status === "waiting" ? "grey.300" : order.status === "ready_to_pay" ? "warning.main" : "success.main",
                        display: "flex", 
                        alignItems: "center", 
                        gap: 2,
                        cursor: ((order.orderType === "dine-in" && order.status === "ready_to_pay") || (order.orderType === "takeaway" && order.status === "ready")) ? "pointer" : "default",
                        "&:hover": ((order.orderType === "dine-in" && order.status === "ready_to_pay") || (order.orderType === "takeaway" && order.status === "ready")) ? { boxShadow: 3 } : {},
                        boxShadow: 1
                      }}
                      onClick={() => {
                        if ((order.orderType === "dine-in" && order.status === "ready_to_pay") || (order.orderType === "takeaway" && order.status === "ready")) {
                          handleOrderClick(order);
                          setShowAllOrders(false);
                        }
                      }}
                    >
                      <Box sx={{ 
                        minWidth: 40, 
                        height: 40, 
                        borderRadius: "50%", 
                        bgcolor: "primary.main", 
                        color: "primary.contrastText", 
                        display: "flex", 
                        alignItems: "center", 
                        justifyContent: "center", 
                        fontWeight: "bold",
                        fontSize: 14
                      }}>
                        #{index + 1}
                      </Box>
                      <OrderStatusIndicator order={order} />
                      <Box sx={{ flex: 1 }}>
                        <Typography variant="body1" fontWeight="bold">
                          {order.orderType === "dine-in" ? order.table : "Takeaway"}
                        </Typography>
                        <Typography variant="body2" color="text.secondary">Order #{order.id}</Typography>
                        <Typography variant="body2" color="text.secondary">{order.customer}</Typography>
                        <Box sx={{ display: "flex", gap: 2, mt: 1 }}>
                          <Typography variant="body2" fontWeight="medium">{order.items} Items</Typography>
                          <Typography variant="body2" fontWeight="bold" color="primary.main">Rs.{order.total}</Typography>
                        </Box>
                      </Box>
                    </Box>
                  ))}
                </Box>
              </Box>
            )}

            {/* All Other Orders */}
            <Box>
              <Typography variant="subtitle1" fontWeight="bold" color="text.secondary" sx={{ mb: 2 }}>
                Other Orders ({allOrders.filter(order => !ORDERS_NEEDING_ATTENTION.includes(order)).length})
              </Typography>
              <Box sx={{ display: "grid", gridTemplateColumns: "repeat(auto-fit, minmax(280px, 1fr))", gap: 2 }}>
                {allOrders
                  .filter(order => !ORDERS_NEEDING_ATTENTION.includes(order))
                  .sort((a, b) => parseInt(a.id) - parseInt(b.id)) // Sort by queue number (order ID)
                  .map((order) => (
                  <Box 
                    key={order.id} 
                    sx={{ 
                      bgcolor: "background.paper", 
                      p: 2, 
                      borderRadius: 3, 
                      border: "1px solid",
                      borderColor: order.status === "waiting" ? "grey.300" : "divider",
                      display: "flex", 
                      alignItems: "center", 
                      gap: 2,
                      opacity: order.status === "waiting" ? 1 : 0.8, // Full opacity for waiting orders
                      boxShadow: order.status === "waiting" ? 1 : 0 // Slight shadow for waiting orders
                    }}
                  >
                    <OrderStatusIndicator order={order} />
                    <Box sx={{ flex: 1 }}>
                      <Typography variant="body2" fontWeight="bold">
                        {order.orderType === "dine-in" ? order.table : "Takeaway"}
                      </Typography>
                      <Typography variant="caption" color="text.secondary">Order #{order.id}</Typography>
                      <Typography variant="caption" color="text.secondary" display="block">{order.customer}</Typography>
                      <Box sx={{ display: "flex", gap: 1, mt: 0.5 }}>
                        <Typography variant="caption">{order.items} Items</Typography>
                        <Typography variant="caption">Rs.{order.total}</Typography>
                      </Box>
                    </Box>
                  </Box>
                ))}
              </Box>
            </Box>
          </Box>
        </DialogContent>
      </Dialog>

      {/* Table Selection Dialog */}
      <Dialog
        open={showTableSelector}
        onClose={() => setShowTableSelector(false)}
        maxWidth="md"
        fullWidth
      >
        <DialogTitle sx={{ display: "flex", alignItems: "center", justifyContent: "space-between" }}>
          <Typography variant="h6" fontWeight="bold">
            Select Table
          </Typography>
          <IconButton onClick={() => setShowTableSelector(false)}>✕</IconButton>
        </DialogTitle>
        <DialogContent>
          <Box sx={{ py: 2 }}>
            {/* Legend */}
            <Box sx={{ display: "flex", gap: 2, mb: 3, flexWrap: "wrap" }}>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: "success.main", borderRadius: 1 }}></Box>
                <Typography variant="caption">Free</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: "error.main", borderRadius: 1 }}></Box>
                <Typography variant="caption">Dining</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: "warning.main", borderRadius: 1 }}></Box>
                <Typography variant="caption">Reserved</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: "grey.500", borderRadius: 1 }}></Box>
                <Typography variant="caption">Repairing</Typography>
              </Box>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                <Box sx={{ width: 16, height: 16, bgcolor: "info.main", borderRadius: 1 }}></Box>
                <Typography variant="caption">Cleaning</Typography>
              </Box>
            </Box>

            {/* Tables by Location */}
            {["Main Hall", "Garden Terrace", "Rooftop Lounge", "Private Dining"].map((location) => (
              <Box key={location} sx={{ mb: 4 }}>
                <Typography variant="subtitle1" fontWeight="bold" sx={{ mb: 2 }}>
                  {location}
                </Typography>
                <Box sx={{ 
                  display: "grid", 
                  gridTemplateColumns: "repeat(auto-fill, minmax(120px, 1fr))", 
                  gap: 2 
                }}>
                  {TABLES_DATA
                    .filter(table => table.location === location)
                    .map((table) => {
                      const isSelectable = table.status === "free";
                      const statusColor = 
                        table.status === "free" ? "success.main" :
                        table.status === "dining" ? "error.main" :
                        table.status === "reserved" ? "warning.main" :
                        table.status === "repairing" ? "grey.500" :
                        "info.main"; // cleaning

                      return (
                        <Box
                          key={table.id}
                          onClick={() => {
                            if (isSelectable) {
                              setTableNumber(table.name.split(" ")[1]?.replace(/^0+/, '') || table.id.toString());
                              setShowTableSelector(false);
                            }
                          }}
                          sx={{
                            p: 2,
                            borderRadius: 2,
                            border: "2px solid",
                            borderColor: statusColor,
                            bgcolor: isSelectable ? "success.light" : "grey.50", // Green background for free tables
                            cursor: isSelectable ? "pointer" : "not-allowed",
                            opacity: isSelectable ? 1 : 0.6,
                            display: "flex",
                            flexDirection: "column",
                            alignItems: "center",
                            gap: 1,
                            "&:hover": isSelectable ? {
                              boxShadow: 2,
                              transform: "translateY(-2px)",
                              bgcolor: "success.main", // Darker green on hover
                            } : {},
                            transition: "all 0.2s ease"
                          }}
                        >
                          <Typography variant="body2" fontWeight="bold">
                            {table.name}
                          </Typography>
                          <Typography variant="caption" color="text.secondary">
                            {table.capacity} seats
                          </Typography>
                          <Typography variant="caption" 
                            sx={{ 
                              color: statusColor,
                              fontWeight: "medium",
                              textTransform: "capitalize"
                            }}
                          >
                            {table.status}
                          </Typography>
                        </Box>
                      );
                    })}
                </Box>
              </Box>
            ))}
          </Box>
        </DialogContent>
      </Dialog>

      {/* Discard Changes Confirmation Dialog */}
      <Dialog
        open={showDiscardDialog}
        onClose={() => setShowDiscardDialog(false)}
        maxWidth="sm"
        fullWidth
      >
        <DialogContent sx={{ p: 3 }}>
          <Box sx={{ display: "flex", alignItems: "center", mb: 2 }}>
            <Box
              sx={{
                width: 48,
                height: 48,
                borderRadius: "50%",
                bgcolor: "warning.light",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                mr: 2
              }}
            >
              <Typography variant="h5">⚠️</Typography>
            </Box>
            <Box>
              <Typography variant="h6" fontWeight="bold">
                Discard Current Order?
              </Typography>
              <Typography variant="body2" color="text.secondary">
                You have unsaved changes that will be lost.
              </Typography>
            </Box>
          </Box>
          
          <Typography variant="body2" sx={{ mb: 3, pl: 7 }}>
            This will clear all customer details, cart items, and discounts. Are you sure you want to start a new order?
          </Typography>
          
          <Box sx={{ display: "flex", gap: 2, justifyContent: "flex-end" }}>
            <Button
              variant="outlined"
              color="error"
              onClick={() => {
                clearOrderData();
                setShowDiscardDialog(false);
              }}
              sx={{ 
                minWidth: 140,
                borderColor: "error.light",
                color: "error.main",
                "&:hover": {
                  borderColor: "error.main",
                  bgcolor: "error.light"
                }
              }}
            >
              Discard Changes
            </Button>
            <Button
              variant="contained"
              color="primary"
              onClick={() => setShowDiscardDialog(false)}
              sx={{ 
                minWidth: 140,
                boxShadow: 2,
                "&:hover": {
                  boxShadow: 4
                }
              }}
            >
              Keep Working
            </Button>
          </Box>
        </DialogContent>
      </Dialog>
    </Box>
  );
};
