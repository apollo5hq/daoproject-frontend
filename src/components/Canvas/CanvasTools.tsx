import { Slider, DrawingTool } from "@/components";
import { Color, ColorResult, SketchPicker } from "react-color";
import { Tools } from "src/utils/types/canvas";
import { styled } from "@mui/material";

interface DrawingTools extends Tools {
  onChangeComplete: (value: ColorResult) => void;
  colorPickerState: Color;
  clearCanvas: () => void;
  onUndoLast: () => void;
  clickPencil: () => void;
  clickEraser: () => void;
}

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
});

const ToolsWrapper = styled("div")({
  display: "flex",
  alignItems: "center",
  flexDirection: "column",
  height: 0,
  width: 300,
});

export default function (props: DrawingTools) {
  const {
    canvasContext,
    setPainterState,
    isErasing,
    lineWidth,
    colorPickerState,
    onChangeComplete,
    clearCanvas,
    onUndoLast,
    clickPencil,
    clickEraser,
  } = props;
  return (
    <Container>
      <SketchPicker
        color={colorPickerState}
        onChangeComplete={onChangeComplete}
      />
      <ToolsWrapper>
        <Container>
          <DrawingTool
            variant={isErasing ? "outlined" : "contained"}
            name="Pencil"
            onClick={clickPencil}
          />
          {/* <DrawingTool
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
            name="Eraser"
          /> */}
          <DrawingTool variant="outlined" name="Clear" onClick={clearCanvas} />
          <DrawingTool variant="outlined" name="Undo" onClick={onUndoLast} />
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
