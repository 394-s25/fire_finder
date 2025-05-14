import { useState } from "react";
import {
  createUserWithEmailAndPassword,
  updateProfile,
  signInWithPopup,
} from "firebase/auth";
import { auth, googleProvider } from "../services/firestoreConfig";
import { useNavigate } from "react-router-dom";
import { Box, Button, TextField, Typography, Link } from "@mui/material";
import FormContainer from "../components/FormContainer";

export default function SignupPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [displayName, setDisplayName] = useState("");
  const navigate = useNavigate();

  const signupWithEmail = async () => {
    try {
      const userCredential = await createUserWithEmailAndPassword(
        auth,
        email,
        password
      );
      await updateProfile(userCredential.user, { displayName });
      navigate("/onboarding");
    } catch (error) {
      alert(error.message);
    }
  };

  const signupWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/onboarding");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
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
  );
}
