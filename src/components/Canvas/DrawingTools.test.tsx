import { render, screen, fireEvent } from "utils/test-utils";
import { DrawingTool } from "@/components";

describe("DrawingTool", () => {
  render(<DrawingTool name="Eraser" variant="outlined" onClick={() => {}} />);
  let button: HTMLElement;
  it("renders the drawing tool", async () => {
    button = await screen.findByTestId("drawingTool");
  });

  it("clicking drawing tool results in click action", async () => {
    fireEvent.click(button);
  });
});
