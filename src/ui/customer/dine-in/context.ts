import type { DiningTable } from "@/interfaces/dining-table";
import type { Menu } from "@/interfaces/menu";
import { createContext } from "react";
import type { Socket } from "socket.io-client";

export const Customer_DineInContext = createContext<
  | {
      diningTable: DiningTable;
      menu: Menu;
      socket: Socket | undefined;
    }
  | undefined
>(undefined);
