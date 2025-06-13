import { render, screen } from "@testing-library/react";
import { beforeEach, describe, expect, test, vi } from "vitest";
import { MemoryRouter } from "react-router-dom";
import "@testing-library/jest-dom";
import Events from "../pages/Events";

vi.mock("firebase/firestore", async () => {
  const original = await vi.importActual("firebase/firestore");
  return {
    ...original,
    collection: vi.fn(),
    getDocs: vi.fn(),
  };
});
import { getDocs, collection } from "firebase/firestore";

const today = new Date();
const twoDaysFromNow = new Date(today.getTime() + 2 * 24 * 60 * 60 * 1000);

beforeEach(() => {
  getDocs.mockResolvedValue({
    docs: [
      {
        id: "0",
        data: () => ({
          title: "AllEventsTestEvent",
          description: "",
          location: "",
          imageUrl: "",
          startDate: { toDate: () => twoDaysFromNow },
          endDate: { toDate: () => twoDaysFromNow },
          rsvp: [],
        }),
      },
    ],
  });
  collection.mockReturnValue("mock-event");
  vi.resetModules();
});

vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "test-user",
      displayName: "Test User",
      email: "test@test.com",
      isAdmin: false,
    },
    authLoading: false,
  }),
  UserProvider: ({ children }) => children,
}));

describe("Events Page", () => {
  test("Events page has four tabs", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    const tabs = await screen.findAllByRole("tab");
    expect(tabs).toHaveLength(4);
  });

  test("All Events tab contains future events", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    expect(await screen.findByText("AllEventsTestEvent")).toBeInTheDocument();
    expect(await screen.findByLabelText("RSVP")).toBeInTheDocument();
    expect(await screen.findByLabelText("Save")).toBeInTheDocument();
  });
});
