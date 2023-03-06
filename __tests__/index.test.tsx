import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import Home from "@/pages/index";
import { saveIdToLocalStorage } from "@/util/local-storage";

jest.mock("next/router", () => ({
  useRouter: jest.fn(),
}));

beforeEach(() => {
  jest.resetAllMocks();
});

const useRouter = jest.spyOn(require("next/router"), "useRouter");
const router = { push: jest.fn() };

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

  it("redirects user to the check-out page if an unfinished check-in from today is present in local storage", () => {
    saveIdToLocalStorage("some-id", new Date().toDateString());
    useRouter.mockReturnValue(router);

    render(<Home />);
    expect(router.push).toHaveBeenCalledWith("/check-out");
  });

  it("lets the user check-in if there is an unfinished check-in is present in local storage that is NOT from today", () => {
    const yesterday = new Date(Date.now() - 86400000).toDateString();
    saveIdToLocalStorage("some-id", yesterday);
    useRouter.mockReturnValue(router);

    render(<Home />);
    expect(router.push).not.toHaveBeenCalledWith("/check-out");
  });
});
