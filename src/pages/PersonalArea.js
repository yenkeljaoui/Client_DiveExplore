import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

const PersonalArea = ({ currentUser }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      const postsResponse = await fetch('http://localhost:3001/posts/${currentUser}');
      const postsData = await postsResponse.json();
      setUserPosts(postsData);

      const followingResponse = await fetch('http://localhost:3001/following/${currentUser}');
      const followingData = await followingResponse.json();
      setFollowing(followingData);

      const likedPostsResponse = await fetch('http://localhost:3001/liked-posts/${currentUser}');
      const likedPostsData = await likedPostsResponse.json();
      setLikedPosts(likedPostsData);

      const savedPostsResponse = await fetch('http://localhost:3001/saved-posts/${currentUser}');
      const savedPostsData = await savedPostsResponse.json();
      setSavedPosts(savedPostsData);
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleDeletePost = async (postId) => {
    try {
      await fetch('http://localhost:3001/posts/${postId}', {
        method: 'DELETE',
      });
      setUserPosts(userPosts.filter((post) => post._id !== postId));
    } catch (err) {
      console.error('Error deleting post:', err);
    }
  };

  const handleEditPost = (postId) => {
    navigate('/edit-post/${postId}');
  };

  const handleUnfollowUser = async (username) => {
    try {
      await fetch('http://localhost:3001/unfollow', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ currentUser, username }),
      });
      setFollowing(following.filter((user) => user !== username));
    } catch (err) {
      console.error('Error unfollowing user:', err);
    }
  };

  return (
    <div>
      <h1>{currentUser}'s Personal Area</h1>

      <h2>My Posts</h2>
      <ul>
        {userPosts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <button onClick={() => handleEditPost(post._id)}>Edit</button>
            <button onClick={() => handleDeletePost(post._id)}>Delete</button>
          </li>
        ))}
      </ul>

      <h2>Following</h2>
      <ul>
        {following.map((user) => (
          <li key={user}>
            {user}
            <button onClick={() => navigate('/user/${user}')}>View Profile</button>
            <button onClick={() => handleUnfollowUser(user)}>Unfollow</button>
          </li>
        ))}
      </ul>

      <h2>Liked Posts</h2>
      <ul>
        {likedPosts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <button onClick={() => navigate('/post/${post._id}')}>View Post</button>
          </li>
        ))}
      </ul>

      <h2>Saved Posts</h2>
      <ul>
        {savedPosts.map((post) => (
          <li key={post._id}>
            <h3>{post.title}</h3>
            <p>{post.description}</p>
            <button onClick={() => navigate('/post/${post._id}')}>View Post</button>
          </li>
        ))}
      </ul>
    </div>
  );
};

export default PersonalArea;
