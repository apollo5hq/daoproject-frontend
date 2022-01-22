import { Button, Container as ContainerComp, styled } from "@mui/material";
import { Dispatch, FunctionComponent, SetStateAction } from "react";
import { PainterState } from "src/utils/types/canvas";
import { Slider } from "@/components";

interface PencilProps {
  canvasContext: CanvasRenderingContext2D | null;
  isErasing: boolean;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  lineWidth: number;
}

const PencilButton = styled(Button)({
  textTransform: "none",
  height: 35,
});

const Container = styled(ContainerComp)({});

const Pencil: FunctionComponent<PencilProps> = ({
  canvasContext,
  isErasing,
  setPainterState,
  lineWidth,
}) => {
  const onClick = () => {
    if (canvasContext) {
      canvasContext.globalCompositeOperation = "source-over";
      setPainterState((prevState) => {
        return { ...prevState, isErasing: false };
      });
    }
  };

  return (
    <Container>
      <PencilButton
        variant={isErasing ? "outlined" : "contained"}
        onClick={onClick}
      >
        Pencil
      </PencilButton>
      <Slider
        lineWidth={lineWidth}
        canvasContext={canvasContext}
        setPainterState={setPainterState}
      />
    </Container>
  );
};

export default Pencil;
