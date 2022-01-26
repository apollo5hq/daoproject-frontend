import { render, screen } from "utils/test-utils";
import { Slider } from "@/components";

describe("Slider", () => {
  render(
    <Slider
      isErasing={true}
      eraserRadius={8}
      setPainterState={() => {}}
      canvasContext={null}
      lineWidth={4}
    />
  );

  it("renders the canvas", async () => {
    await screen.findByTestId("eraserSlider");
  });
});
