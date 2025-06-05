import { describe, expect, test, vi } from "vitest";
import { render, screen } from "@testing-library/react";
import App from "../App";
import { UserProvider } from "../services/userProvider";
import "@testing-library/jest-dom";

vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "test-user",
      displayName: "Test User",
      email: "test@test.com",
    },
    authLoading: false,
  }),
  UserProvider: ({ children }) => children,
}));

describe("Fire Finder Tests", () => {
  test("App renders", () => {
    render(
      <UserProvider>
        <App />
      </UserProvider>
    );
  });

  test("Navbar shows 'Explore' title on home route", () => {
    render(
      <UserProvider>
        <App />
      </UserProvider>
    );
    expect(screen.getByText("Explore")).toBeInTheDocument();
  });
});
