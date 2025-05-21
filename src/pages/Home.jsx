import React from "react";
import Navbar from "../components/NavBar";
import ProfileCard from "../components/ProfileCard";
import NewPostModal from "../components/NewPost";
import PostsTabs from "../components/PostsTabs";
import SortDropdown from "../components/SortDropdown";
import PostCard from "../components/PostCard";
import SearchBar from "../components/HomeSearch";

const Home = () => {
  return (
    <>
      <Navbar />
      <ProfileCard />
      <NewPostModal />
      <PostsTabs />
      <SearchBar />
      <SortDropdown />
      <PostCard />
    </>
  );
};

export default Home;
