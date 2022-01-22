import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Slider, DrawingTool } from "@/components";
import { Color, ColorResult, SketchPicker } from "react-color";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useTheme, styled, Button } from "@mui/material";

interface Tools {
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  isErasing: boolean;
  lineWidth: number;
  canvasRef: RefObject<HTMLCanvasElement>;
  restoreState: RestoreState;
  setRestoreState: Dispatch<SetStateAction<RestoreState>>;
}

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
  flexGrow: 1,
});

const ToolsWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  height: 0,
  width: 300,
});

const DrawingToolButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

export default function ({
  canvasContext,
  setPainterState,
  isErasing,
  lineWidth,
  canvasRef,
  restoreState,
  setRestoreState,
}: Tools) {
  const {
    palette: { primary },
  } = useTheme();
  // State for color picker
  const [colorPickerState, setColorPickerState] = useState<Color>(primary.main);
  // State for undoing last draw
  const { index: restoreIndex, array: restoreArray } = restoreState;
  // Sets color of the pencil and changes the color of the picker
  const onChangeComplete = (value: ColorResult) => {
    setPainterState((prevState) => {
      return { ...prevState, userStrokeStyle: value.hex };
    });
    setColorPickerState(value.rgb);
  };

  // Clear the entire canvas
  const clearCanvas = () => {
    if (!canvasContext || !canvasRef.current) return;
    canvasContext.clearRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    canvasContext.globalCompositeOperation = "source-over";
    canvasContext.fillStyle = "white";
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
    // Need to reset the restore state as well
    setRestoreState(() => {
      return { array: [], index: -1 };
    });
  };

  // Undo last draw
  const onUndoLast = () => {
    if (!canvasContext) return;
    if (restoreIndex <= 0) {
      clearCanvas();
    } else {
      setRestoreState(({ index, array }) => {
        const newIndex = index - 1;
        const newArray = [...array];
        newArray.pop();
        canvasContext.putImageData(newArray[newIndex], 0, 0);
        return { index: newIndex, array: newArray };
      });
    }
  };

  return (
    <Container>
      <SketchPicker
        color={colorPickerState}
        onChangeComplete={onChangeComplete}
      />
      <ToolsWrapper>
        <Container>
          <DrawingTool
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
            name="Pencil"
          />
          {/* <DrawingTool
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
            name="Eraser"
          /> */}
          <div style={{ padding: 5 }}>
            <DrawingToolButton variant="outlined" onClick={clearCanvas}>
              Clear
            </DrawingToolButton>
          </div>
          <div style={{ padding: 5 }}>
            <DrawingToolButton variant="outlined" onClick={onUndoLast}>
              Undo
            </DrawingToolButton>
          </div>
        </Container>
        <div style={{ width: 225 }}>
          <Slider
            lineWidth={lineWidth}
            canvasContext={canvasContext}
            setPainterState={setPainterState}
          />
        </div>
      </ToolsWrapper>
    </Container>
  );
}
