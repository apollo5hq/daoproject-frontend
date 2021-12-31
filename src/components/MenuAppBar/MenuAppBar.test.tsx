import { render, screen } from "utils/test-utils";
import { MenuAppBar } from "@/components";

describe("MenuAppBar", () => {
  render(<MenuAppBar />);

  it("renders the MenuAppBar section", async () => {
    await screen.findByTestId("menu-app-bar");
  });
});
