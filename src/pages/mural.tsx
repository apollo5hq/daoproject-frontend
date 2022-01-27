import { useState, useRef, useMemo } from "react";
import { styled, useTheme } from "@mui/material";
import { ConnectButton, Drawer } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppDispatch, useAppSelector } from "src/redux/app/hooks";
import { createMural, updatePlot } from "src/redux/features/murals/muralsSlice";
import Typography from "@mui/material/Typography";
import Fade from "@mui/material/Fade";
import Button from "@mui/material/Button";
import ContainerComp from "@mui/material/Container";
import Grid from "@mui/material/Grid";
import Plot from "src/components/Plot";
import MuralPlot from "src/components/MuralPlot";

const Container = styled(ContainerComp)({
  display: "flex",
  flexDirection: "column",
  alignItems: "center",
  paddingTop: 50,
});

export default function () {
  const {
    palette: { primary },
  } = useTheme();
  const { address: userAddress } = useAppSelector((state) => state.web3.data);
  const { murals } = useAppSelector((state) => state.murals);
  const dispatch = useAppDispatch();
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

  const [counter, setCounter] = useState(0);

  const selectedPlot = useMemo(() => {
    if (murals.length === 0) return;
    return murals[0].plots.find(({ user }) => user === userAddress);
  }, [murals]);

  const onCreate = () => {
    const newMural = {
      plots: [
        { id: 1, user: "", width: 150, height: 150, isComplete: false },
        { id: 2, user: "", width: 150, height: 150, isComplete: false },
        { id: 3, user: "", width: 150, height: 150, isComplete: false },
        { id: 4, user: "", width: 150, height: 150, isComplete: false },
        { id: 5, user: "", width: 150, height: 150, isComplete: false },
        { id: 6, user: "", width: 150, height: 150, isComplete: false },
        { id: 7, user: "", width: 150, height: 150, isComplete: false },
        { id: 8, user: "", width: 150, height: 150, isComplete: false },
        { id: 9, user: "", width: 150, height: 150, isComplete: false },
        { id: 10, user: "", width: 150, height: 150, isComplete: false },
      ],
      width: 750,
      height: 450,
    };
    dispatch(createMural(newMural));
  };

  const onSelect = (id: number) => {
    let mural = { ...murals[0] };
    const plots = [...murals[0].plots];
    const plot = plots.find(({ user }) => user === (userAddress as string));
    if (plot) {
      let oldPlot = { ...plot };
      oldPlot.user = "";
      plots.splice(oldPlot.id - 1, 1, oldPlot);
    }
    let selectedPlot = { ...plots[id - 1] };
    selectedPlot.user = userAddress as string;
    plots.splice(id - 1, 1, selectedPlot);
    mural.plots = plots;
    dispatch(updatePlot({ mural }));
  };

  if (murals.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
        }}
      >
        <Button onClick={onCreate} variant="contained">
          Create mural
        </Button>
      </div>
    );
  }

  const onSubmit = () => {
    if (!selectedPlot || !visualCanvasRef.current) return;
    const plot = document.getElementById(
      selectedPlot.id.toString()
    ) as HTMLCanvasElement;
    const context = plot.getContext("2d");
    context?.drawImage(visualCanvasRef.current, 0, 0);
    let mural = { ...murals[0] };
    const plots = [...murals[0].plots];
    let updatedPlot = { ...plots[selectedPlot.id - 1] };
    updatedPlot.user = "";
    updatedPlot.isComplete = true;
    plots.splice(selectedPlot.id - 1, 1, updatedPlot);
    mural.plots = plots;
    setRestoreState({ array: [], index: -1 });
    dispatch(updatePlot({ mural }));
    setCounter(counter + 1);
  };

  if (!userAddress) {
    return (
      <div
        style={{
          height: "100vh",
          justifyContent: "center",
          alignItems: "center",
          display: "flex",
          flexDirection: "column",
        }}
      >
        <ConnectButton />
      </div>
    );
  }

  return (
    <Container>
      {murals.map(({ plots }, index) => (
        <div key={index}>
          <Grid key={index} container sx={{ width: 750 }}>
            {plots.map(({ id, width, height, user, isComplete }) => (
              <Grid item key={id}>
                <div
                  onClick={() => !isComplete && onSelect(id)}
                  style={{ width, height }}
                >
                  <Plot
                    isComplete={isComplete}
                    id={id}
                    width={width}
                    height={height}
                    user={user}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
          <Fade in={counter === 1}>
            <Typography paddingTop={3} align="center">
              You can select and draw on multiple plots 😆
            </Typography>
          </Fade>
        </div>
      ))}
      {selectedPlot && (
        <div
          style={{
            paddingTop: 35,
            justifyContent: "center",
            alignItems: "center",
            display: "flex",
            flexDirection: "column",
          }}
        >
          <MuralPlot
            hiddenCanvasRef={hiddenCanvasRef}
            width={150}
            height={150}
            visualCanvasRef={visualCanvasRef}
            painterState={painterState}
            setPainterState={setPainterState}
            setRestoreState={setRestoreState}
          />
          <Typography gutterBottom style={{ paddingTop: 10 }} align="center">
            Draw here!
          </Typography>
          <Button onClick={onSubmit} variant="contained">
            Submit plot
          </Button>
        </div>
      )}
      <Drawer
        restoreState={restoreState}
        hiddenCanvasRef={hiddenCanvasRef}
        visualCanvasRef={visualCanvasRef}
        setPainterState={setPainterState}
        setRestoreState={setRestoreState}
        isErasing={isErasing}
        lineWidth={lineWidth}
        eraserRadius={eraserRadius}
      />
    </Container>
  );
}
