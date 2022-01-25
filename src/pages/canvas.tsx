import { useState, useRef } from "react";
import { styled, useTheme } from "@mui/material";
import { Canvas, MintNFTButton, Drawer, ConnectButton } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppSelector } from "src/redux/app/hooks";
import useMediaQuery from "@mui/material/useMediaQuery";
import Confetti from "react-dom-confetti";
import Container from "@mui/material/Container";

const CanvasContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 50,
});

export default function () {
  const {
    palette: { primary },
    breakpoints,
  } = useTheme();
  const isMobile = useMediaQuery(breakpoints.down("sm"));
  const { address: userAddress } = useAppSelector((state) => state.web3.data);
  // State of the paint brush
  const [painterState, setPainterState] = useState<PainterState>({
    isPainting: false,
    userStrokeStyle: primary.main,
    prevPos: { offsetX: 0, offsetY: 0 },
    isErasing: false,
    lineWidth: 4,
    eraserRadius: 8,
  });
  const { isErasing, lineWidth, eraserRadius } = painterState;

  // Reference to the canvas
  const visualCanvasRef = useRef<HTMLCanvasElement>(null);
  // Reference to the actual canvas we are putting all the data on
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);

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

  return (
    <CanvasContainer>
      <Canvas
        visualCanvasRef={visualCanvasRef}
        painterState={painterState}
        setPainterState={setPainterState}
        setRestoreState={setRestoreState}
        hiddenCanvasRef={hiddenCanvasRef}
      />
      {!isMobile &&
        (userAddress ? (
          <MintNFTButton
            visualCanvasRef={visualCanvasRef.current}
            hasMinted={hasMinted}
            setHasMinted={setHasMinted}
            hiddenCanvasRef={hiddenCanvasRef.current}
          />
        ) : (
          <div style={{ paddingTop: 23 }}>
            <ConnectButton />
          </div>
        ))}
      <Drawer
        setPainterState={setPainterState}
        isErasing={isErasing}
        lineWidth={lineWidth}
        visualCanvasRef={visualCanvasRef}
        restoreState={restoreState}
        setRestoreState={setRestoreState}
        eraserRadius={eraserRadius}
        hiddenCanvasRef={hiddenCanvasRef}
      />
      <Confetti active={hasMinted} config={config} />
    </CanvasContainer>
  );
}
