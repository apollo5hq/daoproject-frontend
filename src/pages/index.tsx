import * as React from "react";
import Container from "@mui/material/Container";
import Typography from "@mui/material/Typography";
import Box from "@mui/material/Box";
import Link from "../components/Link";
import Copyright from "../components/Copyright";

export default function Index() {
  return (
    <Container maxWidth="sm">
      <Box sx={{ my: 4 }}>
        <Typography variant="h4" component="h1" gutterBottom>
          Next.js example
        </Typography>
        <Box>
          <Link href="/about" color="secondary">
            Go to the about page
          </Link>
        </Box>
        <Box>
          <Link href="/register" color="secondary">
            Go to the register page
          </Link>
        </Box>
        <Copyright />
      </Box>
    </Container>
  );
}
