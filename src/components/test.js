
import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Row, Col, Container } from "react-bootstrap";
import { useNavigate } from "react-router-dom";

const Profile = () => {
  const [profileData, setProfileData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const navigate = useNavigate();

  const getCsrfTokenFromCookie = () => {
    const match = document.cookie.match(/csrftoken=([^;]+)/);
    return match ? match[1] : null;
  };

  useEffect(() => {
    const csrfTokenFromCookie = getCsrfTokenFromCookie();
    if (csrfTokenFromCookie) {
      const fetchProfileData = async () => {
        try {
          const response = await fetch("http://localhost:8000/api/profile/", {
            method: "GET",
            headers: {
              "X-CSRFToken": csrfTokenFromCookie,
            },
            credentials: "include",
          });

          if (response.ok) {
            const data = await response.json();
            setProfileData(data);
          } else {
            setError(`Failed to fetch profile data. Status: ${response.status}`);
          }
        } catch (error) {
          setError("Error fetching profile data.");
        } finally {
          setLoading(false);
        }
      };
      fetchProfileData();
    }
  }, []);

  const handleDelete = async (id) => {
    const csrfTokenFromCookie = getCsrfTokenFromCookie(); // Get CSRF Token
    const authToken = localStorage.getItem("authToken"); // Get Authorization Token (if stored in localStorage)
  
    const response = await fetch(`http://localhost:8000/api/blog-posts/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrfTokenFromCookie, // CSRF token in header
        "Authorization": `Bearer ${authToken}`, // Authorization token in header (use Bearer token)
      },
      credentials: "include", // Send session cookie with the request if required
    });
  
    if (response.ok) {
      alert("Blog deleted successfully!");
      const updatedPosts = profileData.user_posts.filter(post => post.id !== id);
    setProfileData({ ...profileData, user_posts: updatedPosts });  // Update state after delete
    } else {
      alert("Error deleting blog");
    }
  };

  if (loading) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <Spinner animation="border" variant="primary" />
      </div>
    );
  }

  if (error) {
    return (
      <div className="d-flex justify-content-center align-items-center vh-100">
        <h2>{error}</h2>
        <Button variant="link" onClick={() => navigate("/login")}>
          Go to Login
        </Button>
      </div>
    );
  }

  return (
    <Container className="d-flex justify-content-center align-items-start py-4">
      <Row className="w-100">
        {/* Left Column: User Info */}
        <Col md={4} className="mb-4">
          <Card className="shadow-lg">
            <Card.Body>
              <h2 className="text-center">Profile</h2>
              <h4>Welcome, {profileData.username}!</h4>
              <p>Email: {profileData.email}</p>
              <Button
                variant="danger"
                className="w-100 mt-3"
                onClick={async () => {
                  try {
                    const csrfTokenFromCookie = getCsrfTokenFromCookie();
                    const response = await fetch("http://localhost:8000/blog/api/logout/", {
                      method: "POST",
                      credentials: "include",
                      headers: {
                        "X-CSRFToken": csrfTokenFromCookie,
                      },
                    });
                    if (response.ok) {
                      navigate("/login");
                    } else {
                      console.error("Logout failed:", response.statusText);
                    }
                  } catch (error) {
                    console.error("Logout error:", error);
                  }
                }}
              >
                Logout
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Right Column: Blog List */}
        <Col md={8}>
          <Card className="shadow-lg">
            <Card.Body>
              <h4>Your Blog Posts:</h4>
              {profileData.user_posts && profileData.user_posts.length > 0 ? (
                <ul>
                  {profileData.user_posts.map((post) => (
                    <li key={post.id} className="mb-3">
                      <Card className="mb-3">
                        <Card.Body>
                          <Card.Title>{post.title}</Card.Title>
                          <Button
                            variant="warning"
                            onClick={() => navigate(`/edit/${post.id}`)}
                            className="me-2"
                          >
                            Edit
                          </Button>
                          <Button
                            variant="danger"
                            onClick={() => handleDelete(post.id)}
                          >
                            Delete
                          </Button>
                        </Card.Body>
                      </Card>
                    </li>
                  ))}
                </ul>
              ) : (
                <p>You haven't created any blog posts yet.</p>
              )}
              <Button
                variant="primary"
                onClick={() => navigate("/create")}
                className="w-100 mt-3"
              >
                Create New Blog
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>
    </Container>
  );
};

export default Profile;