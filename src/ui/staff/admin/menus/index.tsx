import { getBackendErrorMessage } from "@/backend";
import { Meal } from "@/enums/meal";
import { useAlert } from "@/hooks/useAlert";
import { MenusService } from "@/services/staff/menus";
import { MenuBook } from "@mui/icons-material";
import { Grid, Paper, Stack, Typography } from "@mui/material";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { type FC, useMemo, useState } from "react";
import { QKs } from "../../query-keys";
import { PageError } from "../../shared/page-error";
import { PageLayout } from "../../shared/page-layout";
import { PageLoader } from "../../shared/page-loader";
import { ManageMenuDialog } from "./manage-menu-dialog";
import { MenuCard } from "./menu-card";
import { SetMenuForMeal } from "./set-menu-for-meal";

export const Admin_MenusPage: FC = () => {
  const [newDialogOpen, setNewDialogOpen] = useState(false);

  const {
    data: menus,
    isPending,
    error,
  } = useQuery({
    queryKey: QKs.admin_menus,
    queryFn: () => MenusService.getAll(),
  });

  const queryClient = useQueryClient();

  const menusForMeals = useMemo(() => {
    const values: Record<Meal, number> = {
      Brunch: 0,
      Lunch: 0,
      HighTea: 0,
      Dinner: 0,
    };
    Object.values(Meal).forEach((meal) => {
      values[meal] = menus?.find((m) => m.isActive && m.meal === meal)?.id || 0;
    });

    return values;
  }, [menus]);

  const { showError } = useAlert();

  const { mutate: setMenuForMeal, isPending: isSettingMenu } = useMutation({
    mutationKey: ["set-menu-for-meal"],
    mutationFn: (data: { meal: Meal; menuId: number }) =>
      MenusService.setMenuForMeal(data.meal, data.menuId),
    onError: (err) => {
      showError(`Fialed to set menu for meal: ${getBackendErrorMessage(err)}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_menus });
    },
  });

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError title="menus list" error={error} />;
  }

  return (
    <>
      <PageLayout
        title="Menus"
        subtitle="Organize your restaurant space with different dining areas."
        button={{
          text: "New Menu",
          icon: <MenuBook />,
          onClick: () => setNewDialogOpen(true),
        }}
      >
        <Stack component={Paper} spacing={2} mb={5} p={3}>
          <Typography variant="subtitle1">Set Menus for Meals</Typography>
          <Grid container spacing={4} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
            {Object.values(Meal).map((meal) => (
              <SetMenuForMeal
                key={meal}
                meal={meal}
                menus={menus.filter((m) => m.meal === meal)}
                value={menusForMeals[meal]}
                disabled={isSettingMenu}
                onChange={(menuId) =>
                  setMenuForMeal({
                    meal,
                    menuId,
                  })
                }
              />
            ))}
          </Grid>
        </Stack>
        <Grid container spacing={2} columns={{ xs: 1, sm: 2, md: 3, lg: 4 }}>
          {menus.map((m) => (
            <Grid size={1} key={m.id}>
              <MenuCard menu={m} />
            </Grid>
          ))}
        </Grid>
        {menus.length === 0 && (
          <Typography variant="body2" color="textSecondary">
            No menus found. Click "New Menu" to create one.
          </Typography>
        )}
      </PageLayout>
      <ManageMenuDialog
        handleClose={() => setNewDialogOpen(false)}
        open={newDialogOpen}
      />
    </>
  );
};
