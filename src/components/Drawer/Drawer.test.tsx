import { render, screen } from "utils/test-utils";
import { Drawer } from "@/components";

const props = {
  canvasContext: null,
  setPainterState: () => {},
  isErasing: false,
  lineWidth: 4,
  canvasRef: { current: null },
  restoreState: { array: [], index: -1 },
  setRestoreState: () => {},
};

describe("Drawer", () => {
  render(<Drawer {...props} />);

  it("renders the Drawer", async () => {
    await screen.findByTestId("drawer");
  });
});
