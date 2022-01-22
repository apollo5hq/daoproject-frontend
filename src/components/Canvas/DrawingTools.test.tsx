import { render, screen } from "utils/test-utils";
import { DrawingTool } from "@/components";

describe("DrawingTool", () => {
  render(
    <DrawingTool
      isErasing={true}
      setPainterState={() => {}}
      name="Eraser"
      canvasContext={null}
    />
  );

  it("renders the drawing tool", async () => {
    await screen.findByTestId("drawingTool");
  });
});
