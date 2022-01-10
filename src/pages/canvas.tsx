import { useState, useRef, MouseEvent, useEffect } from "react";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";
import { v4 } from "uuid";
import { StreamrClient } from "streamr-client";

interface Position {
  offsetX: number;
  offsetY: number;
}

interface PainterState {
  isPainting: boolean;
  userStrokeStyle: string;
  guestStrokeStyle: string;
  line: { start: Position; stop: Position }[];
  userId: string;
  prevPos: Position;
}

const Canvas = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [
    { isPainting, userStrokeStyle, guestStrokeStyle, line, userId, prevPos },
    setPainterState,
  ] = useState<PainterState>({
    isPainting: false,
    // Different stroke styles to be used for user and guest
    userStrokeStyle: "#EE92C2",
    guestStrokeStyle: "#F0C987",
    line: [],
    // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
    userId: v4(),
    prevPos: { offsetX: 0, offsetY: 0 },
  });

  const [streamrClient, setStreamrClient] = useState<StreamrClient>();

  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const onMouseDown = ({
    nativeEvent,
  }: MouseEvent<HTMLCanvasElement, globalThis.MouseEvent>) => {
    const { offsetX, offsetY } = nativeEvent;
    setPainterState((prevState) => {
      return { ...prevState, isPainting: true, prevPos: { offsetX, offsetY } };
    });
  };

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
        // const { line: prevLine } = prevState;
        const newLine = line.concat(positionData);
        return { ...prevState, line: newLine };
      });
      paint(prevPos, offSetData, userStrokeStyle);
    }
  };
  const endPaintEvent = () => {
    if (isPainting) {
      setPainterState((prevState) => {
        return { ...prevState, isPainting: false };
      });
      sendPaintData();
    }
  };

  const paint = (prevPos: Position, currPos: Position, strokeStyle: string) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
    if (canvasRef.current) {
      if (canvasContext) {
        canvasContext.beginPath();
        canvasContext.strokeStyle = strokeStyle;
        // Move the the prevPosition of the mouse
        canvasContext.moveTo(x, y);
        // Draw a line to the current position of the mouse
        canvasContext.lineTo(offsetX, offsetY);
        // Visualize the line using the strokeStyle
        canvasContext.stroke();
      }
    }
    prevPos = { offsetX, offsetY };
  };

  const sendPaintData = async () => {
    const body = {
      line,
      userId,
    };
    console.log(body);
    // // We use the native fetch API to make requests to the server
    // const req = await fetch("http://localhost:4000/paint", {
    //   method: "post",
    //   body: JSON.stringify(body),
    //   headers: {
    //     "content-type": "application/json",
    //   },
    // });
    // const res = await req.json();
    // console.log(res);
    setPainterState((prevState) => {
      return { ...prevState, line: [] };
    });
  };

  useIsomorphicLayoutEffect(() => {
    // Here we set up the properties of the canvas element.
    if (canvasRef.current) {
      canvasRef.current.width = 1000;
      canvasRef.current.height = 800;
      let ctx = canvasRef.current.getContext("2d");
      if (ctx) {
        ctx.lineJoin = "round";
        ctx.lineCap = "round";
        ctx.lineWidth = 5;
      }
      setCanvasContext(ctx);
    }
  }, []);

  useEffect(() => {
    createClient();
  }, []);

  const createClient = () => {
    const { ethereum } = window;
    if (ethereum) {
      const client = new StreamrClient({
        auth: {
          ethereum,
        },
      });
      setStreamrClient(client);
    }
  };

  return (
    <canvas
      // We use the ref attribute to get direct access to the canvas element.
      ref={canvasRef}
      style={{ background: "black" }}
      onMouseDown={onMouseDown}
      onMouseLeave={endPaintEvent}
      onMouseUp={endPaintEvent}
      onMouseMove={onMouseMove}
    />
  );
};

export default Canvas;
