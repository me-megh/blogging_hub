import React, { useState, useEffect } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const LoginForm = () => {
  const [csrfToken, setCsrfToken] = useState();
  const [formData, setFormData] = useState({
    username: "",
    password: "",
  });

  const navigate = useNavigate();

  useEffect(() => {
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PROD // For production (Vercel)
        : process.env.REACT_APP_API_BASE_URL_LOCAL; // For local development
    const fetchCsrfToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/blog/csrf-token/`, {
          method: "GET",
          credentials: "include", // Ensure cookies are included (for CSRF token)
        });
        const data = await response.json();
        console.log(data, "---------------------");
        if (data.csrf_token) {
          setCsrfToken(data.csrf_token); // Save CSRF token in state
        }
      } catch (error) {
        console.error("Error fetching CSRF token:", error);
      }
    };

    fetchCsrfToken();
  }, []);

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();

    if (!csrfToken) {
      alert("CSRF Token is missing!");
      return;
    }

    try {
      const apiUrl =
        process.env.NODE_ENV === "production"
          ? process.env.REACT_APP_API_BASE_URL_PROD // For production (Vercel)
          : process.env.REACT_APP_API_BASE_URL_LOCAL; // For local development
      const response = await fetch(`${apiUrl}/blog/api/login/`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "X-CSRFToken": csrfToken, // Include CSRF token in the request header
        },
        credentials: "include", // This ensures cookies are included with the request
        body: JSON.stringify({
          username: formData.username,
          password: formData.password,
        }),
      });

      const result = await response.json();
      if (response.ok) {
        alert("Login successful!");
        // Redirect or perform other actions
        navigate("/profile");
      } else {
        alert("Login failed: " + (result.error || "Unknown error"));
      }
    } catch (error) {
      console.error("Login request error:", error);
      alert("An error occurred during login. Please try again.");
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "30rem" }}>
        <Card.Body>
          <h2 className="text-center">Login</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username or Email</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={(e) =>
                  setFormData({ ...formData, username: e.target.value })
                }
                placeholder="Enter username or email"
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={(e) =>
                  setFormData({ ...formData, password: e.target.value })
                }
                placeholder="Password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Login
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>
              Don't have an account? <a href="/registerForm">Register here</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default LoginForm;
