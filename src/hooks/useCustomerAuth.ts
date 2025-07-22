import { customerAuthAtom } from "@/atoms/customer-auth";
import { useAtom } from "jotai";

export const useCustomerAuth = () => {
  const [auth, setAuth] = useAtom(customerAuthAtom);

  return { auth, setAuth };
};
