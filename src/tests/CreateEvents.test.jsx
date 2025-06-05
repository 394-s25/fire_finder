import { describe, test, vi, beforeEach, afterEach, expect } from "vitest";
import {
  render,
  within,
  screen,
  fireEvent,
  waitFor,
} from "@testing-library/react";
import Events from "../pages/Events";
import { MemoryRouter } from "react-router-dom";
import { collection, getDocs, addDoc } from "firebase/firestore";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

vi.mock("firebase/firestore", async () => {
  const original = await vi.importActual("firebase/firestore");
  return {
    ...original,
    collection: vi.fn(),
    getDocs: vi.fn(),
    addDoc: vi.fn(() => Promise.resolve({ id: "mock-event-id" })),
  };
});

vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "test-user",
      displayName: "Test User",
      email: "test@test.com",
      isAdmin: true,
    },
    authLoading: false,
  }),
  UserProvider: ({ children }) => children,
}));

beforeEach(() => {
  getDocs.mockResolvedValue({ docs: [] });
  collection.mockReturnValue("mock-events-collection");
});

afterEach(() => {
  vi.resetAllMocks();
});

describe("Events Page", () => {
  test("has a clickable '+ Create New Event' button", () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    const createBtn = screen.getByRole("button", { name: /create new event/i });
    expect(createBtn).toBeInTheDocument();
  });

  test("shows modal when '+ Create New Event' button is clicked", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    const createBtn = screen.getByRole("button", { name: /create new event/i });
    await userEvent.click(createBtn);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Create New Event")).toBeInTheDocument();
  });

  test("addDoc is called with data from the create new event form", async () => {
    render(
      <MemoryRouter>
        <Events />
      </MemoryRouter>
    );

    const createBtn = screen.getByRole("button", { name: /create new event/i });
    await userEvent.click(createBtn);

    const dialog = await screen.findByRole("dialog");
    expect(within(dialog).getByText("Create New Event")).toBeInTheDocument();

    await userEvent.type(screen.getByLabelText(/title/i), "Test Event");
    await userEvent.type(
      screen.getByLabelText(/description/i),
      "This is a test event."
    );
    await userEvent.type(screen.getByLabelText(/location/i), "Test Location");

    fireEvent.change(screen.getByLabelText(/start date/i), {
      target: { value: "2025-08-01T10:00" },
    });

    fireEvent.change(screen.getByLabelText(/end date/i), {
      target: { value: "2025-08-01T12:00" },
    });

    const submitBtn = screen.getByRole("button", { name: /create/i });
    fireEvent.click(submitBtn);

    await waitFor(() =>
      expect(addDoc).toHaveBeenCalledWith(
        "mock-events-collection",
        expect.objectContaining({
          title: "Test Event",
          description: "This is a test event.",
          location: "Test Location",
          startDate: expect.any(Date),
          endDate: expect.any(Date),
        })
      )
    );
  });
});
