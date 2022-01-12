import { Button, styled } from "@mui/material";
import { FunctionComponent } from "react";

interface EraserProps {
  canvasContext: CanvasRenderingContext2D | null;
}

const EraseButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

const Eraser: FunctionComponent<EraserProps> = ({ canvasContext }) => {
  const onClick = () => {
    if (canvasContext) {
      canvasContext.globalCompositeOperation = "destination-out";
    }
  };

  return <EraseButton onClick={onClick}>Eraser</EraseButton>;
};

export default Eraser;
