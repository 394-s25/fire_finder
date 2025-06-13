import "@testing-library/jest-dom";
import PollModal from "../components/PollModal";

vi.mock("../services/firestoreConfig", () => ({
  db: "mocked-db",
}));

vi.mock("firebase/firestore", () => ({
  getFirestore: vi.fn(() => "mocked-db"),
  collection: vi.fn(() => "mocked-collection"),
  addDoc: vi.fn(() => Promise.resolve({ id: "mock-id" })),
  serverTimestamp: vi.fn(() => ({ serverGenerated: true })),
}));

vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "mock-user",
      displayName: "Mona MockUser",
      email: "monamock14@mock.com",
    },
  }),
}));

describe("PollModal", () => {
  const close_handler = vi.fn();

  test("user publishes poll w/ 1 day duration", async () => {
    const mock_user = userEvent.setup();
    render(<PollModal open={true} onClose={close_handler} />);

    await mock_user.type(
      screen.getByLabelText("Poll Question"),
      "What's your favorite trade?"
    );

    await mock_user.type(screen.getByLabelText("Option 1"), "Plumbing");
    await mock_user.type(screen.getByLabelText("Option 2"), "Carpentry");

    expect(screen.getByDisplayValue("Plumbing")).toBeInTheDocument();
    expect(screen.getByDisplayValue("Carpentry")).toBeInTheDocument();

    const duration_check = screen.getByRole("checkbox", {
      name: /limited duration/i,
    });
    await mock_user.click(duration_check);
    expect(duration_check).toBeChecked();

    const select_duration = await screen.findByRole("combobox");
    await mock_user.click(select_duration);

    const oneday_option = await screen.findByText("1 day");
    await mock_user.click(oneday_option);

    const publish_button = screen.getByRole("button", { name: /publish/i });
    expect(publish_button).toBeInTheDocument();
    await mock_user.click(publish_button);

    expect(addDoc).toHaveBeenCalled();
    const callArgs = addDoc.mock.calls[0][1];
    expect(callArgs.text).toBe("What's your favorite trade?");
    expect(callArgs.isPoll).toBe(true);
    expect(callArgs.pollOptions).toHaveLength(2);
    expect(callArgs.pollOptions[0].text).toBe("Plumbing");
    expect(callArgs.pollOptions[1].text).toBe("Carpentry");
    expect(callArgs.pollDuration).toBe(1);
  });
});
