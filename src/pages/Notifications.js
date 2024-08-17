import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import Modal from 'react-modal';
import './Notifications.css';
import background from '../assets/images/background.jpg'; // Fallback image if needed


const Notifications = ({ currentUser }) => {
  const [notifications, setNotifications] = useState([]);
  const [selectedPost, setSelectedPost] = useState(null);
  const [commentText, setCommentText] = useState('');
  const [error, setError] = useState('');
  const [likers, setLikers] = useState([]); // State to handle likers modal

  useEffect(() => {
    if (currentUser) {
      fetchNotifications();
    }
  }, [currentUser]);

  const fetchNotifications = async () => {
    try {
      setError('');
      // const response = await fetch(`http://localhost:3001/notifications/${currentUser}`);
      const response = await fetch(`https://serverdiveexplore.onrender.com/notifications/${currentUser}`);
      if (!response.ok) throw new Error(`Error fetching notifications: ${response.statusText}`);
      const notificationsData = await response.json();
      setNotifications(notificationsData);
    } catch (error) {
      console.error('Error fetching notifications:', error);
      setError('Failed to load notifications. Please try again later.');
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
    if (!commentText.trim() || !selectedPost) return;

    try {
      setError('');
      // const response = await fetch(`http://localhost:3001/posts/${selectedPost._id}/comment`, {
      const response = await fetch(`https://serverdiveexplore.onrender.com/posts/${selectedPost._id}}`, {

        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ username: currentUser, comment: commentText })
      });

      if (!response.ok) throw new Error(`Error adding comment: ${response.statusText}`);
      const updatedPost = await response.json();
      const updatedNotifications = notifications.map(notification =>
        notification.post._id === selectedPost._id
          ? { ...notification, post: updatedPost }
          : notification
      );
      setNotifications(updatedNotifications);
      setSelectedPost(updatedPost);
      setCommentText('');
    } catch (error) {
      console.error('Error adding comment:', error);
      setError('Failed to add comment. Please try again later.');
    }
  };

  const handleShowLikers = async (postId) => {
    try {
      setError('');
      // const response = await fetch(`http://localhost:3001/posts/${postId}/likers`);
      const response = await fetch(`https://serverdiveexplore.onrender.com/posts/${postId}/likers`);
      if (!response.ok) throw new Error(`Error fetching likers: ${response.statusText}`);
      const likersData = await response.json();
      setLikers(likersData);
    } catch (error) {
      console.error('Error fetching likers:', error);
      setError('Failed to load likers. Please try again later.');
    }
  };

  const handleCloseLikers = () => {
    setLikers([]);
  };

  const renderNotificationContent = (notification) => {
    let content;
    switch (notification.typeOf) {
      case 'Like':
        content = (
          <p>
            <strong>
              <Link to={`/user/${notification.actionUsername}?currentUser=${currentUser}`}>
                {notification.actionUsername}
              </Link>
            </strong> liked your post.
          </p>
        );
        break;
      case 'Comment':
        content = (
          <p>
            <strong>
              <Link to={`/user/${notification.actionUsername}?currentUser=${currentUser}`}>
                {notification.actionUsername}
              </Link>
            </strong> commented on your post.
          </p>
        );
        break;
      case 'Follow':
        content = (
          <p>
            <strong>
              <Link to={`/user/${notification.actionUsername}?currentUser=${currentUser}`}>
                {notification.actionUsername}
              </Link>
            </strong> followed you.
          </p>
        );
        break;
      default:
        content = (
          <p>
            <strong>
              <Link to={`/user/${notification.actionUsername}?currentUser=${currentUser}`}>
                {notification.actionUsername}
              </Link>
            </strong> did something.
          </p>
        );
    }
    return content;
  };

  return (
    <div className="notifications-container">
      <h1>Notifications</h1>
      {error && <p className="error-message">{error}</p>}
      {notifications.length === 0 ? (
        <p>No notifications available</p>
      ) : (
        notifications.map(notification => (
          <div key={notification._id} className="notification">
            {renderNotificationContent(notification)}
            {['Like', 'Comment'].includes(notification.typeOf) && notification.post ? (
              <div className="post-preview">
                <h3 className="post-title">{notification.post.title || 'Untitled Post'}</h3>
                {notification.post.mediaUrl ? (
                  <img 
                    src={notification.post.mediaUrl}
                    alt={notification.post.title || 'Post Image'}
                    onError={(e) => {
                      e.target.src = background;
                      console.error('Error loading image:', notification.post.mediaUrl);
                    }}
                  />
                ) : null}
                <p className="post-description">{notification.post.description || 'No description available'}</p>
                <button onClick={() => handleOpenComments(notification.post)}>
                  <i className="fas fa-comment"></i> Comment
                </button>
                <button onClick={() => handleShowLikers(notification.post._id)}>
                  <i className="fas fa-thumbs-up"></i> Who Liked ({notification.post.likedBy.length})
                </button>
              </div>
            ) : null}
          </div>
        ))
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

      {likers.length > 0 && (
        <Modal
          isOpen={likers.length > 0}
          onRequestClose={handleCloseLikers}
          contentLabel="Likers Modal"
          className="likers-modal"
          overlayClassName="comments-overlay" // Make sure this matches the overlay class for comments modal
        >
        <h2>People who liked the post</h2>
        <ul className="likers-list">
        {likers.map((liker, index) => (
          <li key={index}>
            <Link to={`/user/${liker}`}>{liker}</Link>
          </li>
        ))}
        </ul>
        <button onClick={handleCloseLikers}>Close</button>
        </Modal>
      )}

      {/* <Modal
        isOpen={likers.length > 0}
        onRequestClose={handleCloseLikers}
        contentLabel="Likers Modal"
        className="likers-modal" // Ensure this matches the CSS class
        overlayClassName="ReactModal__Overlay" // Ensure this matches the CSS class
      >
        <h2>People who liked the post</h2>
        <ul className="likers-list">
          {likers.map((liker, index) => (
            <li key={index}>
              <Link to={`/user/${liker}`}>{liker}</Link>
            </li>
          ))}
        </ul>
        <button onClick={handleCloseLikers}>Close</button>
      </Modal> */}

      
    </div>
  );
};

export default Notifications;
