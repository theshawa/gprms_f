import type { Customer } from "./customer";

export interface CustomerAuthState {
  accessToken: string;
  user: Customer;
}
