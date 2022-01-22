import { render, screen } from "utils/test-utils";
import { Canvas } from "@/components";

describe("Canvas", () => {
  render(
    <Canvas
      address=""
      setCanvasContext={() => {}}
      setPainterState={() => {}}
      painterState={{
        isPainting: false,
        userStrokeStyle: "",
        lineWidth: 4,
        prevPos: { offsetX: 0, offsetY: 0 },
        isErasing: false,
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
