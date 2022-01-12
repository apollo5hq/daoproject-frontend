import { Dispatch, FunctionComponent, SetStateAction, useState } from "react";
import { Eraser, Pencil } from "@/components";
import { styled } from "@mui/system";
import { Color, ColorResult, RGBColor, SketchPicker } from "react-color";
import { PainterState } from "src/utils/types/canvas";
import { useTheme } from "@mui/material";

interface Tools {
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
}

const Container = styled("div")({
  display: "flex",
  flexDirection: "row",
});
const CanvasTools: FunctionComponent<Tools> = ({
  canvasContext,
  setPainterState,
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
      <Pencil canvasContext={canvasContext} />
      <Eraser canvasContext={canvasContext} />
    </Container>
  );
};

export default CanvasTools;
