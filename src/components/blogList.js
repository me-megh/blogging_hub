import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom'; // For navigation to individual blog pages
import { Button } from 'react-bootstrap';

const BlogList = () => {
  const [blogs, setBlogs] = useState([]); // State to hold the list of blogs
  const [loading, setLoading] = useState(true); // Loading state for the API call
  const [error, setError] = useState(null); // Error state for handling API errors

  // Fetch blogs from backend API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        const response = await fetch('http://localhost:8000/api/blog-posts/');
        if (!response.ok) {
          throw new Error('Failed to fetch blogs');
        }
        const data = await response.json();
        setBlogs(data); // Set the blogs in state
      } catch (error) {
        setError(error.message); // Set error if something goes wrong
      } finally {
        setLoading(false); // Set loading to false after data is fetched
      }
    };
    fetchBlogs();
  }, []);

  // Render loading spinner or error message
  if (loading) {
    return <div>Loading blogs...</div>;
  }

  if (error) {
    return <div>Error: {error}</div>;
  }

  return (
    <div>
      <h2>Blog List</h2>
      <Button variant="primary" as={Link} to="/create">Create New Blog</Button> {/* Button to navigate to the blog creation page */}
      <ul>
        {blogs.map((blog) => (
          <li key={blog.id}>
            <Link to={`/blog/${blog.id}`}>{blog.title}</Link> {/* Link to individual blog */}
            <br />
            <Button variant="warning" as={Link} to={`/edit/${blog.id}`}>Edit</Button>
            <Button variant="danger" onClick={() => deleteBlog(blog.id)}>Delete</Button>
          </li>
        ))}
      </ul>
    </div>
  );

  // Function to handle blog deletion
  async function deleteBlog(blogId) {
    const response = await fetch(`http://localhost:8000/api/blog-posts/${blogId}/`, {
      method: 'DELETE',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    if (response.ok) {
      // Refresh the blog list after deletion
      setBlogs(blogs.filter((blog) => blog.id !== blogId));
    } else {
      alert('Failed to delete blog');
    }
  }
};

export default BlogList;