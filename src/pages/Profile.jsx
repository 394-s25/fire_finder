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
  TextField,
  Tabs,
  Tab,
} from "@mui/material";
import EditIcon from "@mui/icons-material/Edit";
import { useState, useEffect } from "react";
import { auth, db } from "../services/firestoreConfig";
import {
  doc,
  getDoc,
  getDocs,
  collection,
  setDoc,
  deleteDoc,
} from "firebase/firestore";
import Navbar from "../components/NavBar";
import { useAuthContext } from "../services/userProvider";

const schoolYears = ["9th Grade", "10th Grade", "11th Grade", "12th Grade"];

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

// TabPanel component to handle tab content
function TabPanel({ children, value, index, ...other }) {
  return (
    <div
      role="tabpanel"
      hidden={value !== index}
      id={`profile-tabpanel-${index}`}
      aria-labelledby={`profile-tab-${index}`}
      {...other}
    >
      {value === index && <Box sx={{ pt: 3 }}>{children}</Box>}
    </div>
  );
}

const Profile = () => {
  const { user } = useAuthContext();
  const [studentData, setStudentData] = useState(null);
  const [interests, setInterests] = useState([]);
  const [skills, setSkills] = useState([]);
  const [experience, setExperience] = useState([]);
  const [loading, setLoading] = useState(true);

  // Tab state
  const [tabValue, setTabValue] = useState(0);

  const [editInterestsOpen, setEditInterestsOpen] = useState(false);
  const [allTrades, setAllTrades] = useState([]);
  const [selectedTradeRefs, setSelectedTradeRefs] = useState([]);

  const [editSkillsOpen, setEditSkillsOpen] = useState(false);
  const [allSkills, setAllSkills] = useState([]);
  const [selectedSkillRefs, setSelectedSkillRefs] = useState([]);

  const [editYearOpen, setEditYearOpen] = useState(false);
  const [selectedYear, setSelectedYear] = useState("");

  const [editExpOpen, setEditExpOpen] = useState(false);
  const [experienceToEdit, setExperienceToEdit] = useState(null);

  // Handle tab change
  const handleTabChange = (event, newValue) => {
    setTabValue(newValue);
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        if (!user) {
          setLoading(false);
          return;
        }

        const studentRef = doc(db, "students", user.uid);
        const studentSnap = await getDoc(studentRef);
        if (!studentSnap.exists()) {
          setLoading(false);
          return;
        }

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
        const expList = expSnap.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setExperience(expList);

        setLoading(false);
      } catch (error) {
        console.error("Error fetching student data: ", error);
        setLoading(false);
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
    const loadSkills = async () => {
      try {
        const snap = await getDocs(collection(db, "skills"));
        const skills = snap.docs.map((doc) => ({
          id: doc.id,
          name: doc.data().name,
          ref: doc.ref,
        }));
        setAllSkills(skills);
      } catch (error) {
        console.error("Error fetching skills: ", error);
      }
    };
    loadTrades();
    loadSkills();

    // Only set selectedYear when studentData is available
    if (studentData) {
      setSelectedYear(studentData.year || "");
    }
  }, [studentData]);

  const openEditInterests = () => {
    setSelectedTradeRefs(studentData.interests || []);
    setEditInterestsOpen(true);
  };

  const saveInterests = async () => {
    try {
      const studentRef = doc(db, "students", user.uid);
      await setDoc(
        studentRef,
        { interests: selectedTradeRefs },
        { merge: true }
      );

      // Update state directly
      setStudentData({
        ...studentData,
        interests: selectedTradeRefs,
      });

      // Refresh the interests display
      const trades = await Promise.all(
        selectedTradeRefs.map(async (ref) => {
          const docSnap = await getDoc(ref);
          return docSnap.exists() ? docSnap.data().name : "(Unknown)";
        })
      );
      setInterests(trades);
      setEditInterestsOpen(false);
    } catch (error) {
      console.error("Error saving interests:", error);
      alert("Failed to save interests: " + error.message);
    }
  };

  const openEditSkills = () => {
    setSelectedSkillRefs(studentData.skills || []);
    setEditSkillsOpen(true);
  };

  const saveSkills = async () => {
    try {
      const studentRef = doc(db, "students", user.uid);
      await setDoc(studentRef, { skills: selectedSkillRefs }, { merge: true });

      // Update state directly
      setStudentData({
        ...studentData,
        skills: selectedSkillRefs,
      });

      // Refresh skills display
      const skillNames = await Promise.all(
        selectedSkillRefs.map(async (ref) => {
          const docSnap = await getDoc(ref);
          return docSnap.exists() ? docSnap.data().name : "(Unknown)";
        })
      );
      setSkills(skillNames);
      setEditSkillsOpen(false);
    } catch (error) {
      console.error("Error saving skills:", error);
      alert("Failed to save skills: " + error.message);
    }
  };

  const saveYear = async () => {
    try {
      const studentRef = doc(db, "students", user.uid);
      await setDoc(studentRef, { year: selectedYear }, { merge: true });

      // Update state directly
      setStudentData({
        ...studentData,
        year: selectedYear,
      });
      setEditYearOpen(false);
    } catch (error) {
      console.error("Error saving school year:", error);
      alert("Failed to save school year: " + error.message);
    }
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

          {/* Tabs */}
          <Box sx={{ mt: 2, borderBottom: 1, borderColor: "divider" }}>
            <Tabs
              value={tabValue}
              onChange={handleTabChange}
              aria-label="profile tabs"
              variant="fullWidth"
            >
              <Tab
                label="About"
                id="profile-tab-0"
                aria-controls="profile-tabpanel-0"
              />
              <Tab
                label="Saved Events"
                id="profile-tab-1"
                aria-controls="profile-tabpanel-1"
              />
            </Tabs>
          </Box>

          {/* About Tab */}
          <TabPanel value={tabValue} index={0}>
            <Box sx={{ display: "flex", flexDirection: "column", gap: 3 }}>
              <Section title="Interested In" onEdit={openEditInterests}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {interests.length > 0 ? (
                    interests.map((trade, idx) => (
                      <Chip
                        key={idx}
                        label={trade}
                        variant="outlined"
                        color="primary"
                      />
                    ))
                  ) : (
                    <Typography>
                      No interests added yet. Click the edit button to add some.
                    </Typography>
                  )}
                </Box>
              </Section>
              <Section title="Skills" onEdit={openEditSkills}>
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 1 }}>
                  {skills.length > 0 ? (
                    skills.map((skill, idx) => (
                      <Chip
                        key={idx}
                        label={skill}
                        variant="outlined"
                        color="secondary"
                      />
                    ))
                  ) : (
                    <Typography>
                      No skills added yet. Click the edit button to add some.
                    </Typography>
                  )}
                </Box>
              </Section>
              <Section title="School Year" onEdit={() => setEditYearOpen(true)}>
                <Typography>{studentData?.year || "Not specified"}</Typography>
              </Section>
              <Section title="Work Experience">
                {experience.length === 0 ? (
                  <Typography>No experience added yet.</Typography>
                ) : (
                  experience.map((exp, idx) => (
                    <Paper
                      key={idx}
                      sx={{ pt: 2, mb: 1, position: "relative" }}
                    >
                      <IconButton
                        size="small"
                        sx={{ position: "absolute", top: 8, right: 8 }}
                        onClick={() => {
                          setExperienceToEdit({ ...exp, id: exp.id });
                          setEditExpOpen(true);
                        }}
                      >
                        <EditIcon fontSize="small" />
                      </IconButton>
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
                <Button
                  variant="outlined"
                  sx={{ mt: 2 }}
                  onClick={() => {
                    setExperienceToEdit({
                      jobTitle: "",
                      employer: "",
                      start: "",
                      end: "",
                    });
                    setEditExpOpen(true);
                  }}
                >
                  + Add Work Experience
                </Button>
              </Section>
            </Box>
          </TabPanel>

          {/* Saved Events Tab */}
          <TabPanel value={tabValue} index={1}>
            <Box sx={{ py: 3, textAlign: "center" }}>
              <Typography variant="body1">
                You don't have any saved events yet.
              </Typography>
            </Box>
          </TabPanel>
        </Box>
      </Box>

      {/* Dialog components remain the same */}
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
                      <Chip
                        key={ref.path}
                        label={trade?.name || "Unknown"}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setSelectedTradeRefs((prev) =>
                            prev.filter((r) => r.path !== ref.path)
                          );
                        }}
                      />
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

      {/* Other dialogs remain the same */}
      <Dialog
        open={editSkillsOpen}
        onClose={() => setEditSkillsOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit Skills</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>Skills</InputLabel>
            <Select
              multiple
              value={selectedSkillRefs}
              onChange={(e) => setSelectedSkillRefs(e.target.value)}
              input={<OutlinedInput label="Skills" />}
              renderValue={(selected) => (
                <Box sx={{ display: "flex", flexWrap: "wrap", gap: 0.5 }}>
                  {selected.map((ref) => {
                    const skill = allSkills.find(
                      (s) => s.ref.path === ref.path
                    );
                    return (
                      <Chip
                        key={ref.path}
                        label={skill?.name || "Unknown"}
                        onMouseDown={(e) => e.stopPropagation()}
                        onDelete={(e) => {
                          e.stopPropagation();
                          setSelectedSkillRefs((prev) =>
                            prev.filter((r) => r.path !== ref.path)
                          );
                        }}
                      />
                    );
                  })}
                </Box>
              )}
            >
              {allSkills.map((skill) => (
                <MenuItem key={skill.id} value={skill.ref}>
                  {skill.name}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditSkillsOpen(false)}>Cancel</Button>
          <Button onClick={saveSkills} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editYearOpen}
        onClose={() => setEditYearOpen(false)}
        fullWidth
      >
        <DialogTitle>Edit School Year</DialogTitle>
        <DialogContent>
          <FormControl fullWidth margin="normal">
            <InputLabel>School Year</InputLabel>
            <Select
              value={selectedYear}
              label="School Year"
              onChange={(e) => setSelectedYear(e.target.value)}
            >
              {schoolYears.map((year) => (
                <MenuItem key={year} value={year}>
                  {year}
                </MenuItem>
              ))}
            </Select>
          </FormControl>
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setEditYearOpen(false)}>Cancel</Button>
          <Button onClick={saveYear} variant="contained">
            Save
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={editExpOpen}
        onClose={() => setEditExpOpen(false)}
        fullWidth
      >
        {experienceToEdit?.id ? (
          <DialogTitle>Edit Work Experience</DialogTitle>
        ) : (
          <DialogTitle>Add Work Experience</DialogTitle>
        )}
        <DialogContent>
          <TextField
            fullWidth
            label="Job Title"
            margin="normal"
            value={experienceToEdit?.jobTitle || ""}
            onChange={(e) =>
              setExperienceToEdit({
                ...experienceToEdit,
                jobTitle: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Employer"
            margin="normal"
            value={experienceToEdit?.employer || ""}
            onChange={(e) =>
              setExperienceToEdit({
                ...experienceToEdit,
                employer: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="Start Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={experienceToEdit?.start || ""}
            onChange={(e) =>
              setExperienceToEdit({
                ...experienceToEdit,
                start: e.target.value,
              })
            }
          />
          <TextField
            fullWidth
            label="End Date"
            type="date"
            margin="normal"
            InputLabelProps={{ shrink: true }}
            value={experienceToEdit?.end || ""}
            onChange={(e) =>
              setExperienceToEdit({ ...experienceToEdit, end: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          {experienceToEdit?.id && (
            <Button
              color="error"
              onClick={async () => {
                try {
                  await deleteDoc(
                    doc(
                      db,
                      "students",
                      user.uid,
                      "experience",
                      experienceToEdit.id
                    )
                  );

                  // Update state instead of reloading
                  setExperience(
                    experience.filter((exp) => exp.id !== experienceToEdit.id)
                  );
                  setEditExpOpen(false);
                } catch (error) {
                  console.error("Error deleting experience:", error);
                  alert("Failed to delete experience: " + error.message);
                }
              }}
            >
              Delete
            </Button>
          )}
          <Button onClick={() => setEditExpOpen(false)}>Cancel</Button>
          <Button
            variant="contained"
            onClick={async () => {
              try {
                const { id, ...data } = experienceToEdit;
                const expRef = id
                  ? doc(db, "students", user.uid, "experience", id)
                  : doc(collection(db, "students", user.uid, "experience"));

                await setDoc(expRef, data, { merge: true });

                // Update state instead of reloading
                if (id) {
                  // If editing existing, update it
                  setExperience(
                    experience.map((exp) =>
                      exp.id === id ? { id, ...data } : exp
                    )
                  );
                } else {
                  // If adding new, add to list with new ID
                  const newId = expRef.id;
                  setExperience([...experience, { id: newId, ...data }]);
                }

                setEditExpOpen(false);
              } catch (error) {
                console.error("Error saving experience:", error);
                alert("Failed to save experience: " + error.message);
              }
            }}
          >
            Save
          </Button>
        </DialogActions>
      </Dialog>
    </>
  );
};

export default Profile;
