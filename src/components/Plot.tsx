import { CSSObject, styled, Theme } from "@mui/material";
import { useRef, useState } from "react";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";
import Typography from "@mui/material/Typography";

const HiddenCanvas = styled("canvas")({
  position: "absolute",
  zIndex: 1,
  left: 0,
  top: 0,
});

const VisualCanvas = styled("canvas")({
  position: "absolute",
  zIndex: 2,
  left: 0,
  top: 0,
});

const mouseOverMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("background", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.enteringScreen,
  }),
  background: "linear-gradient(white, white 50%, #333 50%, #333)",
  backgroundPosition: "100% 100%",
});

const mouseLeaveMixin = (theme: Theme): CSSObject => ({
  transition: theme.transitions.create("background", {
    easing: theme.transitions.easing.sharp,
    duration: theme.transitions.duration.leavingScreen,
  }),
});

const Container = styled("div", {
  shouldForwardProp: (prop) => prop !== "isHovering",
})<{ isHovering: boolean }>(({ theme, isHovering }) => ({
  position: "relative",
  background: "linear-gradient(white, white 50%, black 50%, black)",
  backgroundSize: "100% 200%",
  display: "flex",
  justifyContent: "center",
  alignItems: "center",
  height: 150,
  width: 150,
  ...(isHovering && {
    ...mouseOverMixin(theme),
  }),
  ...(!isHovering && {
    ...mouseLeaveMixin(theme),
  }),
}));

// A fancy function to shorten someones wallet address, no need to show the whole thing.
const shortenAddress = (str: string) => {
  return str.substring(0, 6) + "..." + str.substring(str.length - 4);
};

export default function ({
  width,
  height,
  artist,
  id,
  isComplete,
  imageData,
}: {
  width: number;
  height: number;
  artist: string | null;
  id: number;
  isComplete: boolean;
  imageData: ImageData | null;
}) {
  // Reference to the canvas
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);

  useIsomorphicLayoutEffect(() => {
    if (!hiddenCanvasRef.current) return;
    // Here we set up the properties each canvas element.a
    hiddenCanvasRef.current.width = width;
    hiddenCanvasRef.current.height = height;
    // If plot is complete, put the image data
    if (imageData) {
      const hiddenContext = hiddenCanvasRef.current.getContext("2d");
      if (!hiddenContext) return;
      hiddenContext.fillStyle = "white";
      hiddenContext.fill();
      hiddenContext.putImageData(imageData, 0, 0);
    }
  }, []);

  return (
    <Container isHovering={isHovering}>
      {artist && !isComplete && (
        <Typography
          sx={{
            color: ({ palette }) =>
              isHovering ? palette.primary.main : "black",
          }}
        >
          {shortenAddress(artist)}
        </Typography>
      )}
      <HiddenCanvas id={id.toString()} ref={hiddenCanvasRef} />
      <VisualCanvas
        onMouseDown={({ nativeEvent }) => {
          console.log(nativeEvent.offsetX, nativeEvent.offsetY);
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
    </Container>
  );
}
