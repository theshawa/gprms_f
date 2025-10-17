import { getCloudinaryImageUrl } from "@/cloudinary";
import { Meal } from "@/enums/meal";
import {
  Button,
  FormControl,
  FormHelperText,
  InputLabel,
  MenuItem,
  Select,
  Stack,
  TextField,
} from "@mui/material";
import { useEffect, useMemo, type FC } from "react";
import { Controller, useForm } from "react-hook-form";
import { useReservationContext } from "../context";

type FormInputs = {
  meal: Meal;
  diningAreaId: number;
  noOfSeats: number;
};

const DEFAULT_IMAGE_URL = "/reserve.png";

export const ReservationsInfoStep: FC = () => {
  const { setCurrentStep, setData, data, diningAreas } = useReservationContext();

  const {
    handleSubmit,
    formState: { errors },
    reset,
    watch,
    control,
  } = useForm<FormInputs>();

  useEffect(() => {
    reset({
      meal: data.meal,
      noOfSeats: data.noOfSeats,
      diningAreaId: data.diningAreaId,
    });
  }, [data]);

  const selectedDiningAreaId = watch("diningAreaId");

  const image = useMemo(() => {
    const selectedArea = diningAreas?.find((area) => area.id === selectedDiningAreaId);
    if (selectedArea) {
      return getCloudinaryImageUrl(selectedArea.image);
    }

    return DEFAULT_IMAGE_URL;
  }, [diningAreas, selectedDiningAreaId]);

  const onSubmit = (data: FormInputs) => {
    setData((prev) => ({
      ...prev,
      ...data,
      noOfSeats: Number(data.noOfSeats),
    }));
    setCurrentStep(3);
  };

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 xl:gap-20">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-max">
        <FormControl fullWidth variant="filled" error={!!errors.meal} margin="dense" sx={{ mb: 2 }}>
          <InputLabel id="meal-label">Select Meal</InputLabel>
          <Controller
            name="meal"
            control={control}
            rules={{ required: "Meal is required" }}
            render={({ field }) => (
              <Select {...field} labelId="meal-label" value={field.value || ""}>
                {Object.values(Meal).map((meal) => (
                  <MenuItem key={meal} value={meal}>
                    {meal}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.meal?.message}</FormHelperText>
        </FormControl>
        <FormControl
          fullWidth
          variant="filled"
          error={!!errors.diningAreaId}
          margin="dense"
          sx={{ mb: 2 }}
        >
          <InputLabel id="da-label">Select Dine-in Area</InputLabel>
          <Controller
            name="diningAreaId"
            control={control}
            rules={{
              validate: (value) => value !== 0 || "Dining area is required",
            }}
            render={({ field }) => (
              <Select {...field} labelId="da-label" value={field.value || ""}>
                {diningAreas.map((area) => (
                  <MenuItem key={area.id} value={area.id}>
                    {area.name}
                  </MenuItem>
                ))}
              </Select>
            )}
          />
          <FormHelperText>{errors.diningAreaId?.message}</FormHelperText>
        </FormControl>

        <TextField
          type="number"
          label="Number of Seats"
          variant="filled"
          margin="dense"
          fullWidth
          error={!!errors.noOfSeats}
          helperText={errors.noOfSeats?.message}
          {...control.register("noOfSeats", {
            required: "Number of seats is required",
            min: { value: 1, message: "At least 1 seat is required" },
            max: { value: 20, message: "Maximum 20 seats allowed" },
          })}
          sx={{ mb: 5 }}
        />

        <Stack direction={"row"} spacing={2}>
          <Button
            onClick={() => {
              setCurrentStep(1);
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
      <img src={image} className="w-full aspect-square object-cover rounded-2xl" alt="" />
    </div>
  );
};
