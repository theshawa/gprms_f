import { useAlert } from "@/hooks/useAlert";
import { QrCode } from "@mui/icons-material";
import {
  Button,
  Dialog,
  DialogActions,
  DialogContent,
  DialogContentText,
  DialogTitle,
} from "@mui/material";
import QRCode from "qrcode";
import type { FC } from "react";

export const DownloadQRDialog: FC<{
  open: boolean;
  handleClose: () => void;
  tableId: number;
}> = ({ handleClose, open, tableId }) => {
  const { showError, showSuccess } = useAlert();

  const downloadQR = async () => {
    const canvas = document.createElement("canvas");
    const size = 200;
    canvas.width = size;
    canvas.height = size;

    // Generate QR code using qrcode library (you'll need to install it)
    const url = `http://localhost:5173/dine-in/${tableId}`;

    try {
      await QRCode.toCanvas(canvas, url, {
        width: size,
        margin: 2,
        color: {
          dark: "#000000",
          light: "#FFFFFF",
        },
      });

      // Convert canvas to blob and download
      canvas.toBlob((blob) => {
        if (blob) {
          const link = document.createElement("a");
          link.download = `table-${tableId}-qr.png`;
          link.href = URL.createObjectURL(blob);
          link.click();
          URL.revokeObjectURL(link.href);
        }
      }, "image/png");
      handleClose();
      showSuccess("QR code generated successfully.");
    } catch (error) {
      showError(`Failed to generate QR code: ${error}`);
    }
  };

  return (
    <Dialog open={open}>
      <DialogTitle>Download QR Code</DialogTitle>

      <DialogContent>
        <DialogContentText>
          Click the button below to download the QR code for this dining table.
          You can then print it or share it with customers.
        </DialogContentText>
      </DialogContent>

      <DialogActions>
        <Button startIcon={<QrCode />} onClick={downloadQR} variant="contained">
          Download
        </Button>
        <Button onClick={handleClose}>Cancel</Button>
      </DialogActions>
    </Dialog>
  );
};
