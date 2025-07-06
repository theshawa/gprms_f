export enum StaffRole {
  Admin = "Admin",
  Waiter = "Waiter",
  KitchenManager = "KitchenManager",
  Cashier = "Cashier",
}

export const getEndpointForRole = (role: StaffRole): string => {
  switch (role) {
    case StaffRole.Admin:
      return "admin";
    case StaffRole.Waiter:
      return "waiter";
    case StaffRole.KitchenManager:
      return "kitchen-manager";
    case StaffRole.Cashier:
      return "cashier";
    default:
      throw new Error(`Unknown role for getEndpointForRole function: ${role}`);
  }
};

export const getNameForRole = (role: StaffRole): string => {
  switch (role) {
    case StaffRole.Admin:
      return "Admin";
    case StaffRole.Waiter:
      return "Waiter";
    case StaffRole.KitchenManager:
      return "Kitchen Manager";
    case StaffRole.Cashier:
      return "Cashier";
    default:
      throw new Error(`Unknown role for getNameForRole function: ${role}`);
  }
};
