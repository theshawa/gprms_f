import type { Menu } from "./menu";
import type { MenuItem } from "./menu-item";

export interface MenuSection {
  id: number;
  position: number;
  menuId: number;
  menu: Menu;
  name: string;
  description: string;
  menuItems: MenuItem[];
}
