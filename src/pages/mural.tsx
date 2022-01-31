import { useState, useRef, useMemo, useEffect } from "react";
import { GetServerSideProps, GetServerSidePropsContext } from "next";
import { styled, useTheme } from "@mui/material";
import { AlignCenter, ConnectButton, Drawer } from "@/components";
import { PainterState, RestoreState } from "src/utils/types/canvas";
import { useAppDispatch, useAppSelector } from "src/redux/app/hooks";
import {
  createMural,
  getMurals,
  Mural,
  Plot as PlotType,
  updatePlot,
} from "src/redux/features/murals/muralsSlice";
import { supabase } from "../lib/initSupabase";
import CircularProgress from "@mui/material/CircularProgress";
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

export default function ({
  murals: muralsSSR,
}: {
  murals: (Mural & { plots: PlotType[] })[];
  error?: string;
}) {
  const {
    palette: { primary },
  } = useTheme();
  const { address: userAddress } = useAppSelector((state) => state.web3.data);
  const { murals, loading } = useAppSelector((state) => state.murals);
  const [isCreatingMural, setIsCreatingMural] = useState(false);
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

  useEffect(() => {
    dispatch(getMurals(muralsSSR));
  }, []);

  useEffect(() => {
    const subscription = supabase
      .from<Mural & { plots: PlotType[] }>("murals")
      .on("INSERT", async ({ new: newMural }) => {
        // Dispatch mural with plots to redux store
        dispatch(createMural({ ...newMural }));
      })
      .subscribe();
    subscription.onError((e: any) => {
      console.log(e);
    });
    return () => {
      supabase.removeSubscription(subscription);
    };
  }, []);

  const onCreate = async () => {
    setIsCreatingMural(!isCreatingMural);
    const plots = JSON.stringify([
      {
        id: 1,
        width: 150,
        height: 150,
      },
      {
        id: 2,
        width: 150,
        height: 150,
      },
      {
        id: 3,
        width: 150,
        height: 150,
      },
      {
        id: 4,
        width: 150,
        height: 150,
      },
      {
        id: 5,
        width: 150,
        height: 150,
      },
      {
        id: 6,
        width: 150,
        height: 150,
      },
      {
        id: 7,
        width: 150,
        height: 150,
      },
      {
        id: 8,
        width: 150,
        height: 150,
      },
      { id: 9, width: 150, height: 150 },
      {
        id: 10,
        width: 150,
        height: 150,
      },
    ]);
    // Add mural to db
    const newMural = {
      width: 750,
      height: 300,
      columns: 5,
      rows: 2,
      plots,
    };
    try {
      await supabase.from<Mural & { plots: string }>("murals").insert(newMural);
      setIsCreatingMural(!isCreatingMural);
    } catch (e) {
      console.log("creating error");
      console.log(e);
      setIsCreatingMural(!isCreatingMural);
    }
  };

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
      <AlignCenter>
        <ConnectButton />
      </AlignCenter>
    );
  }

  // Show loader if murals are being fetched or if a mural is being created
  if (loading || isCreatingMural) {
    <AlignCenter>
      <CircularProgress />;
    </AlignCenter>;
  }

  // If no mural is created allow user to create one
  if (murals.length === 0) {
    return (
      <AlignCenter>
        <Button onClick={onCreate} variant="contained">
          Create mural
        </Button>
      </AlignCenter>
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
            width={selectedPlot.width}
            height={selectedPlot.height}
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

// Fetch murals server side
export const getServerSideProps: GetServerSideProps = async (
  _ctx: GetServerSidePropsContext
) => {
  try {
    const { body } = await supabase
      .from<Mural & { plots: string }>("murals")
      .select();
    if (body) {
      const murals: (Mural & { plots: PlotType[] })[] = [];
      for (const mural of body) {
        const { plots: plotsJSON } = mural;
        murals.push({ ...mural, plots: JSON.parse(plotsJSON) });
      }
      return { props: { murals } };
    }
    return { props: { murals: [] } };
  } catch (e) {
    console.log(e);
    return { props: { murals: [], error: "Error server side" } };
  }
};
