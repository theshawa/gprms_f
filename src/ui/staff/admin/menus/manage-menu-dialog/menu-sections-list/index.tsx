import { Button, List, Stack, Typography } from "@mui/material";
import { type FC, useState } from "react";
import type { FormMenuSection } from "..";
import { ManageMenuSectionDialog } from "../manage-menu-section-dialog";
import { MenuSectionListItem } from "./menu-section-list-item";

export const MenuSectionsList: FC<{
  menuSections: FormMenuSection[];
  onNewSection: (section: FormMenuSection) => void;
  onMenuSectionDelete: (index: number) => void;
  onMenuSectionMoveUp: (index: number) => void;
  onMenuSectionMoveDown: (index: number) => void;
  onMenuSectionEdit: (index: number, updatedSection: FormMenuSection) => void;
}> = ({
  menuSections,
  onNewSection,
  onMenuSectionMoveUp,
  onMenuSectionMoveDown,
  onMenuSectionDelete,
  onMenuSectionEdit,
}) => {
  const [newMenuSectionDialogOpen, setNewMenuSectionDialogOpen] =
    useState(false);

  return (
    <>
      <Stack spacing={2} mt={2}>
        <Stack direction="row" spacing={2} alignItems="center">
          <Typography variant="subtitle1" flex={1}>
            Menu Sections
          </Typography>
          <Button
            onClick={() => setNewMenuSectionDialogOpen(true)}
            size="small"
            variant="outlined"
          >
            New Menu Section
          </Button>
        </Stack>
        {menuSections.length === 0 && (
          <Typography variant="body2" color="textSecondary" mt={1} mb={1}>
            No sections added
          </Typography>
        )}
        <List disablePadding>
          {menuSections.map((section, index) => (
            <MenuSectionListItem
              key={index}
              section={section}
              onSectionMoveUp={() => onMenuSectionMoveUp(index)}
              onSectionMoveDown={() => onMenuSectionMoveDown(index)}
              onSectionDelete={() => onMenuSectionDelete(index)}
              upDisabled={index === 0}
              downDisabled={index === menuSections.length - 1}
              onSectionEdit={(updatedSection) => {
                onMenuSectionEdit(index, updatedSection);
              }}
            />
          ))}
        </List>
      </Stack>
      <ManageMenuSectionDialog
        open={newMenuSectionDialogOpen}
        handleClose={() => setNewMenuSectionDialogOpen(false)}
        onAction={(section) => onNewSection(section)}
      />
    </>
  );
};
