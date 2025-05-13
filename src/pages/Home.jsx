import React from 'react';
import Navbar from '../components/NavBar';
import ProfileCard from '../components/ProfileCard';
import NewPostModal from '../components/NewPost';
import PostsTabs from '../components/PostsTabs';

const Home = () => {
  return (
    <>
      <Navbar />
      <ProfileCard />
      <NewPostModal />
      <PostsTabs />
      {/* Add your main content here */}
      <p>Explore Page</p>
    </>
  );
};

export default Home;
