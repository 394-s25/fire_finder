import React, { useEffect, useState } from "react";
import {
  Card,
  CardContent,
  CardMedia,
  Avatar,
  Typography,
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
    <Card
      sx={{
        position: "fixed",
        top: { xs: "100px", sm: "110px", md: "110px" },
        left: { xs: "0px", sm: "15px", md: "15px" },
        width: { xs: "100%", sm: "325px", md: "325px" },
        height: { xs: "auto", sm: "200px", md: "200px" },
        backgroundColor: "rgb(255, 251, 251)",
        boxShadow: "0 2px 4px rgba(0,0,0,0.3)",
        overflow: "hidden",
      }}
    >
      <CardMedia
        sx={{
          height: { xs: "60px", sm: "80px", md: "80px" },
          width: "100%",
          borderTopLeftRadius: "4px",
          borderTopRightRadius: "4px",
        }}
        component="img"
        image={banner}
        alt="Banner Image"
      />
      <CardContent
        sx={{ display: "flex", flexDirection: "column", alignItems: "center" }}
      >
        <Avatar
          sx={{
            width: { xs: 50, sm: 70, md: 70 },
            height: { xs: 50, sm: 70, md: 70 },
            marginTop: { xs: "-35px", sm: "-50px", md: "-50px" },
            zIndex: 1,
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
            marginBottom: "4px",
            fontSize: { xs: "1rem", sm: "1.25rem", md: "1.25rem" },
          }}
        >
          {student?.displayName || "USERNAME"}
        </Typography>
        <Typography
          variant="body2"
          sx={{
            marginTop: { xs: "-5px", sm: "-5px", md: "-5px" },
            fontFamily: '"Times New Roman", Georgia, serif',
            color: "gray",
            textAlign: "center",
            overflow: "hidden",
            textOverflow: "ellipsis",
            display: "-webkit-box",
            WebkitLineClamp: 2,
            WebkitBoxOrient: "vertical",
            fontSize: { xs: "0.75rem", sm: "0.875rem", md: "0.875rem" },
          }}
        >
          {student?.bio || "No bio provided."}
        </Typography>
      </CardContent>
    </Card>
  );
};

export default ProfileCard;
