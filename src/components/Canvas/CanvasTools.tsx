import { Dispatch, RefObject, SetStateAction, useState } from "react";
import { Slider, DrawingTool } from "@/components";
import { Color, ColorResult, SketchPicker } from "react-color";
import { PainterState } from "src/utils/types/canvas";
import { useTheme, styled, Button } from "@mui/material";

interface Tools {
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  isErasing: boolean;
  lineWidth: number;
  canvasRef: RefObject<HTMLCanvasElement>;
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

const ClearButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

export default function ({
  canvasContext,
  setPainterState,
  isErasing,
  lineWidth,
  canvasRef,
}: Tools) {
  const {
    palette: { primary },
  } = useTheme();
  // State for color picker
  const [colorPickerState, setColorPickerState] = useState<Color>(primary.main);

  // Sets color of the pencil and changes the color of the picker
  const onChangeComplete = (value: ColorResult) => {
    setPainterState((prevState) => {
      return { ...prevState, userStrokeStyle: value.hex };
    });
    setColorPickerState(value.rgb);
  };

  const onClick = () => {
    if (!canvasContext || !canvasRef.current) return;
    canvasContext.fillStyle = "black";
    canvasContext.fillRect(
      0,
      0,
      canvasRef.current.width,
      canvasRef.current.height
    );
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
          <DrawingTool
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
            name="Eraser"
          />
          <div style={{ padding: 5 }}>
            <ClearButton variant="outlined" onClick={onClick}>
              Clear
            </ClearButton>
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
