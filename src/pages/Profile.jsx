import {
  Avatar,
  Box,
  Typography,
  Chip,
  Divider,
  IconButton,
  Paper,
  CircularProgress,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  Button,
  Select,
  MenuItem,
  OutlinedInput,
  FormControl,
  InputLabel,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import { auth, db } from "../services/firestoreConfig";
import { doc, getDoc, getDocs, collection, setDoc } from "firebase/firestore";
import Navbar from "../components/NavBar";

function Section({ title, children, onEdit }) {
  return (
    <Box>
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography fontWeight="bold">{title}</Typography>
        {onEdit && (
          <IconButton size="small" onClick={onEdit}>
            <EditIcon fontSize="small" />
          </IconButton>
        )}
      </Box>
      <Box sx={{ mt: 1 }}>{children}</Box>
      <Divider sx={{ mt: 2 }} />
    </Box>
  );
}

const Profile = () => {
  const user = auth.currentUser;
  const [studentData, setStudentData] = useState(null);
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  const [editInterestsOpen, setEditInterestsOpen] = useState(false);
  const [allTrades, setAllTrades] = useState([]);
  const [selectedTradeRefs, setSelectedTradeRefs] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) return;

        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (!studentSnap.exists()) return;

        const data = studentSnap.data();
        setStudentData(data);

        const trades = await Promise.all(
          (data.interests || []).map(async (ref) => {
            const docSnap = await getDoc(ref);
            return docSnap.exists() ? docSnap.data().name : "(Unknown)";
          })
        );
        setInterests(trades);

        const skillNames = await Promise.all(
          (data.skills || []).map(async (ref) => {
            const docSnap = await getDoc(ref);
            return docSnap.exists() ? docSnap.data().name : "(Unknown)";
          })
        );
        setSkills(skillNames);

        const expSnap = await getDocs(
          collection(db, "students", user.uid, "experience")
        );
        const expList = expSnap.docs.map((doc) => doc.data());
        setExperience(expList);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data: ", error);
      }
    };
    fetchData();
  }, [user]);

  useEffect(() => {
    const loadTrades = async () => {
      try {
        const snap = await getDocs(collection(db, "trades"));
        const trades = snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          ref: doc.ref,
        }));
        setAllTrades(trades);
      } catch (error) {
        console.error("Error fetching all trades: ", error);
      }
    };
    loadTrades();
  }, []);

  const openEditInterests = () => {
    setSelectedTradeRefs(studentData.interests || []);
    setEditInterestsOpen(true);
  };

  const saveInterests = async () => {
    const studentRef = doc(db, "students", user.uid);
    await setDoc(studentRef, { interests: selectedTradeRefs }, { merge: true });
    setEditInterestsOpen(false);
    window.location.reload();
  };

  if (loading) {
    return (
      <Box sx={{ pt: "112px", textAlign: "center" }}>
        <CircularProgress />
      </Box>
    );
  }

  return (
    <>
      <Navbar />
      <Box
        sx={{ pt: "112px", px: 2, display: "flex", justifyContent: "center" }}
      >
        <Box
          sx={{
            width: "100%",
            maxWidth: 800,
            bgcolor: "#fff",
            border: "1px solid #ccc",
            borderRadius: 3,
            boxShadow: 1,
            p: 3,
          }}
        >
          <Box
            sx={{
              backgroundColor: "#b91c1c",
              color: "white",
              p: 3,
              borderRadius: 3,
              display: "flex",
              alignItems: "center",
              gap: 2,
            }}
          >
            <Avatar sx={{ width: 80, height: 80 }} />
            <Box>
              <Typography variant="h6" fontWeight="bold">
                {studentData?.displayName || user?.displayName || "Student"}
              </Typography>
              <Typography>{studentData?.email || user?.email}</Typography>
              <Typography>0 Following, 0 Followers</Typography>
            </Box>
          </Box>
          <Box sx={{ mt: 4, display: "flex", flexDirection: "column", gap: 3 }}>
            <Section title="Interested In" onEdit={openEditInterests}>
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {interests.map((trade, idx) => (
                  <Chip
                    key={idx}
                    label={trade}
                    variant="outlined"
                    color="primary"
                  />
                ))}
              </Box>
            </Section>
            <Section title="Skills">
              <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                {skills.map((skill, idx) => (
                  <Chip
                    key={idx}
                    label={skill}
                    variant="outlined"
                    color="secondary"
                  />
                ))}
              </Box>
            </Section>
            <Section title="School Year">
              <Typography>{studentData?.year || "Not specified"}</Typography>
            </Section>
            <Section title="Work Experience">
              {experience.length === 0 ? (
                <Typography>No experience added yet.</Typography>
              ) : (
                experience.map((exp, idx) => (
                  <Paper key={idx} sx={{ pt: 2, mb: 1 }}>
                    <Typography fontWeight="bold">
                      {exp.jobTitle || "Job Title"}
                    </Typography>
                    <Typography>{exp.employer}</Typography>
                    <Typography
                      variant="body2"
                      sx={{ color: "text.secondary" }}
                    >
                      {exp.start || "Start"} - {exp.end || "Present"}
                    </Typography>
                  </Paper>
                ))
              )}
            </Section>
          </Box>
        </Box>
      </Box>
      <Dialog
        open={editInterestsOpen}
        onClose={() => setEditInterestsOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Trade Interests</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Trade Interests</InputLabel>
            <Select
              multiple
              value={selectedTradeRefs}
              onChange={(e) => setSelectedTradeRefs(e.target.value)}
              input={<OutlinedInput label="Trade Interests" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((ref) => {
                    const trade = allTrades.find(
                      (t) => t.ref.path === ref.path
                    );
                    return (
                      <Chip key={ref.path} label={trade?.name || "Unknown"} />
                    );
                  })}
                </Box>
              )}
            >
              {allTrades.map((trade) => (
                <MenuItem key={trade.id} value={trade.ref}>
                  {trade.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditInterestsOpen(false)}>Cancel</Button>
          <Button onClick={saveInterests} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
