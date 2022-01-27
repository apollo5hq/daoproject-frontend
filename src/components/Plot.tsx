import { CSSObject, styled, Theme } from "@mui/material";
import { useRef, useState } from "react";
import useIsomorphicLayoutEffect from "src/utils/useIsomorphicLayoutEffect";
import Typography from "@mui/material/Typography";
import { useRouter } from "next/router";

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

export default function ({ width, height }: { width: number; height: number }) {
  // Reference to the canvas
  const hiddenCanvasRef = useRef<HTMLCanvasElement>(null);
  const [isHovering, setIsHovering] = useState(false);
  const router = useRouter();

  useIsomorphicLayoutEffect(() => {
    if (!hiddenCanvasRef.current) return;
    // Here we set up the properties each canvas element.
    // const width = 150;
    // const height = 150;
    hiddenCanvasRef.current.width = width;
    hiddenCanvasRef.current.height = height;
  }, []);

  return (
    <Container isHovering={isHovering}>
      <Typography
        sx={{
          color: ({ palette }) => (isHovering ? palette.primary.main : "black"),
        }}
      >
        Not Claimed
      </Typography>
      <HiddenCanvas ref={hiddenCanvasRef} />
      <VisualCanvas
        onMouseDown={({ nativeEvent }) => {
          console.log(nativeEvent.offsetX, nativeEvent.offsetY);
          router
            .push("/plot", { query: { width, height } })
            .catch((e) => console.log(e));
        }}
        onMouseEnter={() => setIsHovering(true)}
        onMouseLeave={() => setIsHovering(false)}
      />
    </Container>
  );
}
