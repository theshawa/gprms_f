import { getCloudinaryImageUrl } from "@/cloudinary";
import type { Dish } from "@/interfaces/dish";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogTitle,
  Divider,
  List,
  ListItem,
  ListItemAvatar,
  ListItemText,
} from "@mui/material";
import { type FC, Fragment } from "react";

export const MenuItemsListViewDialog: FC<{
  menuItems: Dish[];
  open: boolean;
  handleClose: () => void;
  menuName: string;
}> = ({ menuItems, open, handleClose, menuName }) => {
  return (
    <Dialog fullWidth maxWidth="xs" open={open}>
      <DialogTitle>Menu Items of {menuName}</DialogTitle>
      <DialogContent>
        <List>
          {menuItems.map((dish) => (
            <Fragment key={dish.id}>
              <ListItem>
                <ListItemAvatar>
                  <img
                    src={getCloudinaryImageUrl(dish.image)}
                    alt={dish.name}
                    className="size-12 object-cover mr-5"
                  />
                </ListItemAvatar>
                <ListItemText
                  primary={dish.name}
                  secondary={dish.description}
                />
              </ListItem>
              <Divider />
            </Fragment>
          ))}
        </List>
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
