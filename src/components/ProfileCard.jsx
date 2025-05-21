import { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
  Box,
} from "@mui/material";
import banner from "../imgs/banner.png";
import { useAuthContext } from "../services/userProvider";
import { doc, getDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

const ProfileCard = () => {
  const { user } = useAuthContext();
  const [student, setStudent] = useState(null);

  useEffect(() => {
    const fetchStudent = async () => {
      if (!user) return;
      try {
        const studentRef = doc(db, "students", user.uid);
        const docSnap = await getDoc(studentRef);
        setStudent(docSnap.data());
      } catch (error) {
        console.error("Error fetching student data: ", error);
      }
    };
    fetchStudent();
  }, [user]);

  return (
    <Box sx={{ mb: 3, position: "relative" }}>
      <Card
        sx={{
          width: "100%",
          backgroundColor: "rgb(255, 251, 251)",
          boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
          overflow: "hidden",
          borderRadius: 2,
        }}
      >
        <CardMedia
          sx={{
            height: 80,
            width: "100%",
          }}
          component="img"
          image={banner}
          alt="Banner"
        />
        <CardContent
          sx={{
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            pt: 0,
          }}
        >
          <Avatar
            sx={{
              width: 70,
              height: 70,
              mt: -4,
              mb: 1,
              border: "3px solid white",
            }}
            alt={student?.displayName || "userProfile"}
            src={student?.profilePicture || ""}
          />
          <Typography
            variant="h6"
            sx={{
              fontFamily: '"Times New Roman", Georgia, serif',
              fontWeight: "bold",
              mb: 0.5,
              fontSize: "1.1rem",
            }}
          >
            {student?.displayName || "USERNAME"}
          </Typography>
          <Typography
            variant="body2"
            sx={{
              fontFamily: '"Times New Roman", Georgia, serif',
              color: "gray",
              textAlign: "center",
              overflow: "hidden",
              textOverflow: "ellipsis",
              display: "-webkit-box",
              WebkitLineClamp: 2,
              WebkitBoxOrient: "vertical",
              fontSize: "0.875rem",
            }}
          >
            {student?.bio || "No bio provided."}
          </Typography>
        </CardContent>
      </Card>
    </Box>
  );
};

export default ProfileCard;
