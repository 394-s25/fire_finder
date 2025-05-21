import React, { useEffect, useState } from "react";
import {
  Card,
  CardHeader,
  CardContent,
  CardMedia,
  Box,
  Typography,
  IconButton,
  Avatar,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import { useAuthContext } from "../services/userProvider";
import { doc, getDoc, updateDoc } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

const PostCard = ({ post }) => {
  const { user } = useAuthContext();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);

  useEffect(() => {
    const fetchSaved = async () => {
      if (!user || !post?.id) return;
      const studentSnap = await getDoc(doc(db, "students", user.uid));
      const savedRefs = studentSnap.data()?.posts || [];
      const isBookmarked = savedRefs.some(
        (ref) => ref.path === `posts/${post.id}`
      );
      setIsSaved(isBookmarked);
    };
    fetchSaved();
  }, [user, post?.id]);

  const toggleLike = async () => {
    const newLiked = !liked;
    setLiked(newLiked);
    setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));
    await updateDoc(doc(db, "posts", post.id), {
      likes: newLiked ? likeCount + 1 : likeCount - 1,
    });
  };

  const toggleSave = async () => {
    if (!user) return;

    const studentRef = doc(db, "students", user.uid);
    const postRef = doc(db, "posts", post.id);
    const studentSnap = await getDoc(studentRef);
    const current = studentSnap.data()?.posts || [];

    const updated = isSaved
      ? current.filter((ref) => ref.path !== postRef.path)
      : [...current, postRef];

    await updateDoc(studentRef, { posts: updated });
    setIsSaved(!isSaved);
  };

  return (
    <Card
      sx={{
        mb: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        width: "100%",
        maxWidth: "700px",
        zIndex: -1,
      }}
    >
      <CardHeader
        avatar={<Avatar src={post.authorPic || ""} />}
        title={
          <Box
            sx={{
              display: "flex",
              alignItems: "start",
              flexDirection: "column",
            }}
          >
            <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
              {post.author || "Anon"}
            </Typography>
            <Typography variant="caption" sx={{ fontSize: "0.8rem" }}>
              {post.followers || 0} followers
            </Typography>
          </Box>
        }
        sx={{ pb: 0.5, pt: 1.5 }}
      />
      <CardContent sx={{ pt: 1.5, pb: 1.5, pl: 1.5, pr: 1.5 }}>
        <Typography variant="body2" sx={{ fontSize: "0.9rem" }}>
          {post.text}
        </Typography>
      </CardContent>
      {post.images?.length > 0 && (
        <Box
          sx={{
            display: "flex",
            overflowX: "auto",
            "&::-webkit-scrollbar": {
              height: "8px",
            },
            "&::-webkit-scrollbar-track": {
              background: "#f1f1f1",
            },
            "&::-webkit-scrollbar-thumb": {
              background: "rgb(120, 60, 60)", // Reddish-maroon
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgb(140, 70, 60)",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgb(120, 60, 60) #f1f1f1",
            scrollSnapType: "x mandatory",
          }}
        >
          {post.images.map((img, idx) => (
            <CardMedia
              key={idx}
              component="img"
              sx={{
                flex: "0 0 auto",
                width: "300px",
                height: "350px",
                objectFit: "cover",
                scrollSnapAlign: "center",
                pr: 0.5,
                pl: 0.5,
                pb: 0.5,
              }}
              image={img}
              alt={`Post image ${idx + 1}`}
            />
          ))}
        </Box>
      )}
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          p: 1,
          px: 2,
          borderTop: "1px solid #ddd",
          pt: 1.5,
        }}
      >
        <Box sx={{ display: "flex", alignItems: "center" }}>
          <IconButton onClick={toggleLike}>
            <FavoriteIcon sx={{ color: liked ? "rgb(175, 4, 4)" : "gray" }} />
          </IconButton>
          <Typography variant="caption" sx={{ ml: 0.5 }}>
            {likeCount}
          </Typography>
        </Box>
        <IconButton>
          {isSaved ? (
            <BookmarkIcon sx={{ color: "#783c3c" }} />
          ) : (
            <BookmarkBorderIcon sx={{ color: "#783c3c" }} />
          )}
        </IconButton>
        <IconButton>
          <ShareIcon sx={{ color: "rgb(120, 60, 60)" }} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default PostCard;
