import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/pages/index";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

describe("Home", () => {
  it("lets user check in if minimum details are given", async () => {
    const user = userEvent.setup();
    render(<Home />);
    const heading = screen.getByRole("heading", {
      name: /Bausenberg Check-in/i,
    });
    expect(heading).toBeInTheDocument();

    expect(screen.getByRole("button")).toBeDisabled();

    await user.type(screen.getByRole("textbox"), "Foo Bar");
    expect(screen.getByRole("button")).toBeDisabled();

    await user.click(screen.getByLabelText("RML"));
    expect(screen.getByRole("button")).toBeEnabled();
  });
});
