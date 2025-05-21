import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, db, googleProvider } from "../services/firestoreConfig";
import { useNavigate } from "react-router-dom";
import {
  Box,
  Button,
  TextField,
  Typography,
  Link,
  FormControlLabel,
  Checkbox,
  Snackbar,
  Alert,
} from "@mui/material";
import FormContainer from "../components/FormContainer";
import { doc, getDoc, setDoc } from "firebase/firestore";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const [requestAdmin, setRequestAdmin] = useState(false);
  const [snackbarOpen, setSnackbarOpen] = useState(null);
  const navigate = useNavigate();

  const submitAdminRequest = async (user) => {
    const requestRef = doc(db, "admin_requests", user.uid);
    await setDoc(requestRef, {
      uid: user.uid,
      displayName: user.displayName,
      email: user.email,
      timestamp: new Date(),
    });
  };

  const signupWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
      if (requestAdmin) {
        await submitAdminRequest(cred.user);
        setSnackbarOpen(true);
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const signupWithGoogle = async () => {
    try {
      const result = await signInWithPopup(auth, googleProvider);
      if (requestAdmin) {
        await submitAdminRequest(result.user);
        setSnackbarOpen(true);
      } else {
        navigate("/onboarding");
      }
    } catch (error) {
      alert(error.message);
    }
  };

  const handleCloseSnackbar = () => {
    setSnackbarOpen(false);
    navigate("/login");
  };

  return (
    <>
      <FormContainer title="Create Account">
        <TextField
          fullWidth
          label="Display Name"
          margin="normal"
          value={displayName}
          onChange={(e) => setDisplayName(e.target.value)}
        />
        <TextField
          fullWidth
          label="Email"
          margin="normal"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
        />
        <TextField
          fullWidth
          label="Password"
          type="password"
          margin="normal"
          value={password}
          onChange={(e) => setPassword(e.target.value)}
        />
        <FormControlLabel
          control={
            <Checkbox
              checked
              onChange={(e) => setRequestAdmin(e.target.value)}
            />
          }
          label="Request Admin Access"
          sx={{ mt: 1 }}
        />
        <Button
          fullWidth
          variant="contained"
          onClick={signupWithEmail}
          sx={{ mt: 2 }}
        >
          Create Account
        </Button>
        <Button
          fullWidth
          variant="outlined"
          onClick={signupWithGoogle}
          sx={{ mt: 1 }}
        >
          Create Account with Google
        </Button>
        <Link
          href="/login"
          underline="hover"
          sx={{ mt: 2, display: "block", textAlign: "center" }}
        >
          Already have an account? Log in
        </Link>
      </FormContainer>

      <Snackbar
        open={snackbarOpen}
        autoHideDuration={6000}
        onClose={handleCloseSnackbar}
        anchorOrigin={{ vertical: "bottom", horizontal: "center" }}
      >
        <Alert
          severity="info"
          onClose={handleCloseSnackbar}
          sx={{ width: "100%" }}
        >
          Your request for admin access has been submitted for approval. Please
          check back later.
        </Alert>
      </Snackbar>
    </>
  );
}
