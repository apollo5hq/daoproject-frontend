import { render, screen } from "utils/test-utils";
import { ConnectButton } from "@/components";

describe("ConnectButton", () => {
  render(<ConnectButton />);

  it("renders the connect button", async () => {
    await screen.findByTestId("connectButton");
  });
});
