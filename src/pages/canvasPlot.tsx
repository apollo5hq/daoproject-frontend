import { Button } from "@mui/material";
import { useRef, MouseEvent, useState } from "react";
import { Position } from "src/utils/types/canvas";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";

export default function () {
  const plotCanvasRef = useRef<HTMLCanvasElement>(null);
  const sourceCanvasRef = useRef<HTMLCanvasElement>(null);

  const [painterState, setPainterState] = useState({
    isPainting: false,
    prevPos: { offsetX: 0, offsetY: 0 },
  });

  const { prevPos, isPainting } = painterState;

  // When user clicks
  const onMouseDown = ({
    nativeEvent,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    const { offsetX, offsetY } = nativeEvent;
    setPainterState({ isPainting: true, prevPos: { offsetX, offsetY } });
  };

  // When the user moves the mouse while holding click
  const onMouseMove = ({
    nativeEvent,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    if (!isPainting) return;
    const { offsetX, offsetY } = nativeEvent;
    const offSetData = { offsetX, offsetY };
    paint(prevPos, offSetData, "black", 10);
  };
  // When user releases click
  const endPaintEvent = async ({
    type,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    if (!isPainting) return;
    setPainterState((prevState) => {
      return { ...prevState, isPainting: false };
    });
  };

  // Paint the path of the cursor
  const paint = (
    prevPos: Position,
    currPos: Position,
    strokeStyle: string,
    lineWidth: number
  ) => {
    if (!plotCanvasRef.current) return;
    const plotContext = plotCanvasRef.current.getContext("2d");
    if (!plotContext) return;
    const { offsetX, offsetY } = currPos;
    const { offsetX: prevX, offsetY: prevY } = prevPos;
    plotContext.beginPath();
    plotContext.globalCompositeOperation = "source-over";
    plotContext.strokeStyle = strokeStyle;
    plotContext.lineWidth = lineWidth;
    // Move the the prevPosition of the mouse
    plotContext.moveTo(prevX, prevY);
    // Draw a line to the current position of the mouse
    plotContext.lineTo(offsetX, offsetY);
    // Visualize the line using the strokeStyle
    plotContext.stroke();
    setPainterState((prevState) => {
      return { ...prevState, prevPos: { offsetX, offsetY } };
    });
  };

  useIsomorphicLayoutEffect(() => {
    if (!plotCanvasRef.current || !sourceCanvasRef.current) return;
    plotCanvasRef.current.width = 350;
    plotCanvasRef.current.height = 350;
    sourceCanvasRef.current.width = 700;
    sourceCanvasRef.current.height = 700;

    const plotContext = plotCanvasRef.current.getContext("2d");
    const sourceContext = sourceCanvasRef.current.getContext("2d");
    if (!sourceContext || !plotContext) return;
    plotContext.fillStyle = "white";
    plotContext.fillRect(
      0,
      0,
      plotCanvasRef.current.width,
      plotCanvasRef.current.height
    );
    plotContext.lineJoin = "round";
    plotContext.lineCap = "round";
    plotContext.lineWidth = 4;
    sourceContext.fillStyle = "white";
    sourceContext.fillRect(
      0,
      0,
      sourceCanvasRef.current.width,
      sourceCanvasRef.current.height
    );
  }, []);

  const setPlot = () => {
    if (!sourceCanvasRef.current || !plotCanvasRef.current) return;
    const sourceContext = sourceCanvasRef.current.getContext("2d");
    if (!sourceContext) return;
    // Source is the plot user drew on
    const sourceX = 0;
    const sourceY = 0;
    const sourceWidth = 350;
    const sourceHeight = 350;
    // Destination is location on canvas the plot will be placed on
    const destWidth = sourceWidth;
    const destHeight = sourceHeight;
    // If splitting canvas into 4 pieces
    // 0, 0 is top left plot
    // 0, 350 is bottom left plot
    // 350, 0 is top right plot
    // 350, 350 is bottom right plot
    const destX = 350;
    const destY = 0;
    sourceContext.drawImage(
      plotCanvasRef.current,
      sourceX,
      sourceY,
      sourceWidth,
      sourceHeight,
      destX,
      destY,
      destWidth,
      destHeight
    );
  };

  return (
    <>
      <div
        style={{
          display: "flex",
          flexDirection: "row",
          width: "100%",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div style={{ padding: 10 }}>
          <canvas
            ref={plotCanvasRef}
            onMouseDown={onMouseDown}
            onMouseLeave={endPaintEvent}
            onMouseUp={endPaintEvent}
            onMouseMove={onMouseMove}
            width={350}
            height={350}
          />
        </div>
        <div style={{ padding: 10 }}>
          <canvas ref={sourceCanvasRef} width={700} height={700} />
        </div>
      </div>
      <Button variant="contained" onClick={setPlot}>
        Set plot
      </Button>
    </>
  );
}
