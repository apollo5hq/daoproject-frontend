import { Box, Slider } from "@mui/material";
import { Dispatch, SetStateAction, SyntheticEvent } from "react";
import { PainterState } from "src/utils/types/canvas";

interface SliderProps {
  lineWidth: number;
  canvasContext: CanvasRenderingContext2D | null;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
}

function valuetext(value: number) {
  return value.toString();
}

export default function ({
  lineWidth,
  canvasContext,
  setPainterState,
}: SliderProps) {
  const onChange = (
    e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    if (Array.isArray(value)) {
      return;
    }

    if (canvasContext) {
      canvasContext.lineWidth = value;
      setPainterState((prevState) => {
        return { ...prevState, lineWidth: value };
      });
    }
  };

  return (
    <Box sx={{ paddingTop: 2, width: 150 }}>
      <Slider
        data-testid="slider"
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
    </Box>
  );
}
