import { useCustomerAuth } from "@/hooks/useCustomerAuth";
import { Button, InputAdornment, TextField } from "@mui/material";
import { useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { useReservationContext } from "../context";

type FormInputs = {
  customerName: string;
  customerPhone: string;
};

export const CustomerInfoStep: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const { auth } = useCustomerAuth();

  const { setCurrentStep, setData, data } = useReservationContext();

  const onSubmit = (data: FormInputs) => {
    setData((prev) => ({
      ...prev,
      customerName: data.customerName,
      customerPhone: `+94${data.customerPhone}`,
    }));
    setCurrentStep(1);
  };

  useEffect(() => {
    reset({
      customerName: data.customerName ? data.customerName : auth?.user.name || "",
      customerPhone: data.customerPhone
        ? data.customerPhone.replace("+94", "")
        : auth?.user.phoneNumber?.replace("+94", "") || "",
    });
  }, [data, auth]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 xl:gap-20">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-max">
        <TextField
          sx={{ flex: 1, mb: 1 }}
          {...register("customerName", { required: "Name is required" })}
          label="Name"
          placeholder="eg: James Phillips"
          margin="dense"
          fullWidth
          variant="filled"
          error={!!errors.customerName}
          helperText={errors.customerName?.message}
        />
        <TextField
          {...register("customerPhone", {
            required: "Phone number is required",
            pattern: {
              value: /^\d{9}$/,
              message: "Phone number must be exactly 9 digits. +94 prefix is automatically added.",
            },
          })}
          sx={{ flex: 1, mb: 5 }}
          label="Mobile Number"
          margin="dense"
          fullWidth
          placeholder="eg: 7123456789"
          type="tel"
          variant="filled"
          error={!!errors.customerPhone}
          helperText={
            errors.customerPhone?.message ||
            "We will validate your phone number via OTP at confirmation step."
          }
          slotProps={{
            input: {
              startAdornment: <InputAdornment position="start">+94</InputAdornment>,
            },
          }}
        />

        <Button type="submit" className="w-max" variant="contained">
          Next
        </Button>
      </form>
      <img src="/rooftoplounge.jpg" className="w-full aspect-square rounded-2xl" alt="" />
    </div>
  );
};
