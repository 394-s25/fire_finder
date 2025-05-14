import { useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  FormControl,
  Chip,
  OutlinedInput,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import { doc, setDoc } from "firebase/firestore";
import { auth, db } from "../services/firestoreConfig";
import FormContainer from "../components/FormContainer";

const tradeOptions = [
  "Electrician",
  "Plumber",
  "Welder",
  "Carpenter",
  "HVAC Technician",
  "Mechanic",
  "Construction Worker",
];

const schoolYears = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"];

export default function OnboardingForm() {
  const [interests, setInterests] = useState([]);
  const [year, setYear] = useState("");
  const [experience, setExperience] = useState("");
  const [skills, setSkills] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    try {
      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email,
        interests,
        year,
        experience,
        skills,
      });
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };

  return (
    <FormContainer title="Tell Us About You">
      <FormControl fullWidth margin="normal">
        <InputLabel>Trade Interests</InputLabel>
        <Select
          multiple
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          input={<OutlinedInput label="Trade Interests" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((value) => (
                <Chip key={value} label={value} />
              ))}
            </Box>
          )}
        >
          {tradeOptions.map((trade) => (
            <MenuItem key={trade} value={trade}>
              {trade}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <FormControl fullWidth margin="normal">
        <InputLabel>Current School Year</InputLabel>
        <Select
          value={year}
          onChange={(e) => setYear(e.target.value)}
          label="Current School Year"
        >
          {schoolYears.map((yr) => (
            <MenuItem key={yr} value={yr}>
              {yr}
            </MenuItem>
          ))}
        </Select>
      </FormControl>

      <TextField
        fullWidth
        label="Work Experience"
        multiline
        rows={4}
        margin="normal"
        value={experience}
        onChange={(e) => setExperience(e.target.value)}
      />

      <TextField
        fullWidth
        label="Skills"
        multiline
        rows={2}
        margin="normal"
        value={skills}
        onChange={(e) => setSkills(e.target.value)}
        placeholder="e.g. teamwork, problem solving, power tools"
      />

      <Button
        fullWidth
        variant="contained"
        sx={{ mt: 3 }}
        onClick={handleSubmit}
      >
        Finish Setup
      </Button>
    </FormContainer>
  );
}
