import { render, screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { RouterWrappedComponent } from "utils/testing/setupTest";
import { LoginCognito } from "components";
import { testA11yAct } from "utils/testing/commonTests";
import { VISITED_LINKS_STORAGE_KEY } from "../../constants";

const loginCognitoComponent = (
  <RouterWrappedComponent>
    <LoginCognito />
  </RouterWrappedComponent>
);

const mockSignIn = vi.fn();
vi.mock("aws-amplify/auth", () => ({
  signIn: (credentials: { username: string; password: string }) =>
    mockSignIn(credentials),
}));

const mockUseNavigate = vi.fn();

vi.mock("react-router", () => ({
  useNavigate: () => mockUseNavigate,
}));

describe("<LoginCognito />", () => {
  describe("Renders", () => {
    beforeEach(() => {
      render(loginCognitoComponent);
    });

    test("LoginCognito login calls amplify auth login", async () => {
      const emailInput = screen.getByLabelText("Email");
      const passwordInput = screen.getByLabelText("Password");
      const submitButton = screen.getByRole("button");
      await userEvent.type(emailInput, "email@address.com");
      await userEvent.type(passwordInput, "p@$$w0rd"); //pragma: allowlist secret
      await userEvent.click(submitButton);
      expect(mockSignIn).toHaveBeenCalledWith({
        username: "email@address.com",
        password: "p@$$w0rd", //pragma: allowlist secret
      });
      expect(mockUseNavigate).toHaveBeenCalledWith("/");
    });

    test("Successful login resets session visited links", async () => {
      sessionStorage.setItem(
        VISITED_LINKS_STORAGE_KEY,
        JSON.stringify(["https://example.com"])
      );
      await userEvent.type(screen.getByLabelText("Email"), "email@address.com");
      await userEvent.type(screen.getByLabelText("Password"), "p@$$w0rd"); //pragma: allowlist secret
      await userEvent.click(screen.getByRole("button"));
      expect(sessionStorage.getItem(VISITED_LINKS_STORAGE_KEY)).toBeNull();
    });
  });

  testA11yAct(loginCognitoComponent);
});
