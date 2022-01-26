import { Box, Slider } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { PainterState } from "src/utils/types/canvas";

interface SliderProps {
  lineWidth: number;
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  isErasing: boolean;
  eraserRadius: number;
}

function valuetext(value: number) {
  return value.toString();
}

export default function ({
  lineWidth,
  canvasContext,
  setPainterState,
  isErasing,
  eraserRadius,
}: SliderProps) {
  const onChange = (
    e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    if (Array.isArray(value) || !canvasContext) return;
    setPainterState((prevState) => {
      return { ...prevState, lineWidth: value };
    });
  };

  const onChangeEraser = (
    e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    if (Array.isArray(value) || !canvasContext) return;
    setPainterState((prevState) => {
      return { ...prevState, eraserRadius: value };
    });
  };

  return (
    <Box sx={{ paddingTop: 2, width: 150 }}>
      {isErasing ? (
        <Slider
          data-testid="eraserSlider"
          size="medium"
          aria-label="Slider"
          defaultValue={4}
          value={eraserRadius}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          min={1}
          max={50}
          onChange={onChangeEraser}
        />
      ) : (
        <Slider
          data-testid="pencilSlider"
          size="medium"
          aria-label="Slider"
          defaultValue={4}
          value={lineWidth}
          getAriaValueText={valuetext}
          valueLabelDisplay="auto"
          min={1}
          max={50}
          onChange={onChange}
        />
      )}
    </Box>
  );
}
