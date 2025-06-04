import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { Box, Tabs, Tab } from "@mui/material";
import TrainingCardStudent from "../components/TrainingCardStudent";
import TrainingCardAdmin from "../components/TrainingCardAdmin";
import TradeCard from "../components/TradeCard";
import ContactCard from "../components/ContactCard";
import ResourcesTab from "../components/ResourcesTab";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import { useAuthContext } from "../services/userProvider";
import {
  Accordion,
  AccordionSummary,
  AccordionDetails,
  Typography,
  Dialog,
  DialogTitle,
  DialogContent,
  DialogActions,
  TextField,
  Button,
  Snackbar,
} from "@mui/material";
import ExpandMoreIcon from '@mui/icons-material/ExpandMore';
import { addDoc } from "firebase/firestore";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Resources = () => {
  const { user } = useAuthContext();
  const [tab, setTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [savedTrades, setSavedTrades] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    instructor: "",
    topic: "",
    duration: "",
  });
  const [snackbarMsg, setSnackbarMsg] = useState("");

  useEffect(() => {
    const fetchContacts = async () => {
      try {
        const snapshot = await getDocs(collection(db, "contacts"));
        const contactData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setContacts(contactData);
      } catch (error) {
        console.error("Error fetching contacts: ", error);
      }
    };
    fetchContacts();
  }, []);

  const handleCreateTraining = async () => {
    try {
      const docRef = await addDoc(collection(db, "trainings"), newTraining);
      setTrainings((prev) => [...prev, { id: docRef.id, ...newTraining }]);
      setSnackbarMsg("Training created successfully.");
      setOpenCreate(false);
      setNewTraining({
        title: "",
        description: "",
        instructor: "",
        topic: "",
        duration: "",
      });
    } catch (err) {
      console.error("Error creating training:", err);
      setSnackbarMsg("Failed to create training.");
    }
  };

  useEffect(() => {
    const fetchTrades = async () => {
      try {
        const snapshot = await getDocs(collection(db, "trades"));
        const tradeData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrades(tradeData);
      } catch (error) {
        console.error("Error fetching trades: ", error);
      }
    };
    const fetchSavedTrades = async () => {
      try {
        if (!user) return;
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (!studentDoc.exists()) return;
        const refs = studentDoc.data().interests || [];
        const trades = await Promise.all(
          refs.map(async (ref) => {
            const snap = await getDoc(ref);
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
          })
        );
        setSavedTrades(trades.filter(Boolean));
      } catch (error) {
        console.error("Error fetching saved trades: ", error);
      }
    };
    fetchTrades();
    fetchSavedTrades();
  }, [user]);

  useEffect(() => {
    const fetchTrainings = async () => {
      try {
        const snapshot = await getDocs(collection(db, "trainings"));
        const trainingsData = snapshot.docs.map((doc) => ({
          id: doc.id,
          ...doc.data(),
        }));
        setTrainings(trainingsData);
      } catch (error) {
        console.error("Error fetching trainings: ", error);
      }
    };
    fetchTrainings();
  }, []);

  const handleChange = (event, newValue) => {
    setTab(newValue);
  };

  return (
    <>
      <Navbar />
      <Box sx={{ pt: "110px" }}>
        <Box
          sx={{
            position: "absolute",
            top: "64px",
            left: 0,
            right: 0,
            zIndex: 1000,
          }}
        >
          <Tabs
            value={tab}
            onChange={handleChange}
            centered
            sx={{
              mt: 2,
              mb: 3,
              borderBottom: 1,
              borderColor: "#444",
              "& .MuiTab-root": {
                color: "#aaa",
                textTransform: "uppercase",
                fontWeight: "bold",
                "&Mui-selected": {
                  color: "#F26B3A",
                },
              },
              "& .MuiTabs-indicator": {
                backgroundColor: "#F26B3A",
              },
            }}
          >
            <Tab label="Training" />
            <Tab label="Trades" />
            <Tab label="Contacts" />
            <Tab label="My Resources" />
          </Tabs>
        </Box>

        <Box sx={{ px: 2, pb: 5 }}>
          <TabPanel value={tab} index={0}>
            {user?.isAdmin && (
              <Button
                onClick={() => setOpenCreate(true)}
                sx={{
                  border: "1px solid #f97316",
                  color: "#f97316",
                  textTransform: "none",
                  mb: 2,
                  alignSelf: "flex-start",
                  left: "-550px",
                }}
              >
                + Add Training
              </Button>
            )}
            <ResourcesTab
              title="Training Resources"
              data={trainings}
              CardComponent={
                user?.isAdmin ? TrainingCardAdmin : TrainingCardStudent
              }
            />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            {savedTrades.length > 0 && (
              <ResourcesTab
                title="Your Trades"
                data={savedTrades}
                CardComponent={TradeCard}
                extraProps={{ savedTrades, setSavedTrades }}
              />
            )}
            <ResourcesTab
              title="Trade Information"
              data={trades}
              CardComponent={TradeCard}
              extraProps={{ savedTrades, setSavedTrades }}
            />
          </TabPanel>

          <TabPanel value={tab} index={2}>
            <ResourcesTab
              title="Contacts"
              data={contacts}
              CardComponent={ContactCard}
            />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <Box
              sx={{
                flexDirection: "column",
                display: "flex",
                justifyContent: "flex-start",
                mt: -3,
              }}
            >
              <h1 style={{ fontWeight: "lighter" }}>My Resources</h1>
              <Box>
                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <Typography sx={{ fontSize: 23, fontWeight: "500" }}>
                      Trades
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails></AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <Typography sx={{ fontSize: 23, fontWeight: "500" }}>
                      Trainings
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails></AccordionDetails>
                </Accordion>

                <Accordion>
                  <AccordionSummary
                    expandIcon={<ExpandMoreIcon />}
                    sx={{ backgroundColor: "rgba(0, 0, 0, 0.1)" }}
                  >
                    <Typography sx={{ fontSize: 23, fontWeight: "500" }}>
                      Contacts
                    </Typography>
                  </AccordionSummary>
                  <AccordionDetails></AccordionDetails>
                </Accordion>
              </Box>
            </Box>
          </TabPanel>
        </Box>
      </Box>
      <Dialog open={openCreate} onClose={() => setOpenCreate(false)}>
        <DialogTitle>Create New Training</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Title"
            value={newTraining.title}
            onChange={(e) =>
              setNewTraining({ ...newTraining, title: e.target.value })
            }
          />
          <TextField
            label="Instructor"
            value={newTraining.instructor}
            onChange={(e) =>
              setNewTraining({ ...newTraining, instructor: e.target.value })
            }
          />
          <TextField
            label="Topic"
            value={newTraining.topic}
            onChange={(e) =>
              setNewTraining({ ...newTraining, topic: e.target.value })
            }
          />
          <TextField
            label="Duration"
            value={newTraining.duration}
            onChange={(e) =>
              setNewTraining({ ...newTraining, duration: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={newTraining.description}
            onChange={(e) =>
              setNewTraining({ ...newTraining, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenCreate(false)}>Cancel</Button>
          <Button onClick={handleCreateTraining} sx={{ color: "#f97316" }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Snackbar
        open={!!snackbarMsg}
        autoHideDuration={3000}
        onClose={() => setSnackbarMsg("")}
        message={snackbarMsg}
      />
    </>
  );
};

export default Resources;
