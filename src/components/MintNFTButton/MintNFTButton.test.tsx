import { render, screen } from "utils/test-utils";
import { MintNFTButton } from "@/components";

describe("MintButton", () => {
  render(<MintNFTButton canvasRef={null} />);

  it("render's the connect button since wallet isn't connected", async () => {
    await screen.findByTestId("connectButton");
  });
});
