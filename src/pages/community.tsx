import { useState, useRef } from "react";
import { styled, useTheme } from "@mui/material";
import { Canvas, MintNFTButton, Drawer, ConnectButton } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppSelector } from "src/redux/app/hooks";
import useMediaQuery from "@mui/material/useMediaQuery";
import Confetti from "react-dom-confetti";
import Container from "@mui/material/Container";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";

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
  const communityCanvasRef = useRef<HTMLCanvasElement>(null);

  useIsomorphicLayoutEffect(() => {
    if (!communityCanvasRef.current) return;
    // Here we set up the properties each canvas element.
    const width = 1050;
    const height = 300;
    communityCanvasRef.current.width = width;
    communityCanvasRef.current.height = height;
    const communityContext = communityCanvasRef.current.getContext("2d");
    if (!communityContext) return;
    communityContext.fillStyle = "white";
    communityContext.fillRect(
      0,
      0,
      communityCanvasRef.current.width,
      communityCanvasRef.current.height
    );

    // Draw grid showing available parts of canvas for people to draw on
    const cellSize = 150;
    // let x = 0;
    // let y = 0;
    let rows: number = 0;
    let columns: number = 0;
    // Draw grid and get number of rows and columns
    for (let r = 1; r < height / cellSize; r++) {
      // plots.push({ id: plots.length+1, x: r*cellSize, y });
      rows = r;
      communityContext.beginPath();
      communityContext.moveTo(0, r * cellSize);
      communityContext.lineTo(width, r * cellSize);
      communityContext.stroke();
    }
    for (let c = 1; c < width / cellSize; c++) {
      // plots.push({ id: plots.length+1, x: c*cellSize, y });
      columns = c;
      communityContext.beginPath();
      communityContext.moveTo(c * cellSize, 0);
      communityContext.lineTo(c * cellSize, height);
      communityContext.stroke();
    }
  }, []);

  const calculatePlot = (x: number, y: number) => {
    const width = 1050;
    const height = 300;
    const columns = 7;
    const rows = 2;
  };

  return (
    <CanvasContainer>
      {/* <canvas /> */}
      <canvas
        ref={communityCanvasRef}
        onMouseDown={({ nativeEvent }) =>
          console.log(nativeEvent.offsetX, nativeEvent.offsetY)
        }
      />
    </CanvasContainer>
  );
}
