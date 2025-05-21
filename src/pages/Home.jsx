import React, { useEffect, useState } from "react";
import Navbar from "../components/NavBar";
import ProfileCard from "../components/ProfileCard";
import NewPostModal from "../components/NewPost";
import PostsTabs from "../components/PostsTabs";
import SortDropdown from "../components/SortDropdown";
import PostCard from "../components/PostCard";
import SearchBar from "../components/HomeSearch";
import { useAuthContext } from "../services/userProvider";
import { collection, doc, getDoc, getDocs } from "firebase/firestore";
import { db } from "../services/firestoreConfig";

const Home = () => {
  const [tab, setTab] = useState(0);
  const [posts, setPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sortOption, setSortOption] = useState("Recent");
  const [search, setSearch] = useState("");
  const { user } = useAuthContext();

  useEffect(() => {
    const fetchPosts = async () => {
      const querySnapshot = await getDocs(collection(db, "posts"));
      const allPosts = querySnapshot.docs.map((doc) => ({
        id: doc.id,
        ...doc.data(),
      }));
      setPosts(allPosts);
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

    fetchPosts();
    fetchSaved();
  }, [user]);

  const filteredPosts = (tab === 0 ? posts : savedPosts)
    .filter((post) => post.text?.toLowerCase().includes(search.toLowerCase()))
    .sort((a, b) => {
      if (sortOption === "Recent") {
        return b.timestamp?.seconds - a.timestamp?.seconds;
      } else if (sortOption === "Popular") {
        return (b.likes || 0) - (a.likes || 0);
      } else if (sortOption === "Most Liked") {
        return (b.likes || 0) - (a.likes || 0);
      }
      return 0;
    });
  console.log(filteredPosts);

  return (
    <>
      <Navbar />
      <ProfileCard />
      <NewPostModal />
      <div
        style={{
          marginLeft: "340px",
          marginRight: "40px",
          paddingTop: "120px",
        }}
      >
        <PostsTabs value={tab} setValue={setTab} />
        <SearchBar value={search} onChange={setSearch} />
        <SortDropdown value={sortOption} onChange={setSortOption} />
        <div style={{ marginTop: "100px" }}>
          {filteredPosts.map((post) => (
            <PostCard post={post} />
          ))}
        </div>
      </div>
    </>
  );
};

export default Home;
