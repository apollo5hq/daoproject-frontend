import { MouseEvent, Dispatch, SetStateAction, RefObject } from "react";
import { PainterState, Position, RestoreState } from "src/utils/types/canvas";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";

interface CanvasProps {
  painterState: PainterState;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  address: string | null;
  canvasContext: CanvasRenderingContext2D | null;
  setCanvasContext: Dispatch<SetStateAction<CanvasRenderingContext2D | null>>;
  canvasRef: RefObject<HTMLCanvasElement>;
  restoreState: RestoreState;
  setRestoreState: Dispatch<SetStateAction<RestoreState>>;
}

export default function (props: CanvasProps) {
  const {
    painterState,
    setPainterState,
    address,
    canvasContext,
    setCanvasContext,
    canvasRef,
    setRestoreState,
  } = props;
  const { isPainting, userStrokeStyle, line, lineWidth, prevPos } =
    painterState;

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
    if (isPainting) {
      const { offsetX, offsetY } = nativeEvent;
      const offSetData = { offsetX, offsetY };
      // Set the start and stop position of the paint event.
      const positionData = {
        start: { ...prevPos },
        stop: { ...offSetData },
      };
      // Add the position to the line array
      setPainterState((prevState) => {
        return { ...prevState, line: line.concat(positionData) };
      });
      paint(prevPos, offSetData, userStrokeStyle, lineWidth);
    }
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
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    if (canvasContext) {
      canvasContext.beginPath();
      canvasContext.lineWidth = lineWidth;
      canvasContext.strokeStyle = strokeStyle;
      // Move the the prevPosition of the mouse
      canvasContext.moveTo(x, y);
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
    // Here we set up the properties of the canvas element.
    if (canvasRef.current && address) {
      canvasRef.current.width = 1000;
      canvasRef.current.height = 800;
      let ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 4;
        ctx.fillStyle = "black";
        ctx.fillRect(0, 0, canvasRef.current.width, canvasRef.current.height);
      }
      setCanvasContext(ctx);
    }
  }, [address]);

  return (
    <canvas
      data-testid="canvas"
      // We use the ref attribute to get direct access to the canvas element.
      ref={canvasRef}
      onMouseDown={onMouseDown}
      onMouseLeave={endPaintEvent}
      onMouseUp={endPaintEvent}
      onMouseMove={onMouseMove}
    />
  );
}
