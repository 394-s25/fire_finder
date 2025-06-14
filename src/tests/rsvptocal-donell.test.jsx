import OnboardingForm from '../pages/Onboarding';
import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import { beforeEach, describe, expect, test, vi } from 'vitest';
import '@testing-library/jest-dom';

// db stuf
vi.mock("firebase/firestore", async () => {
  const original = await vi.importActual("firebase/firestore");
  return {
    ...original,
    collection: vi.fn(),
    getDocs: vi.fn(),
    doc: vi.fn(),
    setDoc: vi.fn(),
    addDoc: vi.fn(),
    query: vi.fn(),
    where: vi.fn(),
  };
});
vi.mock("../services/userProvider", () => ({
  useAuthContext: () => ({
    user: {
      uid: "1234567890",
      displayName: "Testingstudent",
      email: "student@test.com",
    },
  }),
  UserProvider: ({ children }) => children,
}));

import { getDocs, collection } from "firebase/firestore";

/*
beforeEach(() => {
    getDocs.mockResolvedValue({
      docs: [
        {
          id: "0",
          data: () => ({*/
beforeEach(() => {
  getDocs.mockResolvedValue({
    docs: [
      { id: "trade1", data: () => ({ name: "Electrical" }) },
      { id: "trade2", data: () => ({ name: "Plumbing" }) },
      { id: "skill1", data: () => ({ name: "Problem Solving" }) },
      { id: "skill2", data: () => ({ name: "Communication" }) },
      { id: "skill3", data: () => ({ name: "Teamwork" }) },
    ],
  });
  collection.mockReturnValue({});
});

const renderForm = () =>//h
  render(
    <MemoryRouter>
      <OnboardingForm />
    </MemoryRouter>
  );

describe("OnboardingForm", () => {
  test("loads main title", () => {
    renderForm();
    expect(screen.getByText("Tell Us About You")).toBeTruthy(); // swapped for variety
  });

  test("shows trade interest select", () => {
    renderForm();
    expect(screen.getByLabelText("Trade Interests")).toBeInTheDocument();
  });

  test("renders school year field", () => {
    renderForm();
    expect(screen.getByLabelText("Current School Year")).toBeInTheDocument();
    
  });

  test("work experience section is there", () => {
    renderForm();
    expect(screen.getByRole("heading", { name: /Add Work Experience/i })).toBeInTheDocument();
    expect(screen.getByRole("button", { name: "Add Work Experience" })).toBeInTheDocument();
    expect(screen.getByLabelText("Employer")).toBeInTheDocument();
    expect(screen.getByLabelText("Job Title")).toBeInTheDocument();
  });

  test("skills field appears", async () => {
    renderForm();
    expect(await screen.findByLabelText("Skills")).toBeInTheDocument();
    // dropdown
  });

  test("has finish buton", () => {
    renderForm();
    expect(screen.getByRole("button", { name: /finish setup/i })).toBeInTheDocument();
  });

  /*
  test("submits the form and redirects", async ()
  });
  */

});
