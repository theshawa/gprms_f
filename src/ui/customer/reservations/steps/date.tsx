import { Box, Button, Stack, Typography, Alert, CircularProgress } from "@mui/material";
import { AdapterDayjs } from "@mui/x-date-pickers/AdapterDayjs";
import { DateCalendar } from "@mui/x-date-pickers/DateCalendar";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import dayjs, { Dayjs } from "dayjs";
import { useEffect, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReservationContext } from "../context";
import { useQuery } from "@tanstack/react-query";
import { CustomerReservationService } from "@/services/customer/reservation";

type FormInputs = {
  reservationDate: Dayjs;
};

export const DateStep: FC = () => {
  const { control, handleSubmit, reset } = useForm<FormInputs>();
  const { setCurrentStep, data, setData } = useReservationContext();

  // Fetch closed days
  const { data: closedDays = [], isLoading: isLoadingClosedDays } = useQuery({
    queryKey: ["customer", "reservation", "closed-days"],
    queryFn: () => CustomerReservationService.getClosedDays(),
  });

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

  // Function to check if a date is closed
  const shouldDisableDate = (date: Dayjs) => {
    const dateStr = date.format("YYYY-MM-DD");
    return closedDays.some(closedDay => {
      const closedDateStr = dayjs(closedDay.date).format("YYYY-MM-DD");
      return closedDateStr === dateStr && closedDay.isFullDay;
    });
  };

  if (isLoadingClosedDays) {
    return (
      <Box display="flex" justifyContent="center" alignItems="center" minHeight={400}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 xl:gap-20">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col gap-5">
        <Typography variant="h6">Select Reserving Date</Typography>
        
        {closedDays.length > 0 && (
          <Alert severity="info" sx={{ mb: 2 }}>
            Some dates are unavailable due to restaurant closures. Please select an available date.
          </Alert>
        )}
        
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
                  shouldDisableDate={shouldDisableDate}
                />
              )}
            />
          </LocalizationProvider>
        </Box>
        
        {closedDays.length > 0 && (
          <Box>
            <Typography variant="body2" color="text.secondary" gutterBottom>
              Closed Dates:
            </Typography>
            {closedDays.slice(0, 5).map((closedDay) => (
              <Typography key={closedDay.id} variant="caption" display="block" color="error">
                • {dayjs(closedDay.date).format("MMM DD, YYYY")} - {closedDay.reason}
              </Typography>
            ))}
            {closedDays.length > 5 && (
              <Typography variant="caption" color="text.secondary">
                ... and {closedDays.length - 5} more
              </Typography>
            )}
          </Box>
        )}
        
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
