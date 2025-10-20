import type { DiningTable } from "@/interfaces/dining-table";
import type { Menu } from "@/interfaces/menu";
import type { Order } from "@/interfaces/orders";
import { createContext } from "react";
import type { Socket } from "socket.io-client";
import type { WaiterInfo } from "@/services/customer/waiter";
import type { TableSession } from "@/services/customer/table-session";

export interface DineInContextData {
  // Core table and menu data
  diningTable: DiningTable;
  menu: Menu;
  
  // Socket connection for real-time updates
  socket: Socket | undefined;
  
  // Table session information
  tableSession?: TableSession;
  
  // Current order data
  currentOrder?: Order | null;
  
  // Assigned waiter information
  assignedWaiter?: WaiterInfo | null;
  
  // Helper methods for context actions
  refreshOrderStatus?: () => Promise<void>;
  refreshWaiterInfo?: () => Promise<void>;
  updateTableSession?: (session: Partial<TableSession>) => void;
}

export const Customer_DineInContext = createContext<DineInContextData | undefined>(
  undefined
);
