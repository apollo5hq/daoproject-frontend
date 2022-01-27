import { useState, useRef } from "react";
import { styled, useTheme } from "@mui/material";
import { Drawer, ConnectButton } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppSelector } from "src/redux/app/hooks";
import useMediaQuery from "@mui/material/useMediaQuery";
import Container from "@mui/material/Container";
import { useRouter } from "next/router";
import MuralPlot from "src/components/MuralPlot";

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

  const { query } = useRouter();

  return (
    <CanvasContainer>
      <MuralPlot
        visualCanvasRef={visualCanvasRef}
        painterState={painterState}
        setPainterState={setPainterState}
        setRestoreState={setRestoreState}
        hiddenCanvasRef={hiddenCanvasRef}
        height={Number(query.height)}
        width={Number(query.width)}
      />
      {!isMobile &&
        (userAddress ? (
          <></>
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
    </CanvasContainer>
  );
}
