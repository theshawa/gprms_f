import { Box, Button, Stack, Typography } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReservationContext } from "../context";

type FormInputs = {
  reservationDate: Dayjs;
};

export const DateStep: FC = () => {
  const { control, handleSubmit, reset } = useForm<FormInputs>();
  const { setCurrentStep, data, setData } = useReservationContext();

  useEffect(() => {
    reset({
      reservationDate: data.reservationDate ? data.reservationDate : dayjs(),
    });
  }, [data]);

  const onSubmit = (data: FormInputs) => {
    setData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(2);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 xl:gap-20">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Typography variant="h6">Select Reserving Date</Typography>
        <Box
          width={"max-content"}
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            gap: 2,
          }}
        >
          <LocalizationProvider dateAdapter={AdapterDayjs}>
            <Controller
              name="reservationDate"
              control={control}
              rules={{
                required: "Please select a reservation date",
              }}
              render={({ field: { onChange, value } }) => (
                <DateCalendar
                  value={value ?? null}
                  onChange={(newValue) => {
                    console.log({ newValue });
                    onChange(newValue);
                  }}
                  disablePast
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        <Stack direction={"row"} spacing={2}>
          <Button
            onClick={() => {
              setCurrentStep(0);
            }}
            className="w-max"
          >
            Back
          </Button>
          <Button type="submit" className="w-max" variant="contained">
            Next
          </Button>
        </Stack>
      </form>
      <img src="/rooftoplounge.jpg" className="w-full aspect-square rounded-2xl" alt="" />
    </div>
  );
};
