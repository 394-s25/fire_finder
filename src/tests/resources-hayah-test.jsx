import React from "react";
import { render, screen } from "@testing-library/react";
import Resources from "../pages/Resources";
import { AuthContext } from "../services/userProvider";
import "@testing-library/jest-dom";

// Mock Firebase calls to avoid actual DB fetches
jest.mock("firebase/firestore", () => ({
  collection: jest.fn(),
  getDocs: jest.fn(() => Promise.resolve({ docs: [] })),
  getDoc: jest.fn(() => Promise.resolve({ exists: () => false })),
  doc: jest.fn(),
}));

// Mock Navbar
jest.mock("../components/NavBar", () => () => <div>Mock Navbar</div>);

describe("Resources Page", () => {
  it("renders all main tabs", async () => {
    const mockUser = { uid: "123", isAdmin: false };

    render(
      <AuthContext.Provider value={{ user: mockUser }}>
        <Resources />
      </AuthContext.Provider>
    );

    expect(screen.getByText("Training")).toBeInTheDocument();
    expect(screen.getByText("Trades")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("My Resources")).toBeInTheDocument();
  });
});
