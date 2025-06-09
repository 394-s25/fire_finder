import { describe, it, vi, beforeEach, afterEach, expect } from "vitest";
import { render, screen, waitFor, fireEvent } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import "@testing-library/jest-dom";

// Mock browser APIs that Material-UI might need (only for this test file)
Object.defineProperty(window, "matchMedia", {
  writable: true,
  value: vi.fn().mockImplementation((query) => ({
    matches: false,
    media: query,
    onchange: null,
    addListener: vi.fn(),
    removeListener: vi.fn(),
    addEventListener: vi.fn(),
    removeEventListener: vi.fn(),
    dispatchEvent: vi.fn(),
  })),
});
import Home from "../pages/Home";
import { useAuthContext } from "../services/userProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";

// Mock child components
vi.mock("../components/NavBar", () => ({
  default: () => <div data-testid="navbar">Navbar</div>,
}));

vi.mock("../components/ProfileCard", () => ({
  default: () => <div data-testid="profile-card">ProfileCard</div>,
}));

vi.mock("../components/NewPost", () => ({
  default: ({ onPostCreated }) => (
    <div data-testid="new-post-modal">
      <button onClick={onPostCreated}>Create Post</button>
    </div>
  ),
}));

vi.mock("../components/PostCard", () => ({
  default: ({ post, onSaveToggle }) => (
    <div data-testid={`post-${post.id}`}>
      <div data-testid={`post-text-${post.id}`}>{post.text}</div>
      <div data-testid={`post-likes-${post.id}`}>Likes: {post.likes || 0}</div>
      <button onClick={onSaveToggle}>Toggle Save</button>
    </div>
  ),
}));

// Mock Firebase/Firestore
vi.mock("../services/userProvider");
vi.mock("firebase/firestore");
vi.mock("../services/firestoreConfig", () => ({ db: {} }));

// Mock data
const mockUser = { uid: "test-user-123" };

const mockAllPosts = [
  {
    id: "post1",
    text: "This is a regular post",
    likes: 2,
    timestamp: { seconds: 1640995300 },
  },
  {
    id: "post2",
    text: "Another regular post",
    likes: 8,
    timestamp: { seconds: 1640995200 },
  },
];

const mockSavedPosts = [
  {
    id: "saved1",
    text: "This is a saved post",
    likes: 5,
    timestamp: { seconds: 1640995200 },
  },
  {
    id: "saved2",
    text: "Another saved post",
    likes: 3,
    timestamp: { seconds: 1640995100 },
  },
];

const mockSavedPostRefs = [{ path: "posts/saved1" }, { path: "posts/saved2" }];

describe("Home Component - Saved Tab Functionality", () => {
  const user = userEvent.setup();

  beforeEach(() => {
    // Mock useAuthContext to return a logged-in user
    vi.mocked(useAuthContext).mockReturnValue({ user: mockUser });

    // Mock Firebase Firestore functions
    vi.mocked(collection).mockReturnValue("mocked-collection");
    vi.mocked(doc).mockImplementation((db, collection, id) => ({
      path: `${collection}/${id}`,
    }));
    vi.mocked(orderBy).mockReturnValue("mocked-orderBy");
    vi.mocked(query).mockReturnValue("mocked-query");

    // Mock getDocs for fetching all posts (Feed tab)
    vi.mocked(getDocs).mockImplementation(() =>
      Promise.resolve({
        docs: mockAllPosts.map((post) => ({
          id: post.id,
          data: () => ({ ...post }),
        })),
      })
    );

    // Mock getDoc for fetching saved posts
    vi.mocked(getDoc).mockImplementation((docRef) => {
      if (docRef.path === "students/test-user-123") {
        // Return user document with saved post references
        return Promise.resolve({
          data: () => ({ posts: mockSavedPostRefs }),
        });
      }

      // Return individual saved posts
      if (docRef.path === "posts/saved1") {
        return Promise.resolve({
          id: "saved1",
          exists: () => true,
          data: () => mockSavedPosts[0],
        });
      }

      if (docRef.path === "posts/saved2") {
        return Promise.resolve({
          id: "saved2",
          exists: () => true,
          data: () => mockSavedPosts[1],
        });
      }

      return Promise.resolve({
        exists: () => false,
        data: () => null,
      });
    });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it("should display saved posts when Saved tab is clicked", async () => {
    render(<Home />);

    // Wait for initial data to load
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Feed" })).toBeInTheDocument();
    });

    // Initially should show Feed tab content (all posts)
    await waitFor(() => {
      expect(screen.getByTestId("post-post1")).toBeInTheDocument();
      expect(screen.getByTestId("post-post2")).toBeInTheDocument();
    });

    // Click on Saved tab
    const savedTab = screen.getByRole("tab", { name: "Saved" });
    await user.click(savedTab);

    // Wait for saved posts to be displayed
    await waitFor(() => {
      expect(screen.getByTestId("post-saved1")).toBeInTheDocument();
      expect(screen.getByTestId("post-saved2")).toBeInTheDocument();
    });

    // Verify saved posts content
    expect(screen.getByTestId("post-text-saved1")).toHaveTextContent(
      "This is a saved post"
    );
    expect(screen.getByTestId("post-text-saved2")).toHaveTextContent(
      "Another saved post"
    );
    expect(screen.getByTestId("post-likes-saved1")).toHaveTextContent(
      "Likes: 5"
    );
    expect(screen.getByTestId("post-likes-saved2")).toHaveTextContent(
      "Likes: 3"
    );

    // Verify that regular posts are no longer displayed
    expect(screen.queryByTestId("post-post1")).not.toBeInTheDocument();
    expect(screen.queryByTestId("post-post2")).not.toBeInTheDocument();
  });

  it('should display "No saved posts yet" message when user has no saved posts', async () => {
    // Mock empty saved posts
    vi.mocked(getDoc).mockImplementation((docRef) => {
      if (docRef.path === "students/test-user-123") {
        return Promise.resolve({
          data: () => ({ posts: [] }), // Empty saved posts array
        });
      }
      return Promise.resolve({
        exists: () => false,
        data: () => null,
      });
    });

    render(<Home />);

    // Wait for initial load
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Saved" })).toBeInTheDocument();
    });

    // Click on Saved tab
    const savedTab = screen.getByRole("tab", { name: "Saved" });
    await user.click(savedTab);

    // Should display empty state message
    await waitFor(() => {
      expect(screen.getByText("No saved posts yet.")).toBeInTheDocument();
    });
  });

  it("should call Firebase functions correctly when fetching saved posts", async () => {
    render(<Home />);

    // Wait for component to mount and Firebase calls to be made
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Saved" })).toBeInTheDocument();
    });

    // Verify Firebase functions were called correctly
    expect(vi.mocked(getDoc)).toHaveBeenCalledWith(
      expect.objectContaining({ path: "students/test-user-123" })
    );

    // Should fetch individual saved posts
    await waitFor(() => {
      expect(vi.mocked(getDoc)).toHaveBeenCalledWith(
        expect.objectContaining({ path: "posts/saved1" })
      );
      expect(vi.mocked(getDoc)).toHaveBeenCalledWith(
        expect.objectContaining({ path: "posts/saved2" })
      );
    });
  });

  it("should handle search functionality in Saved tab", async () => {
    render(<Home />);

    // Wait for initial load and switch to Saved tab
    await waitFor(() => {
      expect(screen.getByRole("tab", { name: "Saved" })).toBeInTheDocument();
    });

    const savedTab = screen.getByRole("tab", { name: "Saved" });
    await user.click(savedTab);

    // Wait for saved posts to load
    await waitFor(() => {
      expect(screen.getByTestId("post-saved1")).toBeInTheDocument();
      expect(screen.getByTestId("post-saved2")).toBeInTheDocument();
    });

    // Search for specific saved post
    const searchInput = screen.getByPlaceholderText("Search");
    await user.type(searchInput, "This is a saved");

    // Should only show matching saved post
    await waitFor(() => {
      expect(screen.getByTestId("post-saved1")).toBeInTheDocument();
      expect(screen.queryByTestId("post-saved2")).not.toBeInTheDocument();
    });
  });
});
