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
  Button,
  LinearProgress,
} from "@mui/material";
import FavoriteIcon from "@mui/icons-material/Favorite";
import BookmarkIcon from "@mui/icons-material/Bookmark";
import BookmarkBorderIcon from "@mui/icons-material/BookmarkBorder";
import ShareIcon from "@mui/icons-material/Share";
import PollIcon from "@mui/icons-material/Poll";
import CheckCircleIcon from "@mui/icons-material/CheckCircle";
import { useAuthContext } from "../services/userProvider";
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
} from "firebase/firestore";
import { db } from "../services/firestoreConfig";

const PostCard = ({ post, onSaveToggle }) => {
  const { user } = useAuthContext();

  const [liked, setLiked] = useState(false);
  const [likeCount, setLikeCount] = useState(0);
  const [isSaved, setIsSaved] = useState(false);
  const [hasVoted, setHasVoted] = useState(false);
  const [currentVoteIndex, setCurrentVoteIndex] = useState(-1);
  const [pollOptions, setPollOptions] = useState([]);

  useEffect(() => {
    if (post) {
      setLiked(post.likedBy?.includes(user?.uid) || false);
      setLikeCount(post.likes || 0);

      // Initialize poll data if it's a poll
      if (post.isPoll && post.pollOptions) {
        setPollOptions(post.pollOptions);
        
        // Find which option the user voted for
        let userVoteIndex = -1;
        const userHasVoted = post.pollOptions.some((option, index) => {
          if (option.votedBy?.includes(user?.uid)) {
            userVoteIndex = index;
            return true;
          }
          return false;
        });
        
        setHasVoted(userHasVoted);
        setCurrentVoteIndex(userVoteIndex);
      }

      const checkIfSaved = async () => {
        if (!user || !post?.id) return;
        try {
          const studentSnap = await getDoc(doc(db, "students", user.uid));
          const savedRefs = studentSnap.data()?.posts || [];
          const isBookmarked = savedRefs.some(
            (ref) => ref.path === `posts/${post.id}`
          );
          setIsSaved(isBookmarked);
        } catch (error) {
          console.error("Error checking saved status:", error);
        }
      };

      checkIfSaved();
    }
  }, [user, post]);

  const isPollActive = () => {
    if (!post.isPoll) return false;
    if (!post.pollEndTime) return true; // No end time means always active
    const now = new Date();
    const endTime = post.pollEndTime.toDate ? post.pollEndTime.toDate() : new Date(post.pollEndTime);
    return now < endTime;
  };

  const getTotalVotes = () => {
    return pollOptions.reduce((total, option) => total + (option.votes || 0), 0);
  };

  const getVotePercentage = (votes) => {
    const total = getTotalVotes();
    return total > 0 ? (votes / total) * 100 : 0;
  };

  const toggleLike = async () => {
    if (!user || !post?.id) return;

    try {
      const newLiked = !liked;
      const postRef = doc(db, "posts", post.id);

      setLiked(newLiked);
      setLikeCount((prev) => (newLiked ? prev + 1 : prev - 1));

      if (newLiked) {
        await updateDoc(postRef, {
          likes: likeCount + 1,
          likedBy: arrayUnion(user.uid),
        });
      } else {
        await updateDoc(postRef, {
          likes: Math.max(0, likeCount - 1),
          likedBy: arrayRemove(user.uid),
        });
      }
    } catch (error) {
      console.error("Error toggling like:", error);
      setLiked((prev) => !prev);
      setLikeCount((prev) => (liked ? prev + 1 : prev - 1));
    }
  };

  const toggleSave = async () => {
    if (!user || !post?.id) return;

    try {
      const studentRef = doc(db, "students", user.uid);
      const postRef = doc(db, "posts", post.id);

      const newSavedState = !isSaved;
      setIsSaved(newSavedState);

      const studentSnap = await getDoc(studentRef);
      const currentSaved = studentSnap.data()?.posts || [];
      const updatedSaved = newSavedState
        ? [...currentSaved, postRef]
        : currentSaved.filter((ref) => ref.path !== postRef.path);

      await updateDoc(studentRef, { posts: updatedSaved });

      if (onSaveToggle) {
        onSaveToggle();
      }
    } catch (error) {
      console.error("Error toggling save:", error);
      setIsSaved((prev) => !prev);
    }
  };

  const handleVote = async (optionIndex) => {
    if (!user || !post?.id || !isPollActive()) return;

    try {
      const postRef = doc(db, "posts", post.id);
      const updatedOptions = [...pollOptions];
      
      // If user already voted, remove their previous vote
      if (hasVoted && currentVoteIndex !== -1) {
        updatedOptions[currentVoteIndex].votes = Math.max(0, (updatedOptions[currentVoteIndex].votes || 0) - 1);
        updatedOptions[currentVoteIndex].votedBy = updatedOptions[currentVoteIndex].votedBy?.filter(uid => uid !== user.uid) || [];
      }
      
      // Add vote to selected option
      updatedOptions[optionIndex].votes = (updatedOptions[optionIndex].votes || 0) + 1;
      updatedOptions[optionIndex].votedBy = updatedOptions[optionIndex].votedBy || [];
      updatedOptions[optionIndex].votedBy.push(user.uid);

      // Update local state
      setPollOptions(updatedOptions);
      setHasVoted(true);
      setCurrentVoteIndex(optionIndex);

      // Update Firestore
      await updateDoc(postRef, {
        pollOptions: updatedOptions
      });

    } catch (error) {
      console.error("Error voting:", error);
      // Revert local state on error
      setPollOptions(post.pollOptions);
      const userVoteIndex = post.pollOptions.findIndex(option => 
        option.votedBy?.includes(user?.uid)
      );
      setHasVoted(userVoteIndex !== -1);
      setCurrentVoteIndex(userVoteIndex);
    }
  };

  const handleShare = () => {
    if (navigator.share) {
      navigator
        .share({
          title: `Post by ${post.authorName || "Anonymous"}`,
          text: post.text,
          url: window.location.href,
        })
        .catch(console.error);
    } else {
      navigator.clipboard
        .writeText(window.location.href)
        .then(() => {
          console.log("Link copied to clipboard");
        })
        .catch(console.error);
    }
  };

  const formatTimestamp = (timestamp) => {
    if (!timestamp) return "";

    let date;
    if (timestamp.seconds) {
      date = new Date(timestamp.seconds * 1000);
    } else if (timestamp.toDate) {
      date = timestamp.toDate();
    } else {
      date = new Date(timestamp);
    }

    const now = new Date();
    const diffInHours = (now - date) / (1000 * 60 * 60);

    if (diffInHours < 1) {
      return `${Math.floor(diffInHours * 60)}m ago`;
    } else if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h ago`;
    } else {
      return `${Math.floor(diffInHours / 24)}d ago`;
    }
  };

  const formatPollEndTime = () => {
    if (!post.pollEndTime) return null;
    const endTime = post.pollEndTime.toDate ? post.pollEndTime.toDate() : new Date(post.pollEndTime);
    const now = new Date();
    
    if (now >= endTime) {
      return "Poll ended";
    }
    
    const diffInHours = (endTime - now) / (1000 * 60 * 60);
    if (diffInHours < 24) {
      return `${Math.floor(diffInHours)}h left`;
    } else {
      return `${Math.floor(diffInHours / 24)}d left`;
    }
  };
  
  return (
    <Card
      sx={{
        mb: 2,
        border: "1px solid #ddd",
        borderRadius: 2,
        width: "100%",
        maxWidth: "700px",
        height: "auto",
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
            <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
              <Typography variant="h6" sx={{ fontSize: "1.1rem" }}>
                {post.authorName || post.author || "Anonymous"}
              </Typography>
              {post.isPoll && (
                <PollIcon sx={{ color: "rgb(175, 4, 4)", fontSize: "1.1rem" }} />
              )}
            </Box>
            <Typography
              variant="caption"
              sx={{ fontSize: "0.8rem", color: "gray" }}
            >
              {formatTimestamp(post.timestamp)}
            </Typography>
          </Box>
        }
        sx={{ pb: 0.5, pt: 1.5 }}
      />
      
      <CardContent sx={{ pt: 1.5, pb: 1.5, pl: 1.5, pr: 1.5, backgroundColor: "rgb(250, 250, 250)" }}>
        <Typography variant="body2" sx={{ fontSize: "0.9rem", mb: post.isPoll ? 2 : 0 }}>
          {post.text}
        </Typography>
        
        {/* Poll Options */}
        {post.isPoll && (
          <Box>
            {pollOptions.map((option, index) => {
              const isCurrentVote = currentVoteIndex === index;
              const canVote = isPollActive();
              
              return (
                <Box key={index} sx={{ mb: 1 }}>
                  <Button
                    fullWidth
                    variant={hasVoted ? "outlined" : "contained"}
                    onClick={() => handleVote(index)}
                    disabled={!canVote}
                    sx={{
                      justifyContent: "flex-start",
                      textAlign: "left",
                      position: "relative",
                      backgroundColor: hasVoted ? "transparent" : "white",
                      color: hasVoted ? (isCurrentVote ? "rgb(175, 4, 4)" : "rgb(120, 60, 60)") : "rgb(175, 4, 4)",
                      borderColor: isCurrentVote ? "rgb(175, 4, 4)" : "rgb(175, 4, 4)",
                      borderWidth: isCurrentVote ? 2 : 1,
                      "&:hover": {
                        backgroundColor: hasVoted ? "rgba(175, 4, 4, 0.1)" : "rgba(175, 4, 4, 0.9)",
                        borderColor: "rgb(175, 4, 4)",
                      },
                      "&:disabled": {
                        backgroundColor: hasVoted ? "transparent" : "rgba(0, 0, 0, 0.12)",
                        color: hasVoted ? (isCurrentVote ? "rgb(175, 4, 4)" : "rgb(120, 60, 60)") : "rgba(0, 0, 0, 0.26)",
                        borderColor: isCurrentVote ? "rgb(175, 4, 4)" : "rgba(0, 0, 0, 0.26)",
                      },
                    }}
                  >
                    <Box sx={{ width: "100%", display: "flex", justifyContent: "space-between", alignItems: "center" }}>
                      <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                        {isCurrentVote && (
                          <CheckCircleIcon 
                            sx={{ 
                              fontSize: "1rem", 
                              color: canVote ? "rgb(175, 4, 4)" : "rgb(120, 60, 60)" 
                            }} 
                          />
                        )}
                        <Typography sx={{ fontSize: "0.9rem" }}>
                          {option.text}
                        </Typography>
                      </Box>
                      {hasVoted && (
                        <Typography sx={{ fontSize: "0.8rem", fontWeight: "bold" }}>
                          {option.votes || 0} ({Math.round(getVotePercentage(option.votes || 0))}%)
                        </Typography>
                      )}
                    </Box>
                    {hasVoted && (
                      <LinearProgress
                        variant="determinate"
                        value={getVotePercentage(option.votes || 0)}
                        sx={{
                          position: "absolute",
                          bottom: 0,
                          left: 0,
                          right: 0,
                          height: 3,
                          backgroundColor: "rgba(175, 4, 4, 0.1)",
                          "& .MuiLinearProgress-bar": {
                            backgroundColor: isCurrentVote ? "rgb(175, 4, 4)" : "rgb(120, 60, 60)",
                          },
                        }}
                      />
                    )}
                  </Button>
                </Box>
              );
            })}
            
            {/* Poll Status */}
            <Box sx={{ display: "flex", justifyContent: "space-between", alignItems: "center", mt: 1 }}>
              <Typography variant="caption" sx={{ color: "gray" }}>
                {getTotalVotes()} votes
              </Typography>
              <Box sx={{ display: "flex", alignItems: "center", gap: 1 }}>
                {hasVoted && isPollActive() && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: "rgb(175, 4, 4)",
                      fontStyle: "italic"
                    }}
                  >
                    Click another option to change your vote
                  </Typography>
                )}
                {post.pollEndTime && (
                  <Typography 
                    variant="caption" 
                    sx={{ 
                      color: isPollActive() ? "rgb(175, 4, 4)" : "gray",
                      fontWeight: isPollActive() ? "bold" : "normal"
                    }}
                  >
                    {formatPollEndTime()}
                  </Typography>
                )}
              </Box>
            </Box>
          </Box>
        )}
      </CardContent>
      
      {/* Regular Post Images */}
      {!post.isPoll && post.images?.length > 0 && (
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
              background: "rgb(120, 60, 60)",
              borderRadius: "4px",
            },
            "&::-webkit-scrollbar-thumb:hover": {
              background: "rgb(140, 70, 60)",
            },
            scrollbarWidth: "thin",
            scrollbarColor: "rgb(120, 60, 60) #f1f1f1",
            scrollSnapType: "x mandatory",
            backgroundColor: "rgb(250, 250, 250)" 
          }}
        >
          {post.images.map((img, idx) => (
            <CardMedia
              key={idx}
              component="img"
              sx={{
                flex: "0 0 auto",
                width: "auto",
                minWidth: "300px",
                maxWidth: "690px",
                height: "auto",
                maxHeight: "400px",
                objectFit: "contain",
                scrollSnapAlign: "center",
                pr: 0.5,
                pl: 0.5,
                pb: 0.5,
                backgroundColor: "rgb(250, 250, 250)" 
              }}
              image={img}
              alt={`Post image ${idx + 1}`}
            />
          ))}
        </Box>
      )}
      
      {/* Action Buttons */}
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
        <IconButton onClick={toggleSave}>
          {isSaved ? (
            <BookmarkIcon sx={{ color: "#783c3c" }} />
          ) : (
            <BookmarkBorderIcon sx={{ color: "#783c3c" }} />
          )}
        </IconButton>
        <IconButton onClick={handleShare}>
          <ShareIcon sx={{ color: "rgb(120, 60, 60)" }} />
        </IconButton>
      </Box>
    </Card>
  );
};

export default PostCard;