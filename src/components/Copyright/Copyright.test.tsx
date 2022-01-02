import { render, screen } from "utils/test-utils";
import { Copyright } from "@/components";

describe("Copyright", () => {
  render(<Copyright />);

  it("renders the copyright section", async () => {
    await screen.findByTestId("copyright");
  });
});
