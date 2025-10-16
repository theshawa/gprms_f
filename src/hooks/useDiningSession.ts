import { diningSessionAtom, type DiningSession, type OrderRound } from "@/atoms/dining-session";
import { customerCartAtom } from "@/atoms/customer-cart";
import { useAtom } from "jotai";
import { useCustomerCart } from "./useCustomerCart";

export const useDiningSession = () => {
  const [diningSession, setDiningSession] = useAtom(diningSessionAtom);
  const [, setCartItems] = useAtom(customerCartAtom);
  const { cartItems } = useCustomerCart();

  const startDiningSession = (tableNumber: string) => {
    const newSession: DiningSession = {
      tableNumber,
      startedAt: new Date(),
      orderRounds: [],
      currentRoundId: 1,
      isFinished: false,
      isPaidOut: false,
    };
    setDiningSession(newSession);
  };

  const sendCurrentOrderToKitchen = () => {
    if (!diningSession || cartItems.length === 0) return;

    const newOrderRound: OrderRound = {
      id: diningSession.currentRoundId,
      items: [...cartItems],
      orderedAt: new Date(),
      status: 'preparing',
      estimatedTime: Math.ceil(Math.random() * 20) + 10, // Random time between 10-30 minutes
    };

    // Add order round to session
    const updatedSession: DiningSession = {
      ...diningSession,
      orderRounds: [...diningSession.orderRounds, newOrderRound],
      currentRoundId: diningSession.currentRoundId + 1,
    };

    setDiningSession(updatedSession);
    
    // Clear current cart for next round
    setCartItems([]);

    // Simulate kitchen status updates
    setTimeout(() => {
      updateOrderStatus(newOrderRound.id, 'cooking');
    }, 2000);

    setTimeout(() => {
      updateOrderStatus(newOrderRound.id, 'served');
    }, (newOrderRound.estimatedTime || 15) * 1000); // Convert minutes to milliseconds
  };

  const updateOrderStatus = (roundId: number, status: OrderRound['status']) => {
    if (!diningSession) return;

    const updatedSession: DiningSession = {
      ...diningSession,
      orderRounds: diningSession.orderRounds.map(round =>
        round.id === roundId ? { ...round, status } : round
      ),
    };

    setDiningSession(updatedSession);
  };

  const finishDining = () => {
    if (!diningSession) return;

    const updatedSession: DiningSession = {
      ...diningSession,
      isFinished: true,
    };

    setDiningSession(updatedSession);
  };

  const requestBill = () => {
    // This would typically notify the waiter
    console.log('Bill requested for table:', diningSession?.tableNumber);
    // In a real app, this would make an API call to notify staff
  };

  const getTotalAmount = () => {
    if (!diningSession) return 0;
    
    return diningSession.orderRounds.reduce((total, round) => {
      return total + round.items.reduce((roundTotal, item) => {
        return roundTotal + (item.dish.price * item.quantity);
      }, 0);
    }, 0);
  };

  const getCurrentRoundNumber = () => {
    return diningSession?.currentRoundId || 1;
  };

  const getActiveOrders = () => {
    if (!diningSession) return [];
    return diningSession.orderRounds.filter(round => round.status !== 'served');
  };

  const getServedOrders = () => {
    if (!diningSession) return [];
    return diningSession.orderRounds.filter(round => round.status === 'served');
  };

  return {
    diningSession,
    startDiningSession,
    sendCurrentOrderToKitchen,
    updateOrderStatus,
    finishDining,
    requestBill,
    getTotalAmount,
    getCurrentRoundNumber,
    getActiveOrders,
    getServedOrders,
  };
};
