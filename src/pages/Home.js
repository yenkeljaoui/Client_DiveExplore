import React, { useState, useEffect } from 'react';
import Modal from 'react-modal';
import { Link } from 'react-router-dom';
import './Home.css';
import background from '../assets/images/background.jpg';
import background2 from '../assets/images/background_2.jpg'; // Image de secours
import '@fortawesome/fontawesome-free/css/all.min.css';

Modal.setAppElement('#root');

const Home = ({ currentUser }) => {
  const [posts, setPosts] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [newPostTitle, setNewPostTitle] = useState('');
  const [newPostDescription, setNewPostDescription] = useState('');
  const [newPostMedia, setNewPostMedia] = useState(null);
  const [isNewPostModalOpen, setIsNewPostModalOpen] = useState(false);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const response = await fetch('http://localhost:3001/posts');
      if (!response.ok) throw new Error('Error fetching posts');
      const data = await response.json();
      const sortedPosts = data.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
      setPosts(sortedPosts);
    } catch (error) {
      console.error('Error fetching posts:', error);
    }
  };

  const handleLike = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/like`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        const sortedPosts = posts.map(post => post._id === postId ? updatedPost : post).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } else {
        const errorMessage = await response.text();
        console.error('Error liking post:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error liking post:', error);
    }
  };

  const handleOpenComments = (post) => {
    setSelectedPost(post);
  };

  const handleCloseComments = () => {
    setSelectedPost(null);
    setCommentText('');
  };

  const handleAddComment = async () => {
    if (!commentText.trim()) return;

    try {
      const response = await fetch(`http://localhost:3001/posts/${selectedPost._id}/comment`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser, comment: commentText })
      });

      if (response.ok) {
        const updatedPost = await response.json();
        const sortedPosts = posts.map(post => post._id === selectedPost._id ? updatedPost : post).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        setSelectedPost(updatedPost);
        setCommentText('');
      } else {
        const errorMessage = await response.text();
        console.error('Error adding comment:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error adding comment:', error);
    }
  };

  const handleOpenNewPostModal = () => {
    setIsNewPostModalOpen(true);
  };

  const handleCloseNewPostModal = () => {
    setIsNewPostModalOpen(false);
    setNewPostTitle('');
    setNewPostDescription('');
    setNewPostMedia(null);
  };

  const handleCreateNewPost = async () => {
    if (!newPostTitle.trim()) return;

    const formData = new FormData();
    formData.append('title', newPostTitle);
    formData.append('description', newPostDescription);
    formData.append('username', currentUser);
    if (newPostMedia) {
      formData.append('media', newPostMedia);
    }

    try {
      const response = await fetch('http://localhost:3001/posts', {
        method: 'POST',
        body: formData
      });

      if (response.ok) {
        const newPost = await response.json();
        const sortedPosts = [newPost, ...posts].sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
        handleCloseNewPostModal();
      } else {
        const errorMessage = await response.text();
        console.error('Error creating post:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error creating post:', error);
    }
  };

  const handleMediaChange = (e) => {
    setNewPostMedia(e.target.files[0]);
  };

  const handleShare = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/share`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser })
      });
  
      if (response.ok) {
        const updatedPost = await response.json();
        const sortedPosts = posts.map(post => post._id === postId ? updatedPost : post).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } else {
        const errorMessage = await response.text();
        console.error('Error sharing post:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error sharing post:', error);
    }
  };
  
  const handleSave = async (postId) => {
    try {
      const response = await fetch(`http://localhost:3001/posts/${postId}/save`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser })
      });
  
      if (response.ok) {
        const updatedPost = await response.json();
        const sortedPosts = posts.map(post => post._id === postId ? updatedPost : post).sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
        setPosts(sortedPosts);
      } else {
        const errorMessage = await response.text();
        console.error('Error saving post:', errorMessage);
        alert(errorMessage);
      }
    } catch (error) {
      console.error('Error saving post:', error);
    }
  };

  return (
    <div className="home-container" style={{ backgroundImage: `url(${background})` }}>
      <h1>Welcome to DiveExplore</h1>
      <p>Social Network</p>
      <button className="new-post-button" onClick={handleOpenNewPostModal}>New Post</button>
  
      {posts.length === 0 ? (
        <p>No posts available</p>
      ) : (
        <div className="posts-container">
          {posts.map(post => (
            <div key={post._id} className="post">
              <h3 className="post-title">{post.title}</h3>
              {post.media && (
                <img 
                  src={`http://localhost:3001${post.media}`} 
                  alt={post.title} 
                  onError={(e) => {
                    e.target.src = background2;
                    console.error('Error loading image:', post.media);
                  }}
                />
              )}
              <p className="post-description">{post.description}</p>
              <div className="post-actions">
                <button 
                  onClick={() => handleLike(post._id)}
                  disabled={post.likedBy.includes(currentUser)}
                >
                  <i className="fas fa-thumbs-up"></i> Like {post.likes}
                </button>
                <button 
                  onClick={() => handleShare(post._id)}
                  disabled={post.sharedBy.includes(currentUser)}
                >
                  <i className="fas fa-share"></i> Share {post.shares}
                </button>
                <button 
                  onClick={() => handleSave(post._id)}
                  disabled={post.savedBy.includes(currentUser)}
                >
                  <i className="fas fa-save"></i> Save
                </button>
                <button onClick={() => handleOpenComments(post)}>
                  <i className="fas fa-comment"></i> Comment
                </button>
              </div>
              <p className="post-username">
                <span>Posted by: </span>
                <Link to={`/user/${post.username}`}>{post.username}</Link>
              </p>
            </div>
          ))}
        </div>
      )}
  
      {selectedPost && (
        <Modal
          isOpen={!!selectedPost}
          onRequestClose={handleCloseComments}
          contentLabel="Comments Modal"
          className="comments-modal"
          overlayClassName="comments-overlay"
        >
          <h2>Comments for {selectedPost.title}</h2>
          <div className="comments-list">
            {selectedPost.comments.map((comment, index) => (
              <div key={index} className="comment">
                <p><strong>{comment.username}</strong>: {comment.comment}</p>
                <p className="comment-date">{new Date(comment.date).toLocaleString()}</p>
              </div>
            ))}
          </div>
          <textarea
            value={commentText}
            onChange={(e) => setCommentText(e.target.value)}
            placeholder="Add a comment..."
          />
          <button onClick={handleAddComment}>Submit</button>
          <button onClick={handleCloseComments}>Close</button>
        </Modal>
      )}
  
      <Modal
        isOpen={isNewPostModalOpen}
        onRequestClose={handleCloseNewPostModal}
        contentLabel="New Post Modal"
        className="new-post-modal"
        overlayClassName="comments-overlay"
      >
        <h2>Create New Post</h2>
        <input
          type="text"
          value={newPostTitle}
          onChange={(e) => setNewPostTitle(e.target.value)}
          placeholder="Post Title"
        />
        <textarea
          value={newPostDescription}
          onChange={(e) => setNewPostDescription(e.target.value)}
          placeholder="Post Description (Optional)"
        />
        <input 
          type="file"
          accept="image/*"
          onChange={handleMediaChange}
        />
        <button onClick={handleCreateNewPost}>Submit</button>
        <button onClick={handleCloseNewPostModal}>Close</button>
      </Modal>
    </div>
  );

};

export default Home;