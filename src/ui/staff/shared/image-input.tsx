import { getCloudinaryImageUrl } from "@/cloudinary";
import {
  Box,
  Button,
  FormHelperText,
  Paper,
  Stack,
  Typography,
} from "@mui/material";
import { type FC, useEffect, useState } from "react";
import { useDropzone } from "react-dropzone";

export const ImageInput: FC<{
  label: string;
  value: File | null;
  onChange: (v: File | null) => void;
  defaultImageUrl?: string;
  cloudinary?: boolean;
  error?: string;
  helperText?: string;
}> = ({
  label,
  value,
  onChange,
  defaultImageUrl,
  cloudinary,
  error,
  helperText,
}) => {
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop(acceptedFiles) {
      onChange(acceptedFiles[0]);
    },
    accept: {
      "image/*": [],
    },
    multiple: false,
  });

  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [reset, setReset] = useState(true);

  useEffect(() => {
    if (value) {
      const objectUrl = URL.createObjectURL(value);
      setImageUrl(objectUrl);
      return () => URL.revokeObjectURL(objectUrl);
    } else if (reset && defaultImageUrl) {
      setImageUrl(defaultImageUrl);
    } else {
      setImageUrl(null);
    }
  }, [value, reset, defaultImageUrl]);

  return (
    <Stack my={2} spacing={1}>
      <Typography variant="body1" gutterBottom>
        {label}
      </Typography>
      {imageUrl ? (
        <>
          <img
            src={
              cloudinary && imageUrl === defaultImageUrl
                ? getCloudinaryImageUrl(imageUrl)
                : imageUrl
            }
            alt="Selected"
            style={{
              maxWidth: "100%",
              maxHeight: 200,
              objectFit: "contain",
              backgroundColor: "#eee",
              borderRadius: 4,
            }}
          />
          {value && (
            <Typography variant="caption" color="textSecondary">
              {`Image: ${value.name} (${(value.size / 1024).toFixed(2)} KB)`}
            </Typography>
          )}
          <Button
            variant="outlined"
            color="error"
            onClick={() => {
              onChange(null);
              setReset(false);
            }}
            sx={{ mt: 1 }}
          >
            Remove Image
          </Button>
        </>
      ) : (
        <Box
          {...getRootProps()}
          component={Paper}
          variant="outlined"
          sx={{
            width: "100%",
            height: 200,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            backgroundColor: "grey.200",
          }}
        >
          <input {...getInputProps()} />
          <Typography variant="body2" color="textSecondary">
            {isDragActive
              ? "Drop the image here..."
              : "Drag and drop an image here or click to select"}
          </Typography>
        </Box>
      )}
      {defaultImageUrl && !reset && (
        <Button
          variant="outlined"
          onClick={() => {
            onChange(null);
            setReset(true);
          }}
          sx={{ mt: 1 }}
        >
          Reset Image
        </Button>
      )}
      <FormHelperText error={!!error}>{error || helperText}</FormHelperText>
    </Stack>
  );
};
