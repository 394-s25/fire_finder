import React, { useState, useEffect } from "react";
import Navbar from "../components/NavBar";
import { Box, Tabs, Tab, Typography, Grid } from "@mui/material";
import ClassCard from "../components/ClassCard";
import TrainingCard from "../components/TrainingCard";
import TradeCard from "../components/TradeCard";
import ContactCard from "../components/ContactCard";
import ResourcesTab from "../components/ResourcesTab";
import { doc, collection, getDoc, getDocs } from "firebase/firestore";
import { auth, db } from "../services/firestoreConfig";

function TabPanel({ children, value, index }) {
  return (
    <div hidden={value !== index}>
      {value === index && <Box sx={{ p: 3 }}>{children}</Box>}
    </div>
  );
}

const Resources = () => {
  const user = auth.currentUser;
  const [tab, setTab] = useState(0);
  const [contacts, setContacts] = useState([]);
  const [trades, setTrades] = useState([]);
  const [trainings, setTrainings] = useState([]);
  const [savedTrades, setSavedTrades] = useState([]);

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
      <Box sx={{ pt: "112px", px: 2 }}>
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
          </Tabs>
        </Box>

        <Box sx={{ px: 2, pb: 5 }}>
          <TabPanel value={tab} index={0}>
            <ResourcesTab
              title="Training Resources"
              data={trainings}
              CardComponent={TrainingCard}
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
        </Box>
      </Box>
    </>
  );
};

export default Resources;
