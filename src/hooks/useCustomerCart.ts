import { customerCartAtom } from "@/atoms/customer-cart";
import type { Dish } from "@/interfaces/dish";
import { useAtom } from "jotai";

export const useCustomerCart = () => {
  const [cartItems, setCartItems] = useAtom(customerCartAtom);

  const addItemToCart = (dish: Dish, quantity: number) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.dish.id === dish.id
    );

    if (existingItemIndex > -1) {
      const updatedCartItems = [...cartItems];
      updatedCartItems[existingItemIndex].quantity += quantity;
      setCartItems(updatedCartItems);
    } else {
      setCartItems([...cartItems, { dish, quantity }]);
    }
  };

  const removeItemFromCart = (dishId: number) => {
    setCartItems(cartItems.filter((item) => item.dish.id !== dishId));
  };

  const increaseItemQuantity = (dishId: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.dish.id === dishId ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
  };

  const decreaseItemQuantity = (dishId: number) => {
    const updatedCartItems = cartItems.map((item) =>
      item.dish.id === dishId
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updatedCartItems);
  };

  const clearCart = () => {
    setCartItems([]);
  };

  const placeOrder = () => {
    // Create a snapshot of current cart for order history
    const orderSnapshot = {
      id: Math.floor(Math.random() * 10000),
      items: [...cartItems],
      timestamp: new Date(),
      total: cartItems.reduce(
        (total, item) => total + item.dish.price * item.quantity,
        0
      ),
    };

    // Store in localStorage for persistence (you could also use a separate atom)
    const existingOrders = JSON.parse(
      localStorage.getItem("orderHistory") || "[]"
    );
    existingOrders.push(orderSnapshot);
    localStorage.setItem("orderHistory", JSON.stringify(existingOrders));

    // Don't clear cart immediately - let user decide
    return orderSnapshot;
  };

  return {
    cartItems,
    addItemToCart,
    removeItemFromCart,
    increaseItemQuantity,
    decreaseItemQuantity,
    clearCart,
    placeOrder,
  };
};
