import { Button, styled } from "@mui/material";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { PainterState } from "src/utils/types/canvas";

interface EraserProps {
  canvasContext: CanvasRenderingContext2D | null;
  isErasing: boolean;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
}

const EraseButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

const Eraser: FunctionComponent<EraserProps> = ({
  canvasContext,
  isErasing,
  setPainterState,
}) => {
  const onClick = () => {
    if (canvasContext) {
      canvasContext.globalCompositeOperation = "destination-out";
      setPainterState((prevState) => {
        return { ...prevState, isErasing: true };
      });
    }
  };

  return (
    <div style={{ paddingLeft: 10 }}>
      <EraseButton
        variant={isErasing ? "contained" : "outlined"}
        onClick={onClick}
      >
        Eraser
      </EraseButton>
    </div>
  );
};

export default Eraser;
