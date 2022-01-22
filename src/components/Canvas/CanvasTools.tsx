import { Dispatch, SetStateAction, useState } from "react";
import { Slider, DrawingTool } from "@/components";
import { Color, ColorResult, SketchPicker } from "react-color";
import { PainterState } from "src/utils/types/canvas";
import { useTheme, styled } from "@mui/material";

interface Tools {
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  isErasing: boolean;
  lineWidth: number;
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
  width: 200,
});

export default function ({
  canvasContext,
  setPainterState,
  isErasing,
  lineWidth,
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
        </Container>
        <Slider
          lineWidth={lineWidth}
          canvasContext={canvasContext}
          setPainterState={setPainterState}
        />
      </ToolsWrapper>
    </Container>
  );
}
