// Customer services with proper backend endpoint structure
export { CustomerDineInService } from './dine-in';
export { CustomerOrderService } from './order';
export { CustomerDishesService } from './dishes';
export { CustomerWaiterService } from './waiter';
export { CustomerBillingService } from './billing';
export { CustomerTableSessionService } from './table-session';
export { CustomerAuthService } from './customer-auth';
export { CustomerTakeAwayService } from './take-away';
export { ReservationService } from './reservation';

// Legacy exports for backward compatibility
export { CustomerDineInService as DineInService } from './dine-in';
export { CustomerOrderService as OrderService } from './order';
export { CustomerDishesService as DishesService } from './dishes';
