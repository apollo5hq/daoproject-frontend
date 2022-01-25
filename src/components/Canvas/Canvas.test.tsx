import { render, screen } from "utils/test-utils";
import { Canvas } from "@/components";

describe("Canvas", () => {
  render(
    <Canvas
      hiddenCanvasRef={{ current: null }}
      setCanvasContext={() => {}}
      setPainterState={() => {}}
      painterState={{
        isPainting: false,
        userStrokeStyle: "",
        lineWidth: 4,
        prevPos: { offsetX: 0, offsetY: 0 },
        isErasing: false,
        eraserRadius: 8,
      }}
      canvasContext={null}
      canvasRef={{ current: null }}
      setRestoreState={() => {}}
    />
  );

  it("renders the canvas", async () => {
    await screen.findByTestId("canvas");
  });
});
