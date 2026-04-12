import React, { useState } from "react";
import { Button, Form, Spinner } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const CreateBlog = () => {
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [image, setImage] = useState(null);
  const [author, setAuthor] = useState("");   // ✅ NEW
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getCsrfTokenFromCookie = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    const csrfToken = getCsrfTokenFromCookie();

    const formData = new FormData();
    formData.append("title", title);
    formData.append("description", description);
    formData.append("author", author);   // ✅ IMPORTANT
    if (image) formData.append("image", image);

    try {
      const response = await fetch("http://localhost:8000/blog/create/", {
        method: "POST",
        headers: {
          "X-CSRFToken": csrfToken,
        },
        body: formData,
        credentials: "include",
      });

      if (response.ok) {
        alert("Blog post created successfully!");
        navigate("/profile");
      } else {
        const errorData = await response.json();
        setError(errorData.error || "Error creating blog post");
      }
    } catch (error) {
      setError("An error occurred while creating the blog post.");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <div style={{ width: "30rem" }}>
        <h2 className="text-center">Create New Blog Post</h2>
        <Form onSubmit={handleSubmit}>

          {/* ✅ AUTHOR FIELD ADDED */}
          <Form.Group controlId="formAuthor">
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
            {loading ? <Spinner animation="border" size="sm" /> : "Create Blog Post"}
          </Button>
        </Form>
      </div>
    </div>
  );
};

export default CreateBlog;