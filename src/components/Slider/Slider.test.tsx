import { render, screen } from "utils/test-utils";
import { Slider } from "@/components";

describe("Slider", () => {
  render(
    <Slider setPainterState={() => {}} canvasContext={null} lineWidth={4} />
  );

  it("renders the canvas", async () => {
    await screen.findByTestId("slider");
  });
});
