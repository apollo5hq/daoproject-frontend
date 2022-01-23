import { render, screen } from "utils/test-utils";
import { DrawingTool } from "@/components";

describe("DrawingTool", () => {
  render(<DrawingTool name="Eraser" variant="outlined" onClick={() => {}} />);

  it("renders the drawing tool", async () => {
    await screen.findByTestId("drawingTool");
  });
});
