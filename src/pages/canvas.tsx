import { useState, useRef } from "react";
import { Container, styled, useTheme } from "@mui/material";
import { Canvas, ConnectButton, MintNFTButton, Drawer } from "@/components";
import { useAppSelector } from "src/redux/app/hooks";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import Confetti from "react-dom-confetti";

const CanvasContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  alignItems: "center",
  justifyContent: "flex-start",
  padding: 10,
});

export default function () {
  const {
    palette: { primary },
  } = useTheme();
  const address = useAppSelector(({ web3 }) => web3.data.address);
  // State of the paint brush
  const [painterState, setPainterState] = useState<PainterState>({
    isPainting: false,
    userStrokeStyle: primary.main,
    prevPos: { offsetX: 0, offsetY: 0 },
    isErasing: false,
    lineWidth: 4,
  });
  const { isErasing, lineWidth } = painterState;

  // Reference to the canvas
  const canvasRef = useRef<HTMLCanvasElement>(null);

  // Canvas context
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  const [restoreState, setRestoreState] = useState<RestoreState>({
    // Array of image data to undo
    array: [],
    // The index of the image data we want to undo
    index: -1,
  });

  // State for the message when a user claims the NFT
  const [hasMinted, setHasMinted] = useState<boolean>(false);

  const config = {
    angle: 210,
    spread: 360,
    startVelocity: 35,
    elementCount: 126,
    dragFriction: 0.12,
    duration: 4090,
    stagger: 17,
    width: "55px",
    height: "15px",
    perspective: "702px",
    colors: ["#a864fd", "#29cdff", "#78ff44", "#ff718d", "#fdff6a"],
  };

  if (!address) {
    return (
      <CanvasContainer sx={{ justifyContent: "center" }}>
        <ConnectButton />
      </CanvasContainer>
    );
  }

  return (
    <CanvasContainer>
      <Canvas
        canvasRef={canvasRef}
        painterState={painterState}
        setPainterState={setPainterState}
        address={address}
        canvasContext={canvasContext}
        setCanvasContext={setCanvasContext}
        setRestoreState={setRestoreState}
      />
      <MintNFTButton
        canvasRef={canvasRef.current}
        hasMinted={hasMinted}
        setHasMinted={setHasMinted}
      />
      <Drawer
        setPainterState={setPainterState}
        canvasContext={canvasContext}
        isErasing={isErasing}
        lineWidth={lineWidth}
        canvasRef={canvasRef}
        restoreState={restoreState}
        setRestoreState={setRestoreState}
      />
      <Confetti active={hasMinted} config={config} />
    </CanvasContainer>
  );
}
