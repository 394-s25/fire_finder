import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, fireEvent, waitFor } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import Resources from "../pages/Resources";
import "@testing-library/jest-dom";

// Mock Firestore
vi.mock("firebase/firestore", async () => {
  const original = await vi.importActual("firebase/firestore");
  return {
    ...original,
    collection: vi.fn(),
    getDocs: vi.fn(),
    getDoc: vi.fn(),
    doc: vi.fn(),
  };
});

import { collection, getDocs, getDoc, doc } from "firebase/firestore";

// Mock user provider
vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "mock-student-id",
      isAdmin: false,
    },
  }),
  UserProvider: ({ children }) => children,
}));

const mockSavedTrade = {
  id: "trade1",
  name: "Electrician",
  description: "Work with electrical systems.",
  category: "Electrical",
};

beforeEach(() => {
  // Mock getDocs for general trade collection (empty, not needed for this test)
  getDocs.mockResolvedValue({
    docs: [],
  });

  // Mock getDoc for saved trades from "students" document
  getDoc.mockImplementation((ref) => {
    if (ref.path?.includes("students")) {
      return Promise.resolve({
        exists: () => true,
        data: () => ({
          interests: [
            { path: "trades/trade1" }, // Fake DocumentReference
          ],
        }),
      });
    } else if (ref.path === "trades/trade1") {
      return Promise.resolve({
        exists: () => true,
        id: "trade1",
        data: () => ({
          name: "Electrician",
          description: "Work with electrical systems.",
          category: "Electrical",
        }),
      });
    }
    return Promise.resolve({ exists: () => false });
  });

  // Mock collection & doc utilities
  collection.mockReturnValue("mock-collection");
  doc.mockImplementation((_, path) => ({ path }));
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("Resources Page", () => {
  test('renders "My Resources" with saved trades', async () => {
    render(
      <MemoryRouter>
        <Resources />
      </MemoryRouter>
    );

    // Click the "My Resources" tab
    const myResourcesTab = screen.getByRole("tab", { name: /My Resources/i });
    fireEvent.click(myResourcesTab);

    // Wait for saved trade to show
    expect(await screen.findByText("Electrician")).toBeInTheDocument();
    expect(
      screen.getByText("Work with electrical systems.")
    ).toBeInTheDocument();
  });
});
