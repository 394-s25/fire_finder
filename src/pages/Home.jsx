import React from 'react';
import Navbar from '../components/NavBar';
import ProfileCard from '../components/ProfileCard';
import NewPostModal from '../components/NewPost';
import PostsTabs from '../components/PostsTabs';
import SortDropdown from '../components/SortDropdown';
import SearchBar from '../components/Searchbar';
import PostCard from '../components/PostCard';

const Home = () => {
  return (
    <>
      <Navbar />
      <ProfileCard />
      <NewPostModal />
      <PostsTabs />
      <SortDropdown />
      <SearchBar />
      <PostCard />
      {/* Add your main content here */}
    </>
  );
};

export default Home;
