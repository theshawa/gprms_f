export enum StaffRole {
  Admin = "Admin",
  Waiter = "Waiter",
  KitchenManager = "KitchenManager",
  Cashier = "Cashier",
  Receptionist = "Receptionist",
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
    case StaffRole.Receptionist:
      return "receptionist";
    default:
      return "";
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
    case StaffRole.Receptionist:
      return "Receptionist";
    default:
      return "Unknown Role";
  }
};
