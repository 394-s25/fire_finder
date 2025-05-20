import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { useAuthContext } from "../services/userProvider";
import { Button, TextField, Box, Typography, Link } from "@mui/material";
import FormContainer from "../components/FormContainer";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const { loginWithEmail, loginWithGoogle } = useAuthContext();

  const login = async () => {
    setLoading(true);
    try {
      await loginWithEmail(email, password);
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
    }
  };

  const handleLoginWithGoogle = async () => {
    setLoading(true);
    try {
      await loginWithGoogle();
      navigate("/");
    } catch (err) {
      alert(err.message);
    } finally {
      setLoading(false);
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
        disabled={loading}
      />
      <TextField
        fullWidth
        label="Password"
        type="password"
        margin="normal"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        disabled={loading}
      />
      <Button
        fullWidth
        variant="contained"
        onClick={login}
        sx={{ mt: 2 }}
        disabled={loading}
      >
        Login
      </Button>
      <Button
        fullWidth
        variant="outlined"
        onClick={handleLoginWithGoogle}
        sx={{ mt: 1 }}
        disabled={loading}
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
