import { type FC, useState } from "react";
import {
  Search,
  GridView,
  ViewList,
  Tune,
  ShoppingCart,
  Remove,
  Add,
} from "@mui/icons-material";
import {
  IconButton,
  Button,
  InputBase,
  Rating,
  Dialog,
  DialogTitle,
  DialogContent,
  Typography,
  FormControlLabel,
  Checkbox,
  TextField,
  DialogActions,
  Drawer,
  Divider,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";

interface MenuItem {
  id: number;
  name: string;
  price: number;
  image: string;
  category: string;
  ingredients: string[];
  rating: number;
  allergyNotice?: string;
  toppings?: string[];
  types?: string[];
}

interface CartItem extends MenuItem {
  quantity: number;
}

const sampleMenu: MenuItem[] = [
  {
    id: 1,
    name: "Margherita Pizza",
    price: 1200,
    image: "/item1.png",
    category: "Pizza",
    ingredients: ["Cheese", "Tomato Sauce", "Basil"],
    rating: 4.5,
    allergyNotice: "Contains dairy",
    toppings: ["Extra Cheese", "Olives", "Mushrooms"],
    types: ["Regular", "Large"],
  },
  {
    id: 2,
    name: "Chicken Burger",
    price: 900,
    image: "/item1.png",
    category: "Burgers",
    ingredients: ["Chicken Patty", "Lettuce", "Tomato", "Bun"],
    rating: 4.2,
    toppings: ["Extra Patty", "Cheese"],
    types: ["Regular", "Spicy"],
  },
  {
    id: 3,
    name: "Cheese Pizza",
    price: 1200,
    image: "/item1.png",
    category: "Pizza",
    ingredients: ["Cheese", "Tomato Sauce", "Basil"],
    rating: 4.5,
    allergyNotice: "Contains dairy",
    toppings: ["Extra Cheese", "Olives", "Mushrooms"],
    types: ["Regular", "Large"],
  },
  {
    id: 3,
    name: "Cheese Pizza",
    price: 1200,
    image: "/item1.png",
    category: "Pizza",
    ingredients: ["Cheese", "Tomato Sauce", "Basil"],
    rating: 4.5,
    allergyNotice: "Contains dairy",
    toppings: ["Extra Cheese", "Olives", "Mushrooms"],
    types: ["Regular", "Large"],
  },
];

export const Customer_Menu: FC = () => {
  const [showWelcomeModal, setShowWelcomeModal] = useState(true);
  const [userInfo, setUserInfo] = useState<{
    name: string;
    phone: string;
  } | null>(null);

  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [cart, setCart] = useState<CartItem[]>([]);
  const [selectedItem, setSelectedItem] = useState<MenuItem | null>(null);
  const [selectedQuantity, setSelectedQuantity] = useState(1);
  const [specialNote, setSpecialNote] = useState("");
  const [selectedToppings, setSelectedToppings] = useState<string[]>([]);
  const [selectedType, setSelectedType] = useState("");
  const [isCartOpen, setIsCartOpen] = useState(false);

  const filteredItems = sampleMenu.filter((item) =>
    item.name.toLowerCase().includes(searchTerm.toLowerCase())
  );

  const groupedItems: Record<string, MenuItem[]> = filteredItems.reduce(
    (acc, item) => {
      acc[item.category] = acc[item.category] || [];
      acc[item.category].push(item);
      return acc;
    },
    {} as Record<string, MenuItem[]>
  );

  const confirmAddToCart = () => {
    if (selectedItem) {
      const exists = cart.find((c) => c.id === selectedItem.id);
      if (exists) {
        setCart(
          cart.map((c) =>
            c.id === selectedItem.id
              ? { ...c, quantity: c.quantity + selectedQuantity }
              : c
          )
        );
      } else {
        setCart([
          ...cart,
          {
            ...selectedItem,
            quantity: selectedQuantity,
          },
        ]);
      }
    }
    setSelectedItem(null);
  };

  const openItemDialog = (item: MenuItem) => {
    setSelectedItem(item);
    setSelectedQuantity(1);
    setSelectedToppings([]);
    setSpecialNote("");
    setSelectedType(item.types?.[0] || "");
  };

  return (
    <div className="flex flex-col md:flex-row min-h-screen bg-gray-100">
      <main className="flex-1 p-4">
        <div className="flex flex-col md:flex-row items-center md:justify-between gap-4 mb-6">
          {/* Info Section */}
          <div className="text-sm text-gray-700 md:text-base">
            <span className="block inline">
              Table No: <strong className="text-black">12</strong>
            </span>
            <span className="hidden inline mx-2">|</span>
            <span className="block inline">
              Order No: <strong className="text-black">4589</strong>
            </span>
            <span className="hidden inline mx-2">|</span>
            <span className="block inline">
              Waiter No: <strong className="text-black">7</strong>
            </span>
          </div>

          {/* Search + View Mode */}
          <div className="flex flex-col sm:flex-row gap-4 w-full md:w-auto">
            {/* Search */}
            <div className="flex items-center bg-white px-3 py-1.5 rounded-md shadow w-full sm:w-72">
              <Search fontSize="small" className="text-gray-500" />
              <InputBase
                placeholder="Search menu..."
                className="ml-2 w-full"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </div>

            {/* View Toggle */}
            <div className="flex items-center gap-2">
              <IconButton
                onClick={() => setViewMode("grid")}
                color={viewMode === "grid" ? "primary" : "default"}
              >
                <GridView />
              </IconButton>
              <IconButton
                onClick={() => setViewMode("list")}
                color={viewMode === "list" ? "primary" : "default"}
              >
                <ViewList />
              </IconButton>
              <IconButton>
                <Tune />
              </IconButton>
            </div>
          </div>
        </div>

        {/* Sectioned Menu Items */}
        <div className="mb-4">
          {Object.entries(groupedItems).map(([category, items]) => (
            <div key={category} className="mb-6">
              <h2 className="text-lg font-semibold text-gray-700 mb-2">
                {category}
              </h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-4">
                {items.map((item) => (
                  <div
                    key={item.id}
                    className="border rounded-xl p-2 cursor-pointer shadow hover:shadow-md transition"
                    onClick={() => openItemDialog(item)}
                  >
                    <img
                      src={item.image}
                      alt={item.name}
                      className="rounded-md w-full h-24 md:h-50 object-cover"
                    />
                    <div className="mt-2 text-sm font-semibold">
                      {item.name}
                    </div>
                    <div className="text-xs text-gray-600">
                      Rs. {item.price}
                    </div>
                    <Rating size="small" value={item.rating} readOnly />
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      </main>

      <Dialog
        open={!!selectedItem}
        onClose={() => setSelectedItem(null)}
        fullWidth
        maxWidth="sm"
      >
        {selectedItem && (
          <>
            <DialogTitle>{selectedItem.name}</DialogTitle>
            <DialogContent>
              <img
                src={selectedItem.image}
                alt={selectedItem.name}
                className="rounded-md w-full h-40 object-cover mb-2"
              />
              <Typography variant="subtitle2">
                Rs. {selectedItem.price}
              </Typography>
              <Rating size="small" value={selectedItem.rating} readOnly />
              <Typography variant="body2" className="mt-2">
                Ingredients: {selectedItem.ingredients.join(", ")}
              </Typography>
              {selectedItem.allergyNotice && (
                <Typography variant="caption" color="error">
                  Allergy Notice: {selectedItem.allergyNotice}
                </Typography>
              )}
              {selectedItem.types && (
                <div className="mt-2">
                  <Typography variant="body2">Select Type:</Typography>
                  {selectedItem.types.map((type) => (
                    <FormControlLabel
                      key={type}
                      control={
                        <Checkbox
                          checked={selectedType === type}
                          onChange={() => setSelectedType(type)}
                        />
                      }
                      label={type}
                    />
                  ))}
                </div>
              )}
              {selectedItem.toppings && (
                <div className="mt-2">
                  <Typography variant="body2">Add Toppings:</Typography>
                  {selectedItem.toppings.map((top) => (
                    <FormControlLabel
                      key={top}
                      control={
                        <Checkbox
                          checked={selectedToppings.includes(top)}
                          onChange={() =>
                            setSelectedToppings((prev) =>
                              prev.includes(top)
                                ? prev.filter((t) => t !== top)
                                : [...prev, top]
                            )
                          }
                        />
                      }
                      label={top}
                    />
                  ))}
                </div>
              )}
              <div className="flex items-center gap-2 mt-4">
                <Typography variant="body2">Select Quantity:</Typography>
                <IconButton
                  onClick={() =>
                    setSelectedQuantity(Math.max(1, selectedQuantity - 1))
                  }
                >
                  <Remove />
                </IconButton>
                <Typography>{selectedQuantity}</Typography>
                <IconButton
                  onClick={() => setSelectedQuantity(selectedQuantity + 1)}
                >
                  <Add />
                </IconButton>
              </div>
              <div className="flex flex-col justify-center gap-2 mt-4">
                <Typography variant="body2">Special Instructions:</Typography>

                <TextField
                  fullWidth
                  multiline
                  rows={2}
                  placeholder="Special instructions..."
                  value={specialNote}
                  onChange={(e) => setSpecialNote(e.target.value)}
                  className="mt-2"
                />
              </div>
            </DialogContent>
            <DialogActions>
              <Button onClick={() => setSelectedItem(null)}>Cancel</Button>
              <Button onClick={confirmAddToCart} variant="contained">
                Add to Cart
              </Button>
            </DialogActions>
          </>
        )}
      </Dialog>

      <Dialog open={showWelcomeModal} disableEscapeKeyDown>
        <DialogTitle className="text-center">
          Welcome to Thon Hotels!
        </DialogTitle>
        <DialogContent className="flex flex-col gap-6">
          <Typography variant="body2" className="mb-4">
            Please continue as a guest or sign in to personalize your
            experience.
          </Typography>
          <TextField
            fullWidth
            label="Name"
            variant="outlined"
            className="mb-3"
            value={userInfo?.name || ""}
            onChange={(e) =>
              setUserInfo((prev) => ({
                name: prev?.name ?? "",
                phone: e.target.value,
              }))
            }
          />
          <TextField
            fullWidth
            label="Mobile Number"
            variant="outlined"
            value={userInfo?.phone || ""}
            onChange={(e) =>
              setUserInfo((prev) => ({
                name: prev?.name ?? "",
                phone: e.target.value,
              }))
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setShowWelcomeModal(false)}>
            Continue as Guest
          </Button>
          <Button
            onClick={() => {
              if (userInfo?.name && userInfo?.phone) {
                setShowWelcomeModal(false);
              } else {
                alert("Please enter name and phone to sign in.");
              }
            }}
            variant="contained"
          >
            Sign In
          </Button>
        </DialogActions>
      </Dialog>

      {/* Cart Button */}
      <div className="fixed bottom-4 right-4">
        <Button
          variant="contained"
          startIcon={<ShoppingCart />}
          className="shadow-lg"
          onClick={() => setIsCartOpen(true)}
        >
          Cart
        </Button>
      </div>

      {/* Cart Drawer */}
      <Drawer
        anchor="right"
        open={isCartOpen}
        onClose={() => setIsCartOpen(false)}
      >
        <div className="w-80 p-4">
          <Typography variant="h6">Your Cart</Typography>
          <Divider className="my-2" />
          <List>
            {cart.map((item) => (
              <ListItem key={item.id} className="flex flex-col items-start">
                <ListItemText
                  primary={`${item.name} x${item.quantity}`}
                  secondary={`Rs. ${item.price * item.quantity}`}
                />
              </ListItem>
            ))}
            {cart.length === 0 && (
              <Typography variant="body2" className="text-center text-gray-500">
                Cart is empty
              </Typography>
            )}
          </List>
        </div>
      </Drawer>
    </div>
  );
};
