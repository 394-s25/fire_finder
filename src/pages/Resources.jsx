import { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { Box, Tabs, Tab } from "@mui/material";
import TrainingCard from "../components/TrainingCardStudent";
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
import TradeCardAdmin from "../components/TradeCardAdmin";


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
  const [savedTrainings, setSavedTrainings] = useState([]);
  const [savedContacts, setSavedContacts] = useState([]);
  const [openCreate, setOpenCreate] = useState(false);
  const [openTradeDialog, setOpenTradeDialog] = useState(false);
  const [openContactDialog, setOpenContactDialog] = useState(false);
  const [newTraining, setNewTraining] = useState({
    title: "",
    description: "",
    instructor: "",
    topic: "",
    duration: "",
  });
  const [newTrade, setNewTrade] = useState({
    name: "",
    description: "",
    category: "",
  });
  const [newContact, setNewContact] = useState({
    name: "",
    role: "",
    email: "",
    phone: "",
    image: "",
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

  const handleCreateContact = async () => {
    try {
      const docRef = await addDoc(collection(db, "contacts"), newContact);
      setContacts((prev) => [...prev, { id: docRef.id, ...newContact }]);
      set("Contact added successfully.");
      setOpenContactDialog(false);
      setNewContact({ name: "", role: "", email: "", phone: "", image: "" });
    } catch (err) {
      console.error("Error creating contact:", err);
      setSnackbarMsg("Failed to create contact.");
    }
  };

  const handleDeleteContact = async (id) => {
    try {
      await deleteDoc(doc(db, "contacts", id));
      setContacts((prev) => prev.filter((c) => c.id !== id));
      setSnackbarMsg("Contact deleted.");
    } catch (err) {
      console.error("Error deleting contact:", err);
      setSnackbarMsg("Failed to delete contact.");
    }
  };

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

  const handleCreateTrade = async () => {
    try {
      const docRef = await addDoc(collection(db, "trades"), newTrade);
      setTrades((prev) => [...prev, { id: docRef.id, ...newTrade }]);
      setSnackbarMsg("Trade created successfully.");
      setOpenTradeDialog(false);
      setNewTrade({ name: "", description: "", category: "" });
    } catch (err) {
      console.error("Error creating trade:", err);
      setSnackbarMsg("Failed to create trade.");
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
    const fetchSavedTrainings = async () => {
      try {
        if (!user) return;
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (!studentDoc.exists()) return;
        const refs = studentDoc.data().trainings || [];
        const trainings = await Promise.all(
          refs.map(async (ref) => {
            const snap = await getDoc(ref);
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
          })
        );
        setSavedTrainings(trainings.filter(Boolean));
      } catch (error) {
        console.error("Error fetching saved trainings: ", error);
      }
    };
    const fetchSavedContacts = async () => {
      try {
        if (!user) return;
        const studentDoc = await getDoc(doc(db, "students", user.uid));
        if (!studentDoc.exists()) return;
        const refs = studentDoc.data().contacts || [];
        const contacts = await Promise.all(
          refs.map(async (ref) => {
            const snap = await getDoc(ref);
            return snap.exists() ? { id: snap.id, ...snap.data() } : null;
          })
        );
        setSavedContacts(contacts.filter(Boolean));
      } catch (error) {
        console.error("Error fetching saved contacts: ", error);
      }
    };
    fetchTrades();
    fetchSavedTrades();
    fetchSavedTrainings();
    fetchSavedContacts();
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
                }}
              >
                + Add Training
              </Button>
            )}
            <ResourcesTab
              title="Training Resources"
              data={trainings}
              CardComponent={TrainingCard}
              extraProps={{ savedTrainings, setSavedTrainings }}
            />
          </TabPanel>

          <TabPanel value={tab} index={1}>
            <ResourcesTab
              title="Trade Information"
              data={trades}
              CardComponent={user?.isAdmin ? TradeCardAdmin : TradeCard}
              extraProps={
                user?.isAdmin
                  ? {
                      onDelete: (id) =>
                        setTrades(trades.filter((t) => t.id !== id)),
                    }
                  : { savedTrades, setSavedTrades }
              }
            />
          </TabPanel>

          <TabPanel value={tab} index={2}>
            {user?.isAdmin && (
              <Button
                onClick={() => setOpenContactDialog(true)}
                sx={{
                  border: "1px solid #f97316",
                  color: "#f97316",
                  textTransform: "none",
                  mb: 2,
                  alignSelf: "flex-start",
                }}
              >
                + Add Contact
              </Button>
            )}
            <ResourcesTab
              title="Contacts"
              data={contacts}
              CardComponent={ContactCard}
              extraProps={{ savedContacts, setSavedContacts }}
            />
          </TabPanel>
          <TabPanel value={tab} index={3}>
            <Box sx={{flexDirection: "column", display: "flex", justifyContent:"flex-start", mt: -3}}>
                <h1 style = {{fontWeight:"lighter"}}>My Resources</h1>
                <Box>
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx = {{backgroundColor:"rgba(0, 0, 0, 0.1)"}}>
                      <Typography sx = {{fontSize:23, fontWeight:"500"}}>Trades</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ResourcesTab
                        title="Your Saved Trades"
                        data={savedTrades}
                        CardComponent={TradeCard}
                        extraProps={{ savedTrades, setSavedTrades }}
                      />
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx = {{backgroundColor:"rgba(0, 0, 0, 0.1)"}}>
                      <Typography sx = {{fontSize:23, fontWeight:"500"}}>Trainings</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ResourcesTab
                        title="Your Saved Trainings"
                        data={savedTrainings}
                        CardComponent={TrainingCard}
                        extraProps={{ savedTrainings, setSavedTrainings }}
                      />
                    </AccordionDetails>
                  </Accordion>
                  
                  <Accordion>
                    <AccordionSummary expandIcon={<ExpandMoreIcon />} sx = {{backgroundColor:"rgba(0, 0, 0, 0.1)"}}>
                      <Typography sx = {{fontSize:23, fontWeight:"500"}}>Contacts</Typography>
                    </AccordionSummary>
                    <AccordionDetails>
                      <ResourcesTab
                        title="Your Saved Contacts"
                        data={savedContacts}
                        CardComponent={ContactCard}
                        extraProps={{ savedContacts, setSavedContacts }}
                      />
                    </AccordionDetails>
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

      <Dialog open={openTradeDialog} onClose={() => setOpenTradeDialog(false)}>
        <DialogTitle>Create New Trade</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Trade Name"
            value={newTrade.name}
            onChange={(e) => setNewTrade({ ...newTrade, name: e.target.value })}
          />
          <TextField
            label="Category"
            value={newTrade.category}
            onChange={(e) =>
              setNewTrade({ ...newTrade, category: e.target.value })
            }
          />
          <TextField
            label="Description"
            multiline
            minRows={3}
            value={newTrade.description}
            onChange={(e) =>
              setNewTrade({ ...newTrade, description: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenTradeDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateTrade} sx={{ color: "#f97316" }}>
            Create
          </Button>
        </DialogActions>
      </Dialog>

      <Dialog
        open={openContactDialog}
        onClose={() => setOpenContactDialog(false)}
      >
        <DialogTitle>Create New Contact</DialogTitle>
        <DialogContent
          sx={{ display: "flex", flexDirection: "column", gap: 2, mt: 1 }}
        >
          <TextField
            label="Name"
            value={newContact.name}
            onChange={(e) =>
              setNewContact({ ...newContact, name: e.target.value })
            }
          />
          <TextField
            label="Role"
            value={newContact.role}
            onChange={(e) =>
              setNewContact({ ...newContact, role: e.target.value })
            }
          />
          <TextField
            label="Email"
            value={newContact.email}
            onChange={(e) =>
              setNewContact({ ...newContact, email: e.target.value })
            }
          />
          <TextField
            label="Phone"
            value={newContact.phone}
            onChange={(e) =>
              setNewContact({ ...newContact, phone: e.target.value })
            }
          />
          <TextField
            label="Image URL"
            value={newContact.image}
            onChange={(e) =>
              setNewContact({ ...newContact, image: e.target.value })
            }
          />
        </DialogContent>
        <DialogActions>
          <Button onClick={() => setOpenContactDialog(false)}>Cancel</Button>
          <Button onClick={handleCreateContact} sx={{ color: "#f97316" }}>
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