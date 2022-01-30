import { useState, useRef, useMemo, useEffect } from "react";
import { styled, useTheme } from "@mui/material";
import { ConnectButton, Drawer } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppDispatch, useAppSelector } from "src/redux/app/hooks";
import {
  createMural,
  Mural,
  Plot as PlotType,
  updatePlot,
} from "src/redux/features/murals/muralsSlice";
import { supabase } from "../lib/initSupabase";
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
    const plot = murals[0].plots.find(({ artist }) => {
      if (!artist) return undefined;
      return artist === userAddress;
    });
    return plot;
  }, [murals]);

  const onCreate = async () => {
    try {
      const newMural = {
        width: 750,
        height: 450,
      };
      const { body: records } = await supabase
        .from<Mural>("murals")
        .insert(newMural);
      if (records) {
        const [record] = records;
        const muralId = Number(record.id);
        const plots = [
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
          {
            muralId,
            width: 150,
            height: 150,
          },
        ];
        for (const plot of plots) {
          await supabase.from<PlotType>("plots").insert(plot);
        }
      }
    } catch (e) {
      console.log(e);
    }
  };

  useEffect(() => {
    const subscription = supabase
      .from<PlotType>("plots")
      .on("INSERT", async ({ new: newPlot }) => {
        // dispatch(createMural(newMural));
      })
      .subscribe();
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const onSelect = (id: number) => {
    let mural = { ...murals[0] };
    const plots = [...murals[0].plots];
    const plot = plots.find(({ artist }) => {
      if (!artist) return undefined;
      return artist === (userAddress as string);
    });
    if (plot) {
      let oldPlot = { ...plot };
      oldPlot.artist = "";
      plots.splice(oldPlot.id - 1, 1, oldPlot);
    }
    let selectedPlot = { ...plots[id - 1] };
    selectedPlot.artist = userAddress as string;
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
    updatedPlot.artist = "";
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
            {plots.map(({ id, width, height, artist, isComplete }) => (
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
                    artist={artist}
                  />
                </div>
              </Grid>
            ))}
          </Grid>
          <Fade in={counter === 1}>
            <Typography paddingTop={3} align="center">
              Nice! Now select and draw on another one! 😆
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
