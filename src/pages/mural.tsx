import { useState, useRef } from "react";
import { styled, useTheme } from "@mui/material";
import { Canvas, MintNFTButton, Drawer, ConnectButton } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppSelector } from "src/redux/app/hooks";
import useMediaQuery from "@mui/material/useMediaQuery";
import ContainerComp from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";
import Plot from "src/components/Plot";

const Container = styled(ContainerComp)({
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
  const plots = [
    { id: 1 },
    { id: 2 },
    { id: 3 },
    { id: 4 },
    { id: 5 },
    { id: 6 },
    { id: 7 },
    { id: 8 },
    { id: 9 },
    { id: 10 },
  ];

  // useIsomorphicLayoutEffect(() => {
  //   if (!communityCanvasRef.current) return;
  //   // Here we set up the properties each canvas element.
  //   const width = 750;
  //   const height = 450;
  //   communityCanvasRef.current.width = width;
  //   communityCanvasRef.current.height = height;
  //   const communityContext = communityCanvasRef.current.getContext("2d");
  //   if (!communityContext) return;
  //   communityContext.fillStyle = "white";
  //   communityContext.fillRect(
  //     0,
  //     0,
  //     communityCanvasRef.current.width,
  //     communityCanvasRef.current.height
  //   );

  //   // Draw grid showing available parts of canvas for people to draw on
  //   const plotSize = 150; // In pixels
  //   // Draw grid and get number of rows and columns
  //   for (let r = 1; r < height / plotSize; r++) {
  //     communityContext.beginPath();
  //     communityContext.moveTo(0, r * plotSize);
  //     communityContext.lineTo(width, r * plotSize);
  //     communityContext.stroke();
  //   }
  //   for (let c = 1; c < width / plotSize; c++) {
  //     communityContext.beginPath();
  //     communityContext.moveTo(c * plotSize, 0);
  //     communityContext.lineTo(c * plotSize, height);
  //     communityContext.stroke();
  //   }
  // }, []);

  return (
    <Container>
      <Grid container sx={{ width: 750 }}>
        {plots.map(({ id }) => (
          <Grid item key={id}>
            <div style={{ width: 150, height: 150 }}>
              <Plot />
            </div>
          </Grid>
        ))}
      </Grid>
    </Container>
  );
}
