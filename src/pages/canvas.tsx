import { useState, useRef } from "react";
import { Container, styled, Toolbar, useTheme } from "@mui/material";
import {
  Canvas,
  ConnectButton,
  CanvasTools,
  MintNFTButton,
} from "@/components";
import { useAppSelector } from "src/redux/app/hooks";
import { PainterState } from "src/utils/types/canvas";

const CanvasContainer = styled(Container)({
  display: "flex",
  flexDirection: "column",
  height: "100vh",
  alignItems: "center",
  justifyContent: "center",
});

const CanvasPage = () => {
  const {
    palette: { primary },
  } = useTheme();
  const address = useAppSelector(({ web3 }) => web3.data.address);
  // State of the paint brush
  const [painterState, setPainterState] = useState<PainterState>({
    isPainting: false,
    userStrokeStyle: primary.main,
    line: [],
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

  return (
    <CanvasContainer>
      {address ? (
        <div>
          <Canvas
            canvasRef={canvasRef}
            painterState={painterState}
            setPainterState={setPainterState}
            address={address}
            canvasContext={canvasContext}
            setCanvasContext={setCanvasContext}
          />
          <Toolbar sx={{ alignItems: "flex-start" }}>
            <CanvasTools
              setPainterState={setPainterState}
              canvasContext={canvasContext}
              isErasing={isErasing}
              lineWidth={lineWidth}
              canvasRef={canvasRef}
            />
            <MintNFTButton canvasRef={canvasRef.current} />
          </Toolbar>
        </div>
      ) : (
        <ConnectButton />
      )}
    </CanvasContainer>
  );
};

export default CanvasPage;
