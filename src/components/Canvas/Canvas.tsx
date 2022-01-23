import { styled } from "@mui/material";
import { MouseEvent, Dispatch, SetStateAction, RefObject, useRef } from "react";
import { PainterState, RestoreState, Position } from "src/utils/types/canvas";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";

interface CanvasProps {
  painterState: PainterState;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  address: string | null;
  canvasContext: CanvasRenderingContext2D | null;
  setCanvasContext: Dispatch<SetStateAction<CanvasRenderingContext2D | null>>;
  canvasRef: RefObject<HTMLCanvasElement>;
  nftCanvasRef: RefObject<HTMLCanvasElement>;
  setRestoreState: Dispatch<SetStateAction<RestoreState>>;
}

const NFTCanvas = styled("canvas")({
  position: "absolute",
  zIndex: 1,
  left: 0,
  top: 0,
});

const Canvas = styled("canvas")({
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

export default function (props: CanvasProps) {
  const {
    painterState,
    setPainterState,
    address,
    canvasContext,
    setCanvasContext,
    canvasRef,
    setRestoreState,
    nftCanvasRef,
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
      setRestoreState((prevState) => {
        const array = [...prevState.array];
        if (canvasRef.current && canvasContext) {
          array.push(
            canvasContext.getImageData(
              0,
              0,
              canvasRef.current.width,
              canvasRef.current.height
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
    if (!canvasContext) return;
    const { offsetX, offsetY } = currPos;
    const { offsetX: prevX, offsetY: prevY } = prevPos;
    canvasContext.beginPath();
    if (isErasing) {
      canvasContext.globalCompositeOperation = "destination-out";
      canvasContext.arc(offsetX, offsetY, eraserRadius, 0, Math.PI * 2);
      canvasContext.fill();
    } else {
      canvasContext.globalCompositeOperation = "source-over";
      canvasContext.strokeStyle = strokeStyle;
      canvasContext.lineWidth = lineWidth;
      // Move the the prevPosition of the mouse
      canvasContext.moveTo(prevX, prevY);
      // Draw a line to the current position of the mouse
      canvasContext.lineTo(offsetX, offsetY);
      // Visualize the line using the strokeStyle
      canvasContext.stroke();
    }
    setPainterState((prevState) => {
      return { ...prevState, prevPos: { offsetX, offsetY } };
    });
  };

  // This uses 'useEffect' server-side, then 'useLayoutEffect' on frontend
  useIsomorphicLayoutEffect(() => {
    if (!canvasRef.current || !address || !nftCanvasRef.current) return;
    // Here we set up the properties each canvas element.
    canvasRef.current.width = 700;
    canvasRef.current.height = 700;
    nftCanvasRef.current.width = 700;
    nftCanvasRef.current.height = 700;
    let nftCtx = nftCanvasRef.current.getContext("2d");
    let ctx = canvasRef.current.getContext("2d");
    if (nftCtx && ctx) {
      nftCtx.fillStyle = "white";
      nftCtx.fillRect(
        0,
        0,
        nftCanvasRef.current.width,
        nftCanvasRef.current.height
      );
      ctx.lineJoin = "round";
      ctx.lineCap = "round";
      ctx.lineWidth = 4;
    }
    setCanvasContext(ctx);
  }, []);

  return (
    <Container>
      <NFTCanvas ref={nftCanvasRef} />
      <Canvas
        data-testid="canvas"
        // We use the ref attribute to get direct access to the canvas element.
        ref={canvasRef}
        onMouseDown={onMouseDown}
        onMouseLeave={endPaintEvent}
        onMouseUp={endPaintEvent}
        onMouseMove={onMouseMove}
      />
    </Container>
  );
}
