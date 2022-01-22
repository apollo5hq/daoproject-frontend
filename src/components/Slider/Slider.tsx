import { Box as BoxComp, Slider, styled } from "@mui/material";
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

const Box = styled(BoxComp)({
  height: 250,
  justifyContent: "center",
  display: "flex",
  alignItems: "center",
});

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
    <Box sx={{ paddingTop: 2 }}>
      <Slider
        orientation="vertical"
        size="medium"
        aria-label="Slider"
        defaultValue={4}
        value={lineWidth}
        getAriaValueText={valuetext}
        valueLabelDisplay="auto"
        step={1}
        marks
        min={1}
        max={10}
        onChangeCommitted={onChange}
      />
    </Box>
  );
}
