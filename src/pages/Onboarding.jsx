import { useEffect, useState } from "react";
import {
  Box,
  Button,
  TextField,
  Typography,
  MenuItem,
  Select,
  InputLabel,
  Paper,
  FormControl,
  Chip,
  OutlinedInput,
  Autocomplete,
} from "@mui/material";
import { useNavigate } from "react-router-dom";
import {
  addDoc,
  doc,
  getDocs,
  setDoc,
  collection,
  query,
  where,
} from "firebase/firestore";
import { auth, db } from "../services/firestoreConfig";
import FormContainer from "../components/FormContainer";

const schoolYears = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"];

export default function OnboardingForm() {
  const [tradeOptions, setTradeOptions] = useState([]);
  const [interests, setInterests] = useState([]);
  const [year, setYear] = useState("");
  const [experienceList, setExperienceList] = useState([]);
  const [expForm, setExpForm] = useState({
    employer: "",
    jobTitle: "",
    start: "",
    end: "",
  });
  const [skills, setSkills] = useState([]);
  const [selectedSkills, setSelectedSkills] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "trades"));
        const options = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setTradeOptions(options);
      } catch (error) {
        console.error("Error fetching trades: ", error);
      }
    };
    fetchTrades();
  }, []);

  useEffect(() => {
    const fetchSkills = async () => {
      try {
        const snapshot = await getDocs(collection(db, "skills"));
        const options = snapshot.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
        }));
        setSkills(options);
      } catch (error) {
        console.error("Error fetching skills: ", error);
      }
    };
    fetchSkills();
  }, []);

  const handleSubmit = async () => {
    const user = auth.currentUser;
    if (!user) return alert("Not logged in");

    const interestRefs = interests.map((id) => doc(db, "trades", id));
    const skillsRefs = collection(db, "skills");

    const skillRefs = await Promise.all(
      selectedSkills.map(async (skill) => {
        if (skill.id) return doc(db, "skills", skill.id);
        const existing = await getDocs(
          query(skillsRefs, where("name", "==", skill.name))
        );
        if (!existing.empty) return existing.docs[0].ref;
        const newSkill = await addDoc(skillsRefs, { name: skill.name });
        return newSkill;
      })
    );

    try {
      await setDoc(doc(db, "students", user.uid), {
        uid: user.uid,
        displayName: user.displayName || "",
        email: user.email,
        interests: interestRefs,
        year,
        skills: skillRefs,
      });
      
      for (const exp of experienceList) {
        await addDoc(collection(db, "students", user.uid, "experience"), exp);
      }
      navigate("/");
    } catch (error) {
      alert(error.message);
    }
  };
  
  return (
    <FormContainer title="Tell Us About You">
      <FormControl fullWidth margin="normal">
        <InputLabel id="trade-interests-label">Trade Interests</InputLabel>
        <Select
          labelId="trade-interests-label"
          id="trade-interests"
          multiple
          value={interests}
          onChange={(e) => setInterests(e.target.value)}
          input={<OutlinedInput label="Trade Interests" />}
          renderValue={(selected) => (
            <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
              {selected.map((id) => {
                const trade = tradeOptions.find((t) => t.id === id);
                return <Chip key={id} label={trade?.name || id} />;
              })}
            </Box>
          )}
        >
          {tradeOptions.map((trade) => (
            <MenuItem key={trade.id} value={trade.id}>
              {trade.name}
            </MenuItem>
          ))}
        </Select>
      </FormControl>
      
      <FormControl fullWidth margin="normal">
        <InputLabel id = "school-year-label">Current School Year</InputLabel>
        <Select
          labelId="school-year-label"
          id="school-year"
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

      <Paper elevation={2} sx={{ p: 2, mt: 2 }}>
        <Typography variant="h6" fontWeight="bold" gutterBottom>
          Add Work Experience
        </Typography>

        <TextField
          fullWidth
          label="Employer"
          value={expForm.employer}
          onChange={(e) => setExpForm({ ...expForm, employer: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Job Title"
          value={expForm.jobTitle}
          onChange={(e) => setExpForm({ ...expForm, jobTitle: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="Start Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={expForm.start}
          onChange={(e) => setExpForm({ ...expForm, start: e.target.value })}
          margin="normal"
        />
        <TextField
          fullWidth
          label="End Date"
          type="date"
          InputLabelProps={{ shrink: true }}
          value={expForm.end}
          onChange={(e) => setExpForm({ ...expForm, end: e.target.value })}
          margin="normal"
        />
        <Button
          fullWidth
          variant="outlined"
          onClick={() => {
            if (expForm.employer && expForm.jobTitle) {
              setExperienceList([...experienceList, expForm]);
              setExpForm({ employer: "", jobTitle: "", start: "", end: "" });
            }
          }}
          sx={{ mt: 2 }}
        >
          Add Work Experience
        </Button>
      </Paper>

      {experienceList.map((exp, index) => (
        <Paper
          key={index}
          elevation={1}
          sx={{
            mt: 2,
            p: 2,
            borderRadius: 2,
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
          }}
        >
          <Box>
            <Typography fontWeight="bold">{exp.jobTitle}</Typography>
            <Typography>{exp.employer}</Typography>
            <Typography variant="body2" sx={{ color: "text.secondary" }}>
              {exp.start} – {exp.end || "Present"}
            </Typography>
          </Box>
          <Button
            variant="text"
            color="error"
            size="small"
            onClick={() => {
              const updated = [...experienceList];
              updated.splice(index, 1);
              setExperienceList(updated);
            }}
          >
            Delete
          </Button>
        </Paper>
      ))}

      <Autocomplete
        multiple
        freeSolo
        fullWidth
        options={skills}
        getOptionLabel={(option) =>
          typeof option === "string" ? option : option.name
        }
        value={selectedSkills}
        onChange={(_, newValue) => {
          const unique = newValue.map((item) =>
            typeof item === "string" ? { name: item } : item
          );
          setSelectedSkills(unique);
        }}
        filterSelectedOptions
        renderTags={(value, getTagProps) =>
          value.map((option, index) => (
            <Chip
              label={typeof option === "string" ? option : option.name}
              {...getTagProps({ index })}
              key={index}
            />
          ))
        }
        renderInput={(params) => (
          <TextField
            {...params}
            label="Skills"
            placeholder="Start typing to search..."
            margin="normal"
          />
        )}
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
