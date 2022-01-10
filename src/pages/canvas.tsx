import { useState, useRef, MouseEvent, useEffect } from "react";
import { Container, styled } from "@mui/material";
import { ConnectButton } from "@/components";
import { useAppSelector } from "src/redux/app/hooks";
import { v4 } from "uuid";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";
import StreamrClient from "streamr-client";

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

const CanvasContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
});

const Canvas = () => {
  const address = useAppSelector(({ web3 }) => web3.data.address);
  // Reference to the canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);
  // State of the paint brush
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
    userId: address ? address : v4(),
    prevPos: { offsetX: 0, offsetY: 0 },
  });

  const [streamrClient, setStreamrClient] = useState<StreamrClient>();

  // Canvas context
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

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
    <CanvasContainer>
      {address ? (
        <canvas
          // We use the ref attribute to get direct access to the canvas element.
          ref={canvasRef}
          style={{ background: "black" }}
          onMouseDown={onMouseDown}
          onMouseLeave={endPaintEvent}
          onMouseUp={endPaintEvent}
          onMouseMove={onMouseMove}
        />
      ) : (
        <ConnectButton />
      )}
    </CanvasContainer>
  );
};

export default Canvas;
