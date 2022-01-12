import { Button, styled } from "@mui/material";
import { FunctionComponent } from "react";

interface PencilProps {
  canvasContext: CanvasRenderingContext2D | null;
}

const PencilButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

const Pencil: FunctionComponent<PencilProps> = ({ canvasContext }) => {
  const onClick = () => {
    if (canvasContext) {
      canvasContext.globalCompositeOperation = "source-over";
    }
  };

  return <PencilButton onClick={onClick}>Pencil</PencilButton>;
};

export default Pencil;
