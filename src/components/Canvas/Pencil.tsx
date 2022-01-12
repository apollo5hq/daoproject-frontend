import { Button, styled } from "@mui/material";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { PainterState } from "src/utils/types/canvas";

interface PencilProps {
  canvasContext: CanvasRenderingContext2D | null;
  isErasing: boolean;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
}

const PencilButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

const Pencil: FunctionComponent<PencilProps> = ({
  canvasContext,
  isErasing,
  setPainterState,
}) => {
  const onClick = () => {
    if (canvasContext) {
      canvasContext.globalCompositeOperation = "source-over";
      setPainterState((prevState) => {
        return { ...prevState, isErasing: false };
      });
    }
  };

  return (
    <PencilButton
      variant={isErasing ? "outlined" : "contained"}
      onClick={onClick}
    >
      Pencil
    </PencilButton>
  );
};

export default Pencil;
