import { Box, Slider } from "@mui/material";
import { Dispatch, RefObject, SetStateAction, SyntheticEvent } from "react";
import { PainterState } from "src/utils/types/canvas";

interface SliderProps {
  lineWidth: number;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  isErasing: boolean;
  eraserRadius: number;
}

function valuetext(value: number) {
  return value.toString();
}

export default function ({
  lineWidth,
  setPainterState,
  isErasing,
  eraserRadius,
}: SliderProps) {
  const onChange = (
    _e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    if (Array.isArray(value)) return;
    setPainterState((prevState) => {
      return { ...prevState, lineWidth: value };
    });
  };

  const onChangeEraser = (
    e: Event | SyntheticEvent<Element, Event>,
    value: number | number[]
  ) => {
    if (Array.isArray(value)) return;
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
