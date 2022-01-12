import {
  useState,
  MouseEvent,
  useEffect,
  FunctionComponent,
  Dispatch,
  useRef,
  SetStateAction,
} from "react";
import { PainterState, Position } from "src/utils/types/canvas";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";
import StreamrClient from "streamr-client";

interface CanvasProps {
  painterState: PainterState;
  setPainterState: Dispatch<SetStateAction<PainterState>>;
  address: string | null;
  canvasContext: CanvasRenderingContext2D | null;
  setCanvasContext: Dispatch<SetStateAction<CanvasRenderingContext2D | null>>;
}

const Canvas: FunctionComponent<CanvasProps> = (props) => {
  // Reference to the canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const {
    painterState,
    setPainterState,
    address,
    canvasContext,
    setCanvasContext,
  } = props;
  const {
    isPainting,
    userStrokeStyle,
    guestStrokeStyle,
    line,
    userId,
    prevPos,
  } = painterState;
  const [streamrClient, setStreamrClient] = useState<StreamrClient>();

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
      paint(prevPos, offSetData, userStrokeStyle);
    }
  };
  // When user releases click
  const endPaintEvent = () => {
    if (isPainting) {
      setPainterState((prevState) => {
        return { ...prevState, isPainting: false };
      });
      sendPaintData();
    }
  };

  // Paint the path of the cursor
  const paint = (prevPos: Position, currPos: Position, strokeStyle: string) => {
    const { offsetX, offsetY } = currPos;
    const { offsetX: x, offsetY: y } = prevPos;
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
    setPainterState((prevState) => {
      return { ...prevState, prevPos: { offsetX, offsetY } };
    });
  };

  // Sends paint data to stream
  const sendPaintData = async () => {
    try {
      if (streamrClient) {
        const body = {
          line,
          userId,
        };
        // Publish using the stream id only
        await streamrClient.publish(
          "0x9bb53e7ecc52dea3498502d1755b2892d30b730e/painter",
          body
        );
        setPainterState((prevState) => {
          return { ...prevState, line: [] };
        });
      }
    } catch (e) {
      console.log(e);
    }
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
        ctx.lineWidth = 5;
      }
      setCanvasContext(ctx);
    }
  }, [address]);

  const handleStream = (data: any, metadata: any) => {
    // Do something with the data here!
    const { line, userId: guestId } = data;
    if (guestId !== userId) {
      line.forEach((position: { start: Position; stop: Position }) => {
        paint(position.start, position.stop, guestStrokeStyle);
      });
    }
  };

  useEffect(() => {
    if (streamrClient && address) {
      // Subscribe to a stream
      streamrClient
        .subscribe(
          {
            stream: "0x9bb53e7ecc52dea3498502d1755b2892d30b730e/painter",
          },
          handleStream
        )
        .catch((e) => console.log(e));
    } else {
      // Create client
      createClient();
    }
    return () => {
      if (streamrClient && address)
        streamrClient.unsubscribe({
          stream: "0x9bb53e7ecc52dea3498502d1755b2892d30b730e/painter",
        });
    };
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [streamrClient, address]);

  const createClient = async () => {
    try {
      const { ethereum } = window;
      if (ethereum) {
        const client = new StreamrClient({
          auth: {
            ethereum,
          },
          publishWithSignature: "never",
        });
        setStreamrClient(client);
      }
    } catch (e) {
      console.log(e);
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
