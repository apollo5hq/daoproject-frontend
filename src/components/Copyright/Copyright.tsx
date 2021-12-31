import * as React from "react";
import Typography from "@mui/material/Typography";
import MuiLink from "@mui/material/Link";

export default function Copyright() {
  return (
    <Typography
      data-testid="copyright"
      variant="body2"
      color="text.secondary"
      align="center"
    >
      {"Copyright © "}
      <MuiLink color="inherit" href="https://mui.com/">
        Company Name
      </MuiLink>{" "}
      2019.
    </Typography>
  );
}