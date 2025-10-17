import { Button, Stack, TextField } from "@mui/material";
import { useEffect, type FC } from "react";
import { useForm } from "react-hook-form";
import { useReservationContext } from "../context";

type FormInputs = {
  notes: string;
};

export const SpecialNotesStep: FC = () => {
  const {
    handleSubmit,
    register,
    formState: { errors },
    reset,
  } = useForm<FormInputs>();

  const { setCurrentStep, setData, data } = useReservationContext();

  const onSubmit = (data: FormInputs) => {
    setData((prev) => ({
      ...prev,
      ...data,
    }));
    setCurrentStep(4);
  };

  useEffect(() => {
    reset({
      notes: data.notes,
    });
  }, [data]);
  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 gap-10 xl:gap-20">
      <form onSubmit={handleSubmit(onSubmit)} className="flex flex-col h-max gap-5">
        <TextField
          sx={{ flex: 1, mb: 1 }}
          {...register("notes")}
          label="Special Notes"
          placeholder="Any special requests or notes..."
          margin="dense"
          multiline
          rows={4}
          fullWidth
          variant="filled"
          error={!!errors.notes}
          helperText={errors.notes?.message}
        />

        <Stack direction={"row"} spacing={2}>
          <Button
            onClick={() => {
              setCurrentStep(2);
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
