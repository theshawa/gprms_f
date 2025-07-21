import { getBackendErrorMessage } from "@/backend";
import { getNameForMeal } from "@/enums/meal";
import { useAlert } from "@/hooks/useAlert";
import { useConfirmation } from "@/hooks/useConfirmation";
import type { Menu } from "@/interfaces/menu";
import { MenusService } from "@/services/staff/menus";
import { QKs } from "@/ui/staff/query-keys";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  CardHeader,
  Chip,
} from "@mui/material";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { type FC, useState } from "react";
import { ManageMenuDialog } from "../manage-menu-dialog";
import { MenuViewDialog } from "./menu-view-dialog";

export const MenuCard: FC<{ menu: Menu }> = ({ menu }) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewDialogOpen, setViewDialogOpen] = useState(false);

  const { showError, showSuccess } = useAlert();

  const queryClient = useQueryClient();

  const { mutate: deleteMenu, isPending: isDeleting } = useMutation({
    mutationFn: () => MenusService.delete(menu.id),
    mutationKey: ["admin_manageMenu_deleteMenu"],
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: QKs.admin_menus });
      showSuccess("Menu deleted successfully.");
    },
    onError: (err) => {
      showError(`Failed to delete menu: ${getBackendErrorMessage(err)}`);
    },
  });

  const { confirm } = useConfirmation();

  const mealsCount = menu.menuSections.reduce(
    (acc, section) => acc + section.menuItems.length,
    0
  );

  return (
    <>
      <Card>
        <CardHeader
          sx={{ textTransform: "capitalize" }}
          title={menu.name}
          subheader={getNameForMeal(menu.meal)}
        />
        <CardContent>
          <Chip
            size="small"
            label={`${menu.menuSections.length} section${
              menu.menuSections.length !== 1 ? "s" : ""
            }`}
          />
          <Chip
            size="small"
            label={`${mealsCount} dish${mealsCount !== 1 ? "es" : ""}`}
            sx={{ ml: 1 }}
          />
        </CardContent>
        <CardActions>
          <Button
            size="small"
            disabled={isDeleting}
            onClick={() => setViewDialogOpen(true)}
          >
            View
          </Button>
          <Button
            size="small"
            disabled={isDeleting}
            onClick={() => setEditDialogOpen(true)}
          >
            Edit{" "}
          </Button>
          <Button
            size="small"
            onClick={async () => {
              if (
                await confirm({
                  title: "Are you sure?",
                  message: `You are going to delete the menu '${menu.name}'. This action cannot be undone.`,
                  confirmButtonDanger: true,
                  confirmText: "Yes, Delete",
                })
              ) {
                deleteMenu();
              }
            }}
            disabled={isDeleting}
            color="error"
          >
            Delete
          </Button>
        </CardActions>
      </Card>
      <ManageMenuDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        editingMenu={menu}
      />
      <MenuViewDialog
        menu={menu}
        open={viewDialogOpen}
        handleClose={() => setViewDialogOpen(false)}
      />
    </>
  );
};
