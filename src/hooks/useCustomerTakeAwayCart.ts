import { customerTakeAwayCartAtom } from "@/atoms/customer-takeaway-cart";
import type { Dish } from "@/interfaces/dish";
import { useAtom } from "jotai";

export const useCustomerTakeAwayCart = () => {
  const [cartItems, setCartItems] = useAtom(customerTakeAwayCartAtom);

  const increaseItemQuantity = (dish: Dish) => {
    const existingItemIndex = cartItems.findIndex(
      (item) => item.dish.id === dish.id
    );
    if (existingItemIndex < 0) {
      setCartItems([...cartItems, { dish, quantity: 1 }]);
      return;
    }
    const updatedCartItems = cartItems.map((item) =>
      item.dish.id === dish.id ? { ...item, quantity: item.quantity + 1 } : item
    );
    setCartItems(updatedCartItems);
  };

  const decreaseItemQuantity = (dish: Dish) => {
    const existingItem = cartItems.find((item) => item.dish.id === dish.id);
    if (!existingItem) return;

    if (existingItem.quantity === 1) {
      setCartItems(cartItems.filter((item) => item.dish.id !== dish.id));
      return;
    }

    const updatedCartItems = cartItems.map((item) =>
      item.dish.id === dish.id
        ? { ...item, quantity: Math.max(item.quantity - 1, 1) }
        : item
    );
    setCartItems(updatedCartItems);
  };

  const removeItemFromCart = (dish: Dish) => {
    setCartItems(cartItems.filter((item) => item.dish.id !== dish.id));
  };

  const clearCart = () => {
    setCartItems([]);
  };

  return {
    cartItems,
    increaseItemQuantity,
    decreaseItemQuantity,
    removeItemFromCart,
    clearCart,
  };
};
