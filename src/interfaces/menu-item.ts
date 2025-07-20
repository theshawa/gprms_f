import type { Dish } from "./dish";
import type { MenuSection } from "./menu-section";

export interface MenuItem {
  id: number;
  menuSectionId: number;
  menuSection: MenuSection;
  dishId: number;
  dish: Dish;
  position: number;
}
