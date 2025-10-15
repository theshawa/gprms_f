import { formatDateTime } from "@/utils/time-format";
import { Stack, Typography } from "@mui/material";
import { useState, type FC } from "react";

export const NoficationItem: FC<{ content: string; time: string }> = ({ content, time }) => {
  const [showing, setShowing] = useState(false);
  return (
    <Stack onClick={() => setShowing((os) => !os)} gap={0.5}>
      <Typography variant="caption" color="textSecondary">
        {formatDateTime(time)}
      </Typography>
      <Typography variant="body2" className={`${showing ? "" : "line-clamp-2"}`}>
        {content}
      </Typography>
    </Stack>
  );
};
