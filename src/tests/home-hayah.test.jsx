import { render, screen, fireEvent } from "@testing-library/react";
import Home from "../pages/Home";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// ✅ Mock the useAuthContext hook
vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: { uid: "123", name: "Student" },
  }),
}));

vi.mock("../components/NewPost", () => ({
  default: ({ onPostCreated }) => (
    <button onClick={onPostCreated} data-testid="open-post-form">
      Create Post
    </button>
  ),
}));

vi.mock("../components/NavBar", () => ({
  default: () => <div data-testid="navbar" />,
}));

vi.mock("../components/ProfileCard", () => ({
  default: () => <div data-testid="profile-card" />,
}));

describe("Home Page", () => {
  it("allows students to click a button to open a form to create social posts", () => {
    render(<Home />);

    const createPostBtn = screen.getByTestId("open-post-form");
    expect(createPostBtn).toBeInTheDocument();

    fireEvent.click(createPostBtn);
  });
});
