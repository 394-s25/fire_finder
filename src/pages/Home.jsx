import { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import ProfileCard from "../components/ProfileCard";
import NewPostModal from "../components/NewPost";
import PostCard from "../components/PostCard";
import { useAuthContext } from "../services/userProvider";
import {
  collection,
  doc,
  getDoc,
  getDocs,
  orderBy,
  query,
} from "firebase/firestore";
import { db } from "../services/firestoreConfig";
import {
  Box,
  Typography,
  InputBase,
  styled,
  Select,
  MenuItem,
  Tabs,
  Tab,
  Paper,
} from "@mui/material";

const StyledInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    borderRadius: "25px",
    backgroundColor: "transparent",
    border: "1px solid #ddd",
    fontSize: 14,
    padding: "5px 15px",
    transition: theme.transitions.create(["border-color", "box-shadow"]),
    "&:focus": {
      borderColor: "#ddd",
      boxShadow: "0 0 0 0.2rem rgba(0,0,0,0.05)",
    },
  },
}));

const MinimalInput = styled(InputBase)(({ theme }) => ({
  "& .MuiInputBase-input": {
    fontSize: 14,
    padding: "5px 26px 5px 12px",
    color: "inherit",
    width: "100px",
    textOverflow: "ellipsis",
    whiteSpace: "nowrap",
    "&:focus": {
      backgroundColor: "transparent",
    },
  },
  "& .MuiSelect-icon": {
    color: "inherit",
  },
}));

const Home = () => {
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sortOption, setSortOption] = useState("Recent");
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();

  const fetchPosts = async () => {
    try {
      const q = query(collection(db, "posts"), orderBy("timestamp", "desc"));
      const querySnapshot = await getDocs(q);
      const allPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(allPosts);
    } catch (error) {
      console.error("Error fetching posts:", error);
    }
  };

  const fetchSaved = async () => {
    if (!user) return;
    try {
      const studentSnap = await getDoc(doc(db, "students", user.uid));
      const savedRefs = studentSnap.data()?.posts || [];
      const saved = await Promise.all(
        savedRefs.map(async (ref) => {
          const snap = await getDoc(ref);
          return snap.exists() ? { id: snap.id, ...snap.data() } : null;
        })
      );
      setSavedPosts(saved.filter(Boolean));
    } catch (error) {
      console.error("Error fetching saved posts: ", error);
    }
  };

  useEffect(() => {
    fetchPosts();
    fetchSaved();
  }, [user]);

  const handlePostCreated = () => {
    fetchPosts();
  };

  const filteredPosts = (tab === 0 ? posts : savedPosts)
    .filter((post) => post.text?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "Recent") {
        const aTime =
          a.timestamp?.seconds ||
          (a.timestamp?.toDate?.() ? a.timestamp.toDate().getTime() / 1000 : 0);
        const bTime =
          b.timestamp?.seconds ||
          (b.timestamp?.toDate?.() ? b.timestamp.toDate().getTime() / 1000 : 0);
        return bTime - aTime;
      } else if (sortOption === "Popular" || sortOption === "Most Liked") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });

  return (
    <>
      <Navbar />
      <Box display="flex" justifyContent="center" mt={10} px={2}>
        <Box
          flex={1}
          maxWidth="300px"
          display={{ xs: "none", md: "block" }}
          mr={2}
        >
          <ProfileCard />
          <NewPostModal onPostCreated={handlePostCreated} />
        </Box>

        <Box flex={2} maxWidth="700px">
          <Paper elevation={1} sx={{ mb: 2, p: 1.5, borderRadius: 2 }}>
            <Tabs
              value={tab}
              onChange={(e, newValue) => setTab(newValue)}
              centered
              indicatorColor="primary"
              textColor="primary"
              sx={{
                minHeight: "36px",
                "& .MuiTab-root": {
                  minHeight: "36px",
                  padding: "6px 12px",
                  fontFamily: '"Times New Roman", Georgia, serif',
                  fontSize: { xs: "0.5rem", sm: ".8rem", md: ".8rem" },
                },
              }}
            >
              <Tab label="Feed" />
              <Tab label="Saved" />
            </Tabs>
            <Box display="flex" alignItems="center" gap={2} mt={2}>
              <StyledInput
                value={search}
                onChange={(e) => setSearch(e.target.value)}
                placeholder="Search"
                sx={{ flex: 1 }}
              />
              <Box display="flex" alignItems="center" gap={1}>
                <Typography variant="body2" sx={{ color: "gray" }}>
                  Sort:
                </Typography>
                <Select
                  value={sortOption}
                  onChange={(e) => setSortOption(e.target.value)}
                  input={<MinimalInput />}
                >
                  <MenuItem value="Popular">Popular</MenuItem>
                  <MenuItem value="Recent">Date</MenuItem>
                  <MenuItem value="Most Liked">Newest</MenuItem>
                </Select>
              </Box>
            </Box>
          </Paper>
          <Box>
            {filteredPosts.length === 0 ? (
              <Typography
                variant="body1"
                sx={{
                  textAlign: "center",
                  color: "gray",
                  mt: 4,
                  fontStyle: "italic",
                }}
              >
                {tab === 0
                  ? "No posts yet. Create the first one!"
                  : "No saved posts yet."}
              </Typography>
            ) : (
              filteredPosts.map((post) => (
                <PostCard key={post.id} post={post} onSaveToggle={fetchSaved} />
              ))
            )}
          </Box>
        </Box>
      </Box>
    </>
  );
};

export default Home;
