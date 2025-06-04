import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import Events from "../pages/Events";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";

// Mock Firestore
vi.mock("firebase/firestore", async () => {
  const original = await vi.importActual("firebase/firestore");
  return {
    ...original,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});

import { collection, getDocs } from "firebase/firestore";

// Mock user provider
vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "mock-user",
      displayName: "Mock User",
      email: "mock@test.com",
    },
    authLoading: false,
  }),
  UserProvider: ({ children }) => children,
}));

const mockEvents = [
  {
    id: "event1",
    title: "Trade Expo 2025",
    description: "Discover the latest in skilled trades.",
    location: "Expo Center",
    imageUrl: "https://example.com/tradeexpo.jpg",
    startDate: new Date("2025-07-01T10:00:00Z"),
    endDate: new Date("2025-07-01T17:00:00Z"),
  },
];

beforeEach(() => {
  getDocs.mockResolvedValue({
    docs: mockEvents.map((event) => ({
      id: event.id,
      data: () => ({
        title: event.title,
        description: event.description,
        location: event.location,
        imageUrl: event.imageUrl,
        startDate: { toDate: () => event.startDate },
        endDate: { toDate: () => event.endDate },
      }),
    })),
  });
  collection.mockReturnValue("mock-collection");
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("Events Page", () => {
  test("renders events from Firestore", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    // Assert
    expect(await screen.findByText("Trade Expo 2025")).toBeInTheDocument();
    expect(
      screen.getByText(/Discover the latest in skilled trades/i)
    ).toBeInTheDocument();
    expect(screen.getByText("Expo Center")).toBeInTheDocument();
  });
});
