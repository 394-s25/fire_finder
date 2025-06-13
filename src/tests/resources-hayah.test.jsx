import { render, screen } from "@testing-library/react";
import Resources from "../pages/Resources";
import { vi } from "vitest";
import "@testing-library/jest-dom";

// ✅ Mock Firebase Firestore
vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(), // ✅ fix
  collection: vi.fn(),
  getDocs: vi.fn(() => Promise.resolve({ docs: [] })),
  getDoc: vi.fn(() => Promise.resolve({ exists: () => false })),
  doc: vi.fn(),
  orderBy: vi.fn(),
  query: vi.fn(),
}));

// ✅ Mock useAuthContext instead of <AuthContext.Provider>
vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: { uid: "123", isAdmin: false },
  }),
}));

// ✅ Mock Navbar
vi.mock("../components/NavBar", () => ({
  default: () => <div>Mock Navbar</div>,
}));

describe("Resources Page", () => {
  it("renders all main tabs", async () => {
    render(<Resources />);

    expect(screen.getByText("Training")).toBeInTheDocument();
    expect(screen.getByText("Trades")).toBeInTheDocument();
    expect(screen.getByText("Contacts")).toBeInTheDocument();
    expect(screen.getByText("My Resources")).toBeInTheDocument();
  });
});
