import { Button, styled } from "@mui/material";
import { Dispatch, SetStateAction, useMemo } from "react";
import { PainterState } from "src/utils/types/canvas";

interface DrawingToolProps {
  canvasContext: CanvasRenderingContext2D | null;
  isErasing: boolean;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  name: "Pencil" | "Eraser";
}

const ToolButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

export default function ({
  canvasContext,
  isErasing,
  setPainterState,
  name,
}: DrawingToolProps) {
  const onClick = () => {
    if (!canvasContext) return;
    if (name === "Eraser") {
      canvasContext.globalCompositeOperation = "destination-out";
      setPainterState((prevState) => {
        return { ...prevState, isErasing: true };
      });
    } else {
      canvasContext.globalCompositeOperation = "source-over";
      setPainterState((prevState) => {
        return { ...prevState, isErasing: false };
      });
    }
  };

  // Change the variant of each
  const variant = useMemo(() => {
    if ((isErasing && name === "Eraser") || (!isErasing && name === "Pencil")) {
      return "contained";
    } else {
      return "outlined";
    }
  }, [isErasing]);

  return (
    <div style={{ padding: 5, paddingBottom: 0 }}>
      <ToolButton data-testid="drawingTool" variant={variant} onClick={onClick}>
        {name}
      </ToolButton>
    </div>
  );
}
