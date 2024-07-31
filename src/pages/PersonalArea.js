import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
// import './PersonalArea.css';

const PersonalArea = ({ currentUser }) => {
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const navigate = useNavigate();

  useEffect(() => {
    if (currentUser) {
      fetchUserData();
    }
  }, [currentUser]);

  const fetchUserData = async () => {
    try {
      // Fetch all posts
      const postsResponse = await fetch('http://localhost:3001/posts');
      const postsData = await postsResponse.json();
      
      // Filter posts to get those liked, saved, and shared by the current user
      const likedPostsData = postsData.filter(post => post.likedBy.includes(currentUser));
      setLikedPosts(likedPostsData);

      const savedPostsData = postsData.filter(post => post.savedBy.includes(currentUser));
      setSavedPosts(savedPostsData);

      const sharedPostsData = postsData.filter(post => post.sharedBy.includes(currentUser));
      setSharedPosts(sharedPostsData);
  
      // Fetch user posts
      const userPostsResponse = await fetch(`http://localhost:3001/posts/${currentUser}`);
      const userPostsData = await userPostsResponse.json();
      setUserPosts(userPostsData);
  
      // Fetch following
      const followingResponse = await fetch(`http://localhost:3001/api/following/${currentUser}`);
      const followingData = await followingResponse.json();
      setFollowing(followingData);
  
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };


  const handleDeletePost = async (postId) => {
    if (window.confirm('Are you sure you want to delete this post?')) {
      try {
        await fetch(`http://localhost:3001/posts/${postId}`, {
          method: 'DELETE',
        });
        setUserPosts(userPosts.filter((post) => post._id !== postId));
      } catch (err) {
        console.error('Error deleting post:', err);
      }
    }
  };

  const handleEditPost = (postId) => {
    navigate(`/edit-post/${postId}`);
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
    <div className="personal-area-container">
      <h1>{currentUser}'s Personal Area</h1>

      <h2>My Posts</h2>
      {userPosts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div className="posts-container">
          {userPosts.map(post => (
            <div key={post._id} className="post">
              <h3 className="post-title">{post.title}</h3>
              {post.media && (
                <img 
                  src={`http://localhost:3001${post.media}`} 
                  alt={post.title} 
                />
              )}
              <p className="post-description">{post.description}</p>
              <div className="post-actions">
                <button onClick={() => handleEditPost(post._id)}>Edit</button>
                <button onClick={() => handleDeletePost(post._id)}>Delete</button>
              </div>
              <p className="post-username">
                <span>Posted by: </span>
                {post.username}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2>Following</h2>
      <ul>
        {following.map((user) => (
          <li key={user}>
            {user}
            <button onClick={() => navigate(`/user/${user}`)}>View Profile</button>
            <button onClick={() => handleUnfollowUser(user)}>Unfollow</button>
          </li>
        ))}
      </ul>

      <h2>Liked Posts</h2>
      {likedPosts.length === 0 ? (
        <p>No liked posts available</p>
      ) : (
        <div className="posts-container">
          {likedPosts.map(post => (
            <div key={post._id} className="post">
              <h3 className="post-title">{post.title}</h3>
              {post.media && (
                <img 
                  src={`http://localhost:3001${post.media}`} 
                  alt={post.title} 
                />
              )}
              <p className="post-description">{post.description}</p>
              <p className="post-username">
                <span>Posted by: </span>
                {post.username}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2>Saved Posts</h2>
      {savedPosts.length === 0 ? (
        <p>No saved posts available</p>
      ) : (
        <div className="posts-container">
          {savedPosts.map(post => (
            <div key={post._id} className="post">
              <h3 className="post-title">{post.title}</h3>
              {post.media && (
                <img 
                  src={`http://localhost:3001${post.media}`} 
                  alt={post.title} 
                />
              )}
              <p className="post-description">{post.description}</p>
              <p className="post-username">
                <span>Posted by: </span>
                {post.username}
              </p>
            </div>
          ))}
        </div>
      )}

      <h2>Shared Posts</h2>
      {sharedPosts.length === 0 ? (
        <p>No shared posts available</p>
      ) : (
        <div className="posts-container">
          {sharedPosts.map(post => (
            <div key={post._id} className="post">
              <h3 className="post-title">{post.title}</h3>
              {post.media && (
                <img 
                  src={`http://localhost:3001${post.media}`} 
                  alt={post.title} 
                />
              )}
              <p className="post-description">{post.description}</p>
              <p className="post-username">
                <span>Posted by: </span>
                {post.username}
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default PersonalArea;
