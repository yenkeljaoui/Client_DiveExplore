import React, { useState, useEffect } from 'react';
import { useParams } from 'react-router-dom';

const PersonalAreaView = () => {
  const { username } = useParams();
  const [userPosts, setUserPosts] = useState([]);
  const [following, setFollowing] = useState([]);
  const [likedPosts, setLikedPosts] = useState([]);
  const [savedPosts, setSavedPosts] = useState([]);
  const [sharedPosts, setSharedPosts] = useState([]);
  const [posts, setPosts] = useState([]);
  const [currentUser, setCurrentUser] = useState(''); // Track current user

  useEffect(() => {
    if (username) {
      fetchUserData();
    }
  }, [username]);

  const fetchUserData = async () => {
    try {
      // Fetch all posts
      const postsResponse = await fetch('http://localhost:3001/posts');
      const postsData = await postsResponse.json();
      
      // Filter posts to get those liked, saved, and shared by the current user
      const likedPostsData = postsData.filter(post => post.likedBy.includes(username));
      setLikedPosts(likedPostsData);

      const savedPostsData = postsData.filter(post => post.savedBy.includes(username));
      setSavedPosts(savedPostsData);

      const sharedPostsData = postsData.filter(post => post.sharedBy.includes(username));
      setSharedPosts(sharedPostsData);
  
      // Fetch user posts
      const userPostsResponse = await fetch(`http://localhost:3001/posts/${username}`);
      const userPostsData = await userPostsResponse.json();
      setUserPosts(userPostsData);
  
      // Fetch following
      const followingResponse = await fetch(`http://localhost:3001/following/${username}`);
      const followingData = await followingResponse.json();
      setFollowing(followingData);

      // Fetch current user data
      const currentUserResponse = await fetch('http://localhost:3001/currentUser');
      const currentUserData = await currentUserResponse.json();
      setCurrentUser(currentUserData.username);
  
    } catch (err) {
      console.error('Error fetching user data:', err);
    }
  };

  const handleFollow = async () => {
    try {
      const response = await fetch(`http://localhost:3001/follow/${username}`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ currentUser }),
      });
      const result = await response.json();
      if (result.success) {
        alert(`Successfully followed ${username}`);
        fetchUserData(); // Refresh data to show updated following list
      } else {
        alert('Error following user');
      }
    } catch (err) {
      console.error('Error following user:', err);
    }
  };

  return (
    <div className="personal-area-container">
      <h1>{username}'s Personal Area</h1>

      {/* Follow Button */}
      {username !== currentUser && (
        <button onClick={handleFollow}>
          Follow {username}
        </button>
      )}

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
          <li key={user}>{user}</li>
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

export default PersonalAreaView;