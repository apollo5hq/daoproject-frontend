import { useState } from "react";
import { Container, styled, useTheme } from "@mui/material";
import { Canvas, ConnectButton, CanvasTools } from "@/components";
import { useAppSelector } from "src/redux/app/hooks";
import { v4 } from "uuid";
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
    palette: { primary, secondary },
  } = useTheme();
  const address = useAppSelector(({ web3 }) => web3.data.address);
  // State of the paint brush
  const [painterState, setPainterState] = useState<PainterState>({
    isPainting: false,
    // Different stroke styles to be used for user and guest
    userStrokeStyle: primary.main,
    guestStrokeStyle: secondary.main,
    line: [],
    // v4 creates a unique id for each user. We used this since there's no auth to tell users apart
    userId: address ? address : v4(),
    prevPos: { offsetX: 0, offsetY: 0 },
    isErasing: false,
    lineWidth: 4,
  });
  const { isErasing, lineWidth } = painterState;

  // Canvas context
  const [canvasContext, setCanvasContext] =
    useState<CanvasRenderingContext2D | null>(null);

  return (
    <CanvasContainer>
      {address ? (
        <div>
          <Canvas
            painterState={painterState}
            setPainterState={setPainterState}
            address={address}
            canvasContext={canvasContext}
            setCanvasContext={setCanvasContext}
          />
          <CanvasTools
            setPainterState={setPainterState}
            canvasContext={canvasContext}
            isErasing={isErasing}
            lineWidth={lineWidth}
          />
        </div>
      ) : (
        <ConnectButton />
      )}
    </CanvasContainer>
  );
};

export default CanvasPage;
