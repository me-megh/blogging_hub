import React, { useState, useEffect } from "react";
import { Button, Form, Card } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const RegisterForm = () => {
  const [formData, setFormData] = useState({
    username: "",
    password: "",
    confirmPassword: "",
    email: "", // Add email field
  });

  const [csrfToken, setCsrfToken] = useState("");
  const navigate = useNavigate(); // To redirect after registration

  // Fetch CSRF token
  useEffect(() => {
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD  // For production (Vercel)
    : process.env.REACT_APP_API_BASE_URL_LOCAL;  // For local development
    const getCsrfToken = async () => {
      try {
        const response = await fetch(`${apiUrl}/blog/csrf-token/`);
        const data = await response.json();
        setCsrfToken(data.csrf_token);
      } catch (error) {
        console.error("CSRF token fetch error:", error);
      }
    };

    getCsrfToken();
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert("Passwords do not match!");
      return;
    }
    const apiUrl = process.env.NODE_ENV === 'production'
    ? process.env.REACT_APP_API_BASE_URL_PROD  // For production (Vercel)
    : process.env.REACT_APP_API_BASE_URL_LOCAL;  // For local development
    // Send the registration POST request to the backend
    const response = await fetch(`${apiUrl}/api/register/`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        "X-CSRFToken": csrfToken, // Attach CSRF token here
      },
      credentials: 'include',
      body: JSON.stringify({
        username: formData.username,
        password: formData.password, // Match the field name with backend
        confirm_password: formData.confirmPassword, // Match the field name with backend
        email: formData.email, // Include email field
      }),
    });

    const result = await response.json();
    console.log(result, "-------result");

    if (response.ok) {
      alert("Registration successful!");
      navigate("/loginForm"); // Redirect to login page after successful registration
    } else {
      // Handle errors and display them to the user
      const errorMessage = result.username || result.password || result.confirm_password || result.email || "Registration failed!";
      alert("Registration failed: " + errorMessage);
    }
  };

  return (
    <div className="d-flex justify-content-center align-items-center vh-100">
      <Card style={{ width: "30rem" }}>
        <Card.Body>
          <h2 className="text-center">Register</h2>
          <Form onSubmit={handleSubmit}>
            <Form.Group controlId="username">
              <Form.Label>Username</Form.Label>
              <Form.Control
                type="text"
                name="username"
                value={formData.username}
                onChange={handleChange}
                placeholder="Enter username"
              />
            </Form.Group>

            <Form.Group controlId="email" className="mt-3">
              <Form.Label>Email</Form.Label>
              <Form.Control
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                placeholder="Enter email"
              />
            </Form.Group>

            <Form.Group controlId="password" className="mt-3">
              <Form.Label>Password</Form.Label>
              <Form.Control
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                placeholder="Password"
              />
            </Form.Group>

            <Form.Group controlId="confirmPassword" className="mt-3">
              <Form.Label>Confirm Password</Form.Label>
              <Form.Control
                type="password"
                name="confirmPassword"
                value={formData.confirmPassword}
                onChange={handleChange}
                placeholder="Confirm Password"
              />
            </Form.Group>

            <Button variant="primary" type="submit" className="w-100 mt-3">
              Register
            </Button>
          </Form>
          <div className="text-center mt-3">
            <p>
              Already have an account? <a href="/loginForm">Login here</a>
            </p>
          </div>
        </Card.Body>
      </Card>
    </div>
  );
};

export default RegisterForm;