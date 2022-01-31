import { FunctionComponent } from "react";
import { styled } from "@mui/material/styles";

const Container = styled("div")({
  height: "100vh",
  justifyContent: "center",
  alignItems: "center",
  display: "flex",
  flexDirection: "column",
});

const AlignCenter: FunctionComponent = ({ children }) => {
  return <Container>{children}</Container>;
};

export default AlignCenter;
