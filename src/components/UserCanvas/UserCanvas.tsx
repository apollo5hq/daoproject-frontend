import { MouseEvent, Dispatch, SetStateAction, RefObject } from "react";
import { PainterState, RestoreState, Position } from "src/utils/types/canvas";
import { styled } from "@mui/material";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";

interface UserCanvasProps {
  painterState: PainterState;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  setRestoreState: Dispatch<SetStateAction<RestoreState>>;
  hiddenCanvasRef: RefObject<HTMLCanvasElement>;
  visualCanvasRef: RefObject<HTMLCanvasElement>;
}

const HiddenCanvas = styled("canvas")({
  position: "absolute",
  zIndex: 1,
  left: 0,
  top: 0,
});

const VisualCanvas = styled("canvas")({
  position: "absolute",
  zIndex: 2,
  left: 0,
  top: 0,
});

const Container = styled("div")({
  background: "white",
  position: "relative",
  height: 700,
  width: 700,
});

export default (props: UserCanvasProps) => {
  const {
    painterState,
    setPainterState,
    setRestoreState,
    hiddenCanvasRef,
    visualCanvasRef,
  } = props;
  const {
    isPainting,
    userStrokeStyle,
    prevPos,
    lineWidth,
    isErasing,
    eraserRadius,
  } = painterState;

  // When user clicks
  const onMouseDown = ({
    nativeEvent,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    const { offsetX, offsetY } = nativeEvent;
    setPainterState((prevState) => {
      return { ...prevState, isPainting: true, prevPos: { offsetX, offsetY } };
    });
  };

  // When the user moves the mouse while holding click
  const onMouseMove = ({
    nativeEvent,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    if (!isPainting) return;
    const { offsetX, offsetY } = nativeEvent;
    const offSetData = { offsetX, offsetY };
    paint(prevPos, offSetData, userStrokeStyle, lineWidth);
  };
  // When user releases click
  const endPaintEvent = async ({
    type,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    if (!isPainting) return;
    setPainterState((prevState) => {
      return { ...prevState, isPainting: false };
    });
    if (type === "mouseup") {
      const visualContext = visualCanvasRef.current?.getContext("2d");
      if (!visualContext) return;
      setRestoreState((prevState) => {
        const array = [...prevState.array];
        if (visualCanvasRef.current && visualContext) {
          array.push(
            visualContext.getImageData(
              0,
              0,
              visualCanvasRef.current.width,
              visualCanvasRef.current.height
            )
          );
        }
        const index = prevState.index + 1;
        return { array, index };
      });
    }
  };

  // Paint the path of the cursor
  const paint = (
    prevPos: Position,
    currPos: Position,
    strokeStyle: string,
    lineWidth: number
  ) => {
    const visualContext = visualCanvasRef.current?.getContext("2d");
    if (!visualContext) return;
    const { offsetX, offsetY } = currPos;
    const { offsetX: prevX, offsetY: prevY } = prevPos;
    visualContext.beginPath();
    if (isErasing) {
      visualContext.globalCompositeOperation = "destination-out";
      visualContext.arc(offsetX, offsetY, eraserRadius, 0, Math.PI * 2);
      visualContext.fill();
    } else {
      visualContext.globalCompositeOperation = "source-over";
      visualContext.strokeStyle = strokeStyle;
      visualContext.lineWidth = lineWidth;
      // Move the the prevPosition of the mouse
      visualContext.moveTo(prevX, prevY);
      // Draw a line to the current position of the mouse
      visualContext.lineTo(offsetX, offsetY);
      // Visualize the line using the strokeStyle
      visualContext.stroke();
    }
    setPainterState((prevState) => {
      return { ...prevState, prevPos: { offsetX, offsetY } };
    });
  };

  // This uses 'useEffect' server-side, then 'useLayoutEffect' on frontend
  useIsomorphicLayoutEffect(() => {
    if (!visualCanvasRef.current || !hiddenCanvasRef.current) return;
    // Here we set up the properties each canvas element.
    visualCanvasRef.current.width = 700;
    visualCanvasRef.current.height = 700;
    hiddenCanvasRef.current.width = 700;
    hiddenCanvasRef.current.height = 700;
    const hiddenCtx = hiddenCanvasRef.current.getContext("2d");
    const visualCtx = visualCanvasRef.current.getContext("2d");
    if (hiddenCtx && visualCtx) {
      hiddenCtx.fillStyle = "white";
      hiddenCtx.fillRect(
        0,
        0,
        hiddenCanvasRef.current.width,
        hiddenCanvasRef.current.height
      );
      visualCtx.lineJoin = "round";
      visualCtx.lineCap = "round";
      visualCtx.lineWidth = 4;
    }
  }, []);

  return (
    <Container>
      <HiddenCanvas ref={hiddenCanvasRef} />
      <VisualCanvas
        data-testid="canvas"
        // We use the ref attribute to get direct access to the canvas element.
        ref={visualCanvasRef}
        onMouseDown={onMouseDown}
        onMouseLeave={endPaintEvent}
        onMouseUp={endPaintEvent}
        onMouseMove={onMouseMove}
      />
    </Container>
  );
};
