import { Button, Paper } from "@mui/material";
import type { FC } from "react";
import { Link } from "react-router-dom";

export const BottomBar: FC<{
  previous?: { link: string; name: string };
  next?: { link: string; name: string };
}> = ({ next, previous }) => {
  if (!next && !previous) {
    return null;
  }

  return (
    <Paper
      className="sticky bottom-0 bg-white z-50"
      sx={{
        display: "flex",
        justifyContent: "space-between",
        padding: 2,
        boxShadow: 3,
      }}
    >
      <Button disabled={!previous} size="large">
        {previous && <Link to={previous.link}>{previous.name}</Link>}
      </Button>
      {next && (
        <Button
          disabled={!next}
          size="large"
          color="primary"
          variant="contained"
        >
          {next && <Link to={next.link}>{next.name}</Link>}
        </Button>
      )}
    </Paper>
  );
};
