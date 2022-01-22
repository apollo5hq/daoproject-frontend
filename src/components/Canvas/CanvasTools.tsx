import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { Eraser, Pencil, Slider } from "@/components";
import { Color, ColorResult, SketchPicker } from "react-color";
import { PainterState } from "src/utils/types/canvas";
import { useTheme, styled, Typography } from "@mui/material";

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
const CanvasTools: FunctionComponent<Tools> = ({
  canvasContext,
  setPainterState,
  isErasing,
  lineWidth,
}) => {
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
      <div style={{ paddingLeft: 10 }}>
        <Container>
          <Pencil
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
            lineWidth={lineWidth}
          />
          <Eraser
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
          />
        </Container>
        {/* <Typography sx={{ paddingTop: 1 }}>Thickness</Typography> */}
        {/* <Slider
          lineWidth={lineWidth}
          canvasContext={canvasContext}
          setPainterState={setPainterState}
        /> */}
      </div>
    </Container>
  );
};

export default CanvasTools;
