import { getCloudinaryImageUrl } from "@/cloudinary";
import type { Menu } from "@/interfaces/menu";
import { formatCurrency } from "@/utils/currency-format";
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
  Stack,
  Typography,
} from "@mui/material";
import { type FC, Fragment } from "react";

export const MenuViewDialog: FC<{
  menu: Menu;
  open: boolean;
  handleClose: () => void;
}> = ({ menu, handleClose, open }) => {
  return (
    <Dialog fullWidth maxWidth="sm" open={open}>
      <DialogTitle sx={{ textTransform: "capitalize" }}>
        {menu.name}
      </DialogTitle>
      <DialogContent>
        <Typography variant="body1" color="textSecondary" sx={{ mb: 2 }}>
          {menu.description}
        </Typography>
        <Divider />
        {menu.menuSections.map((section) => (
          <Fragment key={section.id}>
            <Stack>
              <Typography variant="h6" sx={{ mt: 2 }}>
                {section.name}
              </Typography>
              <List disablePadding>
                {section.menuItems.map((mi) => (
                  <ListItem disableGutters key={mi.id} sx={{ ml: 2 }}>
                    <ListItemAvatar>
                      <img
                        src={getCloudinaryImageUrl(mi.dish.image)}
                        alt={mi.dish.name}
                        className="size-16 object-cover mr-5"
                      />
                    </ListItemAvatar>
                    <ListItemText
                      primary={mi.dish.name}
                      secondary={formatCurrency(mi.dish.price)}
                    />
                  </ListItem>
                ))}
              </List>
            </Stack>
            <Divider />
          </Fragment>
        ))}
      </DialogContent>
      <DialogActions>
        <Button onClick={handleClose}>Close</Button>
      </DialogActions>
    </Dialog>
  );
};
