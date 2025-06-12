import { describe, it, vi, beforeEach, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";
import PollModal from "../components/PollModal";


vi.mock("../services/firestoreConfig", () => ({
  db: "mocked-db",
}));

vi.mock("firebase/firestore", () => ({
  collection: vi.fn(),
  addDoc: vi.fn(),
  serverTimestamp: vi.fn(() => ({ serverTimestamp: true })),
}));

vi.mock("../services/userProvider", () => ({
  useAuthContext: vi.fn(),
}));

import { collection, addDoc, serverTimestamp } from "firebase/firestore";
import { useAuthContext } from "../services/userProvider";

describe("PollModal - Poll Creation with Duration", () => {
  const mockUser = {
    uid: "test-user-123",
    displayName: "Test User",
    email: "test@example.com",
  };

  const mockOnClose = vi.fn();

  beforeEach(() => {
    vi.clearAllMocks();

    vi.mocked(useAuthContext).mockReturnValue({ user: mockUser });

    vi.mocked(collection).mockReturnValue("mocked-collection");
    vi.mocked(addDoc).mockResolvedValue({ id: "mock-doc-id" });
    vi.mocked(serverTimestamp).mockReturnValue({ serverTimestamp: true });
  });

  it("should render poll creation form when modal is open", () => {
    render(<PollModal open={true} onClose={mockOnClose} />);

    expect(screen.getByText("Create Poll")).toBeInTheDocument();
    expect(screen.getByLabelText("Poll Question")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
    expect(screen.getByText("Limited Duration")).toBeInTheDocument();
    expect(
      screen.getByRole("button", { name: /publish/i })
    ).toBeInTheDocument();
  });

  it("should not render when modal is closed", () => {
    render(<PollModal open={false} onClose={mockOnClose} />);

    expect(screen.queryByText("Create Poll")).not.toBeInTheDocument();
  });

  it("should enable duration selection when Limited Duration switch is toggled", async () => {
    const user = userEvent.setup();
    render(<PollModal open={true} onClose={mockOnClose} />);

    expect(screen.queryByRole("combobox")).not.toBeInTheDocument();

    const durationSwitch = screen.getByRole("checkbox", {
      name: /limited duration/i,
    });
    await user.click(durationSwitch);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });
  });

  it("should allow selecting poll duration options", async () => {
    const user = userEvent.setup();
    render(<PollModal open={true} onClose={mockOnClose} />);

    const durationSwitch = screen.getByRole("checkbox", {
      name: /limited duration/i,
    });
    await user.click(durationSwitch);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    const durationSelect = screen.getByRole("combobox");
    await user.click(durationSelect);

    await waitFor(() => {
      expect(screen.getByText("1 day")).toBeInTheDocument();
      expect(screen.getByText("3 days")).toBeInTheDocument();
      expect(screen.getByText("7 days")).toBeInTheDocument();
    });
  });

  it("should create and post a poll with specified duration", async () => {
    const user = userEvent.setup();
    render(<PollModal open={true} onClose={mockOnClose} />);

    const questionInput = screen.getByLabelText("Poll Question");
    await user.type(
      questionInput,
      "What is your favorite programming language?"
    );

    const option1Input = screen.getByLabelText("Option 1");
    const option2Input = screen.getByLabelText("Option 2");
    await user.type(option1Input, "JavaScript");
    await user.type(option2Input, "Python");

    const durationSwitch = screen.getByRole("checkbox", {
      name: /limited duration/i,
    });
    await user.click(durationSwitch);

    await waitFor(() => {
      expect(screen.getByRole("combobox")).toBeInTheDocument();
    });

    const durationSelect = screen.getByRole("combobox");
    await user.click(durationSelect);

    const threeDaysOption = await screen.findByText("3 days");
    await user.click(threeDaysOption);

    const publishButton = screen.getByRole("button", { name: /publish/i });
    await user.click(publishButton);

    await waitFor(() => {
      expect(vi.mocked(addDoc)).toHaveBeenCalledWith(
        "mocked-collection",
        expect.objectContaining({
          text: "What is your favorite programming language?",
          authorId: "test-user-123",
          authorName: "Test User",
          authorEmail: "test@example.com",
          isPoll: true,
          pollOptions: [
            { text: "JavaScript", votes: 0, votedBy: [] },
            { text: "Python", votes: 0, votedBy: [] },
          ],
          pollDuration: 3,
          pollEndTime: expect.any(Date),
        })
      );
    });

    expect(mockOnClose).toHaveBeenCalled();
  });

  it("should create a poll without duration when Limited Duration is disabled", async () => {
    const user = userEvent.setup();
    render(<PollModal open={true} onClose={mockOnClose} />);

    const questionInput = screen.getByLabelText("Poll Question");
    await user.type(questionInput, "Should we have pizza for lunch?");

    const option1Input = screen.getByLabelText("Option 1");
    const option2Input = screen.getByLabelText("Option 2");
    await user.type(option1Input, "Yes");
    await user.type(option2Input, "No");

    const publishButton = screen.getByRole("button", { name: /publish/i });
    await user.click(publishButton);

    await waitFor(() => {
      expect(vi.mocked(addDoc)).toHaveBeenCalledWith(
        "mocked-collection",
        expect.objectContaining({
          text: "Should we have pizza for lunch?",
          isPoll: true,
          pollOptions: [
            { text: "Yes", votes: 0, votedBy: [] },
            { text: "No", votes: 0, votedBy: [] },
          ],
          pollDuration: null,
          pollEndTime: null,
        })
      );
    });
  });

  it("should allow adding and removing poll options", async () => {
    const user = userEvent.setup();
    render(<PollModal open={true} onClose={mockOnClose} />);

    expect(screen.getByLabelText("Option 1")).toBeInTheDocument();
    expect(screen.getByLabelText("Option 2")).toBeInTheDocument();
    expect(screen.queryByLabelText("Option 3")).not.toBeInTheDocument();

    const addOptionButton = screen.getByRole("button", { name: /add option/i });
    await user.click(addOptionButton);

    await waitFor(() => {
      expect(screen.getByLabelText("Option 3")).toBeInTheDocument();
    });

    const option3Input = screen.getByLabelText("Option 3");
    await user.type(option3Input, "Maybe");

    const removeButtons = screen.getAllByTestId("CloseIcon");

    if (removeButtons.length > 0) {
      await user.click(removeButtons[0].closest("button"));

      await waitFor(() => {
        expect(screen.queryByLabelText("Option 3")).not.toBeInTheDocument();
      });
    }
  });

  it("should disable publish button when required fields are empty", () => {
    render(<PollModal open={true} onClose={mockOnClose} />);

    const publishButton = screen.getByRole("button", { name: /publish/i });
    expect(publishButton).toBeDisabled();
  });

  it("should show validation error when duration is enabled but not selected", async () => {
    const user = userEvent.setup();

    const alertSpy = vi.spyOn(window, "alert").mockImplementation(() => {});

    render(<PollModal open={true} onClose={mockOnClose} />);

    await user.type(screen.getByLabelText("Poll Question"), "Test question?");
    await user.type(screen.getByLabelText("Option 1"), "Option A");
    await user.type(screen.getByLabelText("Option 2"), "Option B");

    const durationSwitch = screen.getByRole("checkbox", {
      name: /limited duration/i,
    });
    await user.click(durationSwitch);

    const publishButton = screen.getByRole("button", { name: /publish/i });
    await user.click(publishButton);

    expect(alertSpy).toHaveBeenCalledWith("Please select a duration");

    alertSpy.mockRestore();
  });
});
