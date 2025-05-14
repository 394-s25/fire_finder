import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { auth, googleProvider } from "../services/firestoreConfig";
import { signInWithEmailAndPassword, signInWithPopup } from "firebase/auth";
import { Button, TextField, Box, Typography, Link } from "@mui/material";
import FormContainer from "../components/FormContainer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const login = async () => {
    try {
      await signInWithEmailAndPassword(auth, email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  const loginWithGoogle = async () => {
    try {
      await signInWithPopup(auth, googleProvider);
      navigate("/");
    } catch (err) {
      alert(err.message);
    }
  };

  return (
    <FormContainer title="Log In">
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
      <Button fullWidth variant="contained" onClick={login} sx={{ mt: 2 }}>
        Login
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={loginWithGoogle}
        sx={{ mt: 1 }}
      >
        Login with Google
      </Button>
      <Link
        href="/signup"
        underline="hover"
        sx={{ mt: 2, display: "block", textAlign: "center" }}
      >
        Don't have an account? Create one
      </Link>
    </FormContainer>
  );
}
