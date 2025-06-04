import { Navigate } from "react-router-dom";
import { useAuthContext } from "../services/userProvider";
import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDocs,
  setDoc,
} from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import {
  Box,
  Typography,
  CircularProgress,
  Paper,
  Button,
} from "@mui/material";
import AdminAccess from "../components/adminAccess";
import TotalStudentsCard from "../components/TotalStudentsCard";
import UpcomingEventCard from "../components/UpcomingEventCard";

export default function Admin() {
  const { user } = useAuthContext();
  if (!user?.isAdmin) return <Navigate to="/" />;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const [upcomingEvent, setUpcomingEvent] = useState(null);
  const [previousEvent, setPreviousEvent] = useState(null);
  const [rsvpChange, setRsvpChange] = useState(null);
  const [totalStudents, setTotalStudents] = useState(null);

  useEffect(() => {
    fetchRequests();
    fetchEventStats();
    fetchTotalStudents();
  }, []);

  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, "admin_requests"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(list);
    setLoading(false);
  };

  const fetchTotalStudents = async () => {
    const snapshot = await getDocs(collection(db, "students"));
    setTotalStudents(snapshot.size);
  };

  const fetchEventStats = async () => {
    const snapshot = await getDocs(collection(db, "events"));
    const events = snapshot.docs
      .map((doc) => {
        const data = doc.data();
        return {
          id: doc.id,
          name: data.title || "Unnamed Event",
          startDate: data.startDate?.toDate?.(), // safely call toDate if exists
          rsvpCount: Array.isArray(data.rsvp) ? data.rsvp.length : 0,
        };
      })
      .filter((event) => event.startDate); // Ensure valid dates

    const today = new Date();

    const upcoming = events
      .filter((e) => e.startDate > today)
      .sort((a, b) => a.startDate - b.startDate)[0];

    const previous = events
      .filter((e) => e.startDate <= today)
      .sort((a, b) => b.startDate - a.startDate)[0];

    setUpcomingEvent(upcoming || null);
    setPreviousEvent(previous || null);

    if (upcoming) {
      const previousCount = previous?.rsvpCount ?? 0;
      const change =
        previousCount === 0
          ? 0 // Show 0% if no previous data
          : ((upcoming.rsvpCount - previousCount) / previousCount) * 100;

      setRsvpChange(Math.round(change * 10) / 10);
    }
  };

  const approveRequest = async (request) => {
    const studentRef = doc(db, "students", request.uid);
    await setDoc(studentRef, { isAdmin: true }, { merge: true });
    await deleteDoc(doc(db, "admin_requests", request.id));
    fetchRequests();
  };

  return (
    <>
      <Navbar />
      <Box sx={{ pt: "112px", px: 2, maxWidth: 900, mx: "auto" }}>
        <Box sx={{ display: "flex", gap: 2, flexWrap: "wrap" }}>
          {totalStudents !== null && (
            <TotalStudentsCard total={totalStudents} />
          )}
          {upcomingEvent && rsvpChange !== null && (
            <UpcomingEventCard
              name={upcomingEvent.name}
              rsvps={upcomingEvent.rsvpCount}
              percentChange={rsvpChange}
            />
          )}
        </Box>
        <Box sx={{ mt: 4 }}>
          {loading ? (
            <CircularProgress />
          ) : (
            <AdminAccess requests={requests} approveRequest={approveRequest} />
          )}
        </Box>
      </Box>
    </>
  );
}
