import { customerAuthAtom } from "@/atoms/customer-auth";
import { useAtom } from "jotai";

export const useCustomerAuth = () => {
  const [auth, setAuth] = useAtom(customerAuthAtom);

  const customer = auth?.user ?? null;
  const isLoggedIn = !!customer;

  return { auth, setAuth, customer, isLoggedIn };
};
