import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';
import { render, screen, fireEvent, waitFor } from '@testing-library/react';
import userEvent from '@testing-library/user-event';
import { BrowserRouter } from 'react-router-dom';
import { ThemeProvider, createTheme } from '@mui/material/styles';
import OnboardingForm from '../Onboarding';

// Mock Firebase
const mockGetDocs = vi.fn();
const mockSetDoc = vi.fn();
const mockAddDoc = vi.fn();
const mockDoc = vi.fn();
const mockCollection = vi.fn();
const mockQuery = vi.fn();
const mockWhere = vi.fn();

vi.mock('firebase/firestore', () => ({
  getDocs: mockGetDocs,
  setDoc: mockSetDoc,
  addDoc: mockAddDoc,
  doc: mockDoc,
  collection: mockCollection,
  query: mockQuery,
  where: mockWhere,
}));

// Mock Firebase config
vi.mock('../services/firestoreConfig', () => ({
  auth: {
    currentUser: {
      uid: 'test-user-123',
      displayName: 'Test Student',
      email: 'test@example.com',
    },
  },
  db: {},
}));

// Mock FormContainer
vi.mock('../components/FormContainer', () => ({
  default: ({ children, title }) => (
    <div data-testid="form-container">
      <h1>{title}</h1>
      {children}
    </div>
  ),
}));

// Mock useNavigate
const mockNavigate = vi.fn();
vi.mock('react-router-dom', async () => {
  const actual = await vi.importActual('react-router-dom');
  return {
    ...actual,
    useNavigate: () => mockNavigate,
  };
});

// Mock data
const mockTrades = [
  { id: 'trade1', name: 'Electrician' },
  { id: 'trade2', name: 'Plumber' },
  { id: 'trade3', name: 'Carpenter' },
];

const mockSkills = [
  { id: 'skill1', name: 'Problem Solving' },
  { id: 'skill2', name: 'Team Work' },
  { id: 'skill3', name: 'Communication' },
];

// Test wrapper with required providers
const TestWrapper = ({ children }) => {
  const theme = createTheme();
  return (
    <BrowserRouter>
      <ThemeProvider theme={theme}>
        {children}
      </ThemeProvider>
    </BrowserRouter>
  );
};

describe('OnboardingForm', () => {
  beforeEach(() => {
    vi.clearAllMocks();
    
    // Mock Firebase responses
    mockGetDocs.mockImplementation((collectionRef) => {
      if (collectionRef === 'trades-collection') {
        return Promise.resolve({
          docs: mockTrades.map(trade => ({
            id: trade.id,
            data: () => ({ name: trade.name }),
          })),
        });
      }
      if (collectionRef === 'skills-collection') {
        return Promise.resolve({
          docs: mockSkills.map(skill => ({
            id: skill.id,
            data: () => ({ name: skill.name }),
          })),
        });
      }
      return Promise.resolve({ docs: [] });
    });

    mockCollection.mockImplementation((db, collectionName) => {
      if (collectionName === 'trades') return 'trades-collection';
      if (collectionName === 'skills') return 'skills-collection';
      return `${collectionName}-collection`;
    });

    mockDoc.mockReturnValue('mock-doc-ref');
    mockSetDoc.mockResolvedValue();
    mockAddDoc.mockResolvedValue({ id: 'new-doc-id' });
  });

  afterEach(() => {
    vi.resetAllMocks();
  });

  it('renders the form with all sections', async () => {
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    expect(screen.getByText('Tell Us About You')).toBeInTheDocument();
    expect(screen.getByLabelText(/trade interests/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/current school year/i)).toBeInTheDocument();
    expect(screen.getByText('Add Work Experience')).toBeInTheDocument();
    expect(screen.getByLabelText(/skills/i)).toBeInTheDocument();
    expect(screen.getByRole('button', { name: /finish setup/i })).toBeInTheDocument();
  });

  it('loads and displays trade options', async () => {
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalledWith('trades-collection');
    });

    // Open the trade interests dropdown
    const tradeSelect = screen.getByLabelText(/trade interests/i);
    fireEvent.mouseDown(tradeSelect);

    await waitFor(() => {
      expect(screen.getByText('Electrician')).toBeInTheDocument();
      expect(screen.getByText('Plumber')).toBeInTheDocument();
      expect(screen.getByText('Carpenter')).toBeInTheDocument();
    });
  });

  it('allows selecting multiple trade interests', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });

    // Open and select trade interests
    const tradeSelect = screen.getByLabelText(/trade interests/i);
    await user.click(tradeSelect);

    await waitFor(() => {
      expect(screen.getByText('Electrician')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Electrician'));
    await user.click(screen.getByText('Plumber'));

    // Check that chips are displayed for selected trades
    expect(screen.getByText('Electrician')).toBeInTheDocument();
    expect(screen.getByText('Plumber')).toBeInTheDocument();
  });

  it('allows selecting school year', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    const yearSelect = screen.getByLabelText(/current school year/i);
    await user.click(yearSelect);

    await waitFor(() => {
      expect(screen.getByText('10th Grade')).toBeInTheDocument();
    });

    await user.click(screen.getByText('10th Grade'));
  });

  it('allows adding work experience', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    // Fill out work experience form
    await user.type(screen.getByLabelText(/employer/i), 'Test Company');
    await user.type(screen.getByLabelText(/job title/i), 'Intern');
    await user.type(screen.getByLabelText(/start date/i), '2023-06-01');
    await user.type(screen.getByLabelText(/end date/i), '2023-08-31');

    // Add the experience
    await user.click(screen.getByRole('button', { name: /add work experience/i }));

    // Check that experience is displayed
    expect(screen.getByText('Intern')).toBeInTheDocument();
    expect(screen.getByText('Test Company')).toBeInTheDocument();
    expect(screen.getByText('2023-06-01 – 2023-08-31')).toBeInTheDocument();
  });

  it('allows deleting work experience', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    // Add work experience first
    await user.type(screen.getByLabelText(/employer/i), 'Test Company');
    await user.type(screen.getByLabelText(/job title/i), 'Intern');
    await user.click(screen.getByRole('button', { name: /add work experience/i }));

    // Verify it's added
    expect(screen.getByText('Intern')).toBeInTheDocument();

    // Delete the experience
    await user.click(screen.getByRole('button', { name: /delete/i }));

    // Verify it's removed
    expect(screen.queryByText('Intern')).not.toBeInTheDocument();
  });

  it('handles skills autocomplete with existing and new skills', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });

    const skillsInput = screen.getByLabelText(/skills/i);
    
    // Type to search for existing skill
    await user.type(skillsInput, 'Problem');
    
    await waitFor(() => {
      expect(screen.getByText('Problem Solving')).toBeInTheDocument();
    });

    await user.click(screen.getByText('Problem Solving'));

    // Add a new skill
    await user.type(skillsInput, 'Custom Skill');
    await user.keyboard('{Enter}');

    // Both skills should be selected
    expect(screen.getByText('Problem Solving')).toBeInTheDocument();
    expect(screen.getByText('Custom Skill')).toBeInTheDocument();
  });

  it('prevents form submission without authentication', async () => {
    const user = userEvent.setup();
    
    // Mock no authenticated user
    vi.mocked(require('../services/firestoreConfig')).auth.currentUser = null;
    
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});

    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /finish setup/i }));

    expect(alertSpy).toHaveBeenCalledWith('Not logged in');
    expect(mockSetDoc).not.toHaveBeenCalled();
    
    alertSpy.mockRestore();
  });

  it('submits form with all data and navigates to home', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    await waitFor(() => {
      expect(mockGetDocs).toHaveBeenCalled();
    });

    // Select trade interests
    const tradeSelect = screen.getByLabelText(/trade interests/i);
    await user.click(tradeSelect);
    await waitFor(() => expect(screen.getByText('Electrician')).toBeInTheDocument());
    await user.click(screen.getByText('Electrician'));

    // Select school year
    const yearSelect = screen.getByLabelText(/current school year/i);
    await user.click(yearSelect);
    await waitFor(() => expect(screen.getByText('11th Grade')).toBeInTheDocument());
    await user.click(screen.getByText('11th Grade'));

    // Add work experience
    await user.type(screen.getByLabelText(/employer/i), 'Test Corp');
    await user.type(screen.getByLabelText(/job title/i), 'Assistant');
    await user.click(screen.getByRole('button', { name: /add work experience/i }));

    // Add skills
    const skillsInput = screen.getByLabelText(/skills/i);
    await user.type(skillsInput, 'Team Work');
    await waitFor(() => expect(screen.getByText('Team Work')).toBeInTheDocument());
    await user.click(screen.getByText('Team Work'));

    // Submit form
    await user.click(screen.getByRole('button', { name: /finish setup/i }));

    await waitFor(() => {
      expect(mockSetDoc).toHaveBeenCalled();
      expect(mockAddDoc).toHaveBeenCalled();
      expect(mockNavigate).toHaveBeenCalledWith('/');
    });
  });

  it('handles form submission errors gracefully', async () => {
    const user = userEvent.setup();
    const alertSpy = vi.spyOn(window, 'alert').mockImplementation(() => {});
    
    // Mock setDoc to throw an error
    mockSetDoc.mockRejectedValue(new Error('Database error'));

    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    await user.click(screen.getByRole('button', { name: /finish setup/i }));

    await waitFor(() => {
      expect(alertSpy).toHaveBeenCalledWith('Database error');
    });

    alertSpy.mockRestore();
  });

  it('requires employer and job title for adding work experience', async () => {
    const user = userEvent.setup();
    
    render(
      <TestWrapper>
        <OnboardingForm />
      </TestWrapper>
    );

    // Try to add experience without required fields
    await user.click(screen.getByRole('button', { name: /add work experience/i }));

    // Should not add any experience items
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();

    // Add employer only
    await user.type(screen.getByLabelText(/employer/i), 'Test Company');
    await user.click(screen.getByRole('button', { name: /add work experience/i }));

    // Still should not add
    expect(screen.queryByRole('button', { name: /delete/i })).not.toBeInTheDocument();

    // Add job title
    await user.type(screen.getByLabelText(/job title/i), 'Test Role');
    await user.click(screen.getByRole('button', { name: /add work experience/i }));

    // Now it should add
    expect(screen.getByRole('button', { name: /delete/i })).toBeInTheDocument();
  });
});