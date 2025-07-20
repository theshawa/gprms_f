import {
  ArrowDownward,
  ArrowUpward,
  Delete,
  Edit,
  RemoveRedEye,
} from "@mui/icons-material";
import {
  Divider,
  IconButton,
  ListItem,
  ListItemIcon,
  ListItemText,
  Tooltip,
} from "@mui/material";
import { type FC, useState } from "react";
import type { FormMenuSection } from "../..";
import { ManageMenuSectionDialog } from "../../manage-menu-section-dialog";
import { MenuItemsListViewDialog } from "./dishes-list-view-dialog";

export const MenuSectionListItem: FC<{
  section: FormMenuSection;
  onSectionMoveUp: () => void;
  onSectionMoveDown: () => void;
  onSectionDelete: () => void;
  onSectionEdit: (updatedSection: FormMenuSection) => void;
  upDisabled?: boolean;
  downDisabled?: boolean;
}> = ({
  section,
  onSectionMoveUp,
  onSectionMoveDown,
  upDisabled,
  downDisabled,
  onSectionDelete,
  onSectionEdit,
}) => {
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [viewMenuItemsDialogOpen, setViewMenuItemsDialogOpen] = useState(false);
  return (
    <>
      <ListItem>
        <ListItemText
          primary={section.name}
          secondary={section.description || "No description available"}
        />
        <ListItemIcon>
          <Tooltip title="View Menu Items">
            <IconButton
              onClick={() => setViewMenuItemsDialogOpen(true)}
              size="small"
            >
              <RemoveRedEye fontSize="small" />
            </IconButton>
          </Tooltip>

          <Tooltip title="Move Up">
            <IconButton
              onClick={onSectionMoveUp}
              disabled={upDisabled}
              size="small"
            >
              <ArrowUpward fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Move Down">
            <IconButton
              onClick={onSectionMoveDown}
              disabled={downDisabled}
              size="small"
            >
              <ArrowDownward fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Edit">
            <IconButton size="small" onClick={() => setEditDialogOpen(true)}>
              <Edit fontSize="small" />
            </IconButton>
          </Tooltip>
          <Tooltip title="Remove">
            <IconButton onClick={onSectionDelete} color="error" size="small">
              <Delete fontSize="small" />
            </IconButton>
          </Tooltip>
        </ListItemIcon>
      </ListItem>
      <Divider />
      <ManageMenuSectionDialog
        open={editDialogOpen}
        handleClose={() => setEditDialogOpen(false)}
        editingSection={section}
        onAction={onSectionEdit}
      />
      <MenuItemsListViewDialog
        open={viewMenuItemsDialogOpen}
        handleClose={() => setViewMenuItemsDialogOpen(false)}
        menuName={section.name}
        menuItems={section.menuItems}
      />
    </>
  );
};
