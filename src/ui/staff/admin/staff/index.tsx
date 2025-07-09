import { type FC, useState } from "react";

import { StaffService } from "@/services/staff";
import { PageError } from "@/ui/staff/shared/page-error";
import { PageLoader } from "@/ui/staff/shared/page-loader";
import { PersonAdd } from "@mui/icons-material";
import {
  Paper,
  Table,
  TableBody,
  TableCell,
  TableContainer,
  TableHead,
  TableRow,
} from "@mui/material";
import { useQuery } from "@tanstack/react-query";
import { ItemsPageLayout } from "../../shared/items-page-layout";
import { AccountRow } from "./account-row";
import { ManageAccountDialog } from "./manage-account-dialog";

export const Admin_ManageStaffPage: FC = () => {
  const { isPending, error, data, refetch } = useQuery({
    queryKey: ["admin_manageStaff_home"],
    queryFn: () => StaffService.getStaffAccounts(),
  });

  const [newAccountDialogOpen, setNewAccountDialogOpen] = useState(false);

  if (isPending) {
    return <PageLoader />;
  }

  if (error) {
    return <PageError error={error} />;
  }

  return (
    <>
      <ItemsPageLayout
        title="Staff Accounts"
        subtitle="It's your restaurant's team members. You can add new staff and manage existing accounts."
        buttonText="New Staff Account"
        buttonIcon={<PersonAdd />}
        onButtonClick={() => setNewAccountDialogOpen(true)}
      >
        <TableContainer component={Paper}>
          <Table sx={{ minWidth: 1000 }} aria-label="staff accounts table">
            <TableHead>
              <TableRow>
                <TableCell width="20%">Role & Permissions</TableCell>
                <TableCell width="20%">Username</TableCell>
                <TableCell width="30%">Name</TableCell>
                <TableCell width="30%" align="right">
                  Actions
                </TableCell>
              </TableRow>
            </TableHead>
            <TableBody>
              {data.map((account, i) => (
                <AccountRow
                  key={i}
                  account={account}
                  onDelete={() => refetch()}
                />
              ))}
            </TableBody>
          </Table>
        </TableContainer>
      </ItemsPageLayout>
      <ManageAccountDialog
        open={newAccountDialogOpen}
        handleClose={() => setNewAccountDialogOpen(false)}
        onManageSuccess={() => refetch()}
      />
    </>
  );
};
