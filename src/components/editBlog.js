import React, { useState, useEffect } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate, useParams } from "react-router-dom";

const EditBlog = () => {
  const { id } = useParams(); // Get the blog post ID from URL
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState(""); // Optional: pre-fill if needed
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  // Get CSRF Token from cookies
  const getCsrfTokenFromCookie = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  // Fetch the blog post data when the component mounts
  useEffect(() => {
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD  // For production (Vercel)
    : process.env.REACT_APP_API_BASE_URL_LOCAL;  // For local development
    const fetchBlogPost = async () => {
      try {
        const response = await fetch(
          `${apiUrl}/api/blog-posts/${id}/`
        );
        const data = await response.json();
        if (response.ok) {
          setTitle(data.title);
          setDescription(data.description);
          setAuthor(data.author); // Optional: if you want to pre-fill the author
        } else {
          setError(data.error || "Error fetching blog post");
        }
      } catch (error) {
        setError("An error occurred while fetching the blog post.");
      }
    };

    fetchBlogPost();
  }, [id]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const csrfToken = getCsrfTokenFromCookie();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    if (image) formData.append("image", image);

    try {
      const apiUrl = process.env.NODE_ENV === 'production'
      ? process.env.REACT_APP_API_BASE_URL_PROD  // For production (Vercel)
      : process.env.REACT_APP_API_BASE_URL_LOCAL;  // For local development
      const response = await fetch(
        `${apiUrl}/api/blog-posts/${id}/edit/`,
        {
          method: "PATCH",
          headers: {
            "X-CSRFToken": csrfToken,
          },
          body: formData,
          credentials: "include",
        }
      );

      if (response.ok) {
        alert("Blog post updated successfully!");
        navigate(`/profile`);
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error updating blog post");
      }
    } catch (error) {
      setError("An error occurred while updating the blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ width: "30rem" }}>
        <h2 className="text-center">Edit Blog Post</h2>
        <Form onSubmit={handleSubmit}>
          {/* Optional: Add hidden author field if needed */}
          <Form.Group controlId="formAuthor" hidden>
            <Form.Label>Author Name</Form.Label>
            <Form.Control
              type="text"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter username"
              required
            />
          </Form.Group>

          <Form.Group controlId="formTitle">
            <Form.Label>Title</Form.Label>
            <Form.Control
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter blog title"
              required
            />
          </Form.Group>

          <Form.Group controlId="formDescription">
            <Form.Label>Description</Form.Label>
            <Form.Control
              as="textarea"
              rows={3}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter blog description"
              required
            />
          </Form.Group>

          <Form.Group controlId="formImage">
            <Form.Label>Image</Form.Label>
            <Form.Control
              type="file"
              onChange={(e) => setImage(e.target.files[0])}
            />
          </Form.Group>

          {error && <div className="text-danger">{error}</div>}

          <Button variant="primary" type="submit" className="w-100 mt-3">
            {loading ? (
              <Spinner animation="border" size="sm" />
            ) : (
              "Update Blog Post"
            )}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default EditBlog;
