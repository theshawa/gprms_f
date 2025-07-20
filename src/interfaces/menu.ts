import type { Meal } from "@/enums/meal";
import type { MenuSection } from "./menu-section";

export interface Menu {
  id: number;
  name: string;
  meal: Meal;
  description: string;
  menuSections: MenuSection[];
  isActive: boolean;
}
