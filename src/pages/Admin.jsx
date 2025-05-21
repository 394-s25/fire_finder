import { Navigate } from "react-router-dom";
import { useAuthContext } from "../services/userProvider";
import Navbar from "../components/NavBar";
import { useEffect, useState } from "react";
import {
  collection,
  deleteDoc,
  doc,
  getDoc,
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

export default function Admin() {
  const { user } = useAuthContext();
  if (!user?.isAdmin) return <Navigate to="/" />;

  const [requests, setRequests] = useState([]);
  const [loading, setLoading] = useState(true);

  const fetchRequests = async () => {
    const snapshot = await getDocs(collection(db, "admin_requests"));
    const list = snapshot.docs.map((doc) => ({ id: doc.id, ...doc.data() }));
    setRequests(list);
    setLoading(false);
  };

  useEffect(() => {
    fetchRequests();
  }, []);

  const approveRequest = async (request) => {
    const studentRef = doc(db, "students", request.uid);
    await setDoc(studentRef, { isAdmin: true }, { merge: true });
    await deleteDoc(doc(db, "admin_requests", request.id));
    fetchRequests();
  };

  return (
    <>
      <Navbar />
      <Box sx={{ pt: "112px", px: 2, maxWidth: 800, mx: "auto" }}>
        <Typography variant="h5" gutterBottom>
          Admin Requests
        </Typography>
        {loading ? (
          <CircularProgress />
        ) : requests.length === 0 ? (
          <Typography>No pending requests</Typography>
        ) : (
          requests.map((req) => (
            <Paper
              key={req.id}
              sx={{
                mb: 2,
                p: 2,
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
              }}
            >
              <Box>
                <Typography>
                  {req.displayName} - {req.email}
                </Typography>
                <Typography variant="caption" color="text.secondary">
                  Requested: {req.timestamp?.toDate().toLocaleString()}
                </Typography>
              </Box>
              <Button variant="contained" onClick={() => approveRequest(req)}>
                Approve
              </Button>
            </Paper>
          ))
        )}
      </Box>
    </>
  );
}
