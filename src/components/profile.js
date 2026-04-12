import React, { useState, useEffect } from "react";
import { Card, Button, Spinner, Row, Col, Container, Image } from "react-bootstrap";
import { useNavigate } from "react-router-dom";
import { FaUserCircle } from "react-icons/fa"; // Importing Font Awesome icon for default profile image
import defaultImage from "../download.png"; 
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
    const csrfTokenFromCookie = getCsrfTokenFromCookie();
    const authToken = localStorage.getItem("authToken");

    const response = await fetch(`http://localhost:8000/api/blog-posts/${id}/delete/`, {
      method: "DELETE",
      headers: {
        "X-CSRFToken": csrfTokenFromCookie,
        "Authorization": `Bearer ${authToken}`,
      },
      credentials: "include",
    });

    if (response.ok) {
      alert("Blog deleted successfully!");
      const updatedPosts = profileData.user_posts.filter(post => post.id !== id);
      setProfileData({ ...profileData, user_posts: updatedPosts });
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
    <Container className="py-5">
      <Row className="g-4">
        {/* Left Column: Profile Info */}
        <Col md={4}>
          <Card className="shadow-lg border-0 rounded">
            <Card.Body>
              <div className="text-center mb-3">
                {/* Check if profile photo exists, otherwise show default icon */}
                {profileData.profile_image ? (
                  <Image
                    src={profileData.profile_image}
                    roundedCircle
                    width={150}
                    height={150}
                    alt="Profile"
                  />
                ) : (
                  <FaUserCircle size={150} color="#6c757d" />
                )}
              </div>
              <h2 className="text-center">{profileData.username}</h2>
              <p className="text-center text-muted">{profileData.email}</p>
              <Button
                variant="danger"
                className="w-100 mt-4"
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

        {/* Right Column: Blog Posts */}
        <Col md={8}>
          <Card className="shadow-lg border-0 rounded">
            <Card.Body>
              <h4 className="mb-4">Your Blog Posts:</h4>
              {profileData.user_posts && profileData.user_posts.length > 0 ? (
                <Row>
                  {profileData.user_posts.map((post) => (
                    <Col md={6} key={post.id} className="mb-4">
                      <Card className="shadow-sm">
                        {/* Use a default image if post does not have an image */}
                        <Card.Img
                          variant="top"
                          src={post.image?post.image || "https://via.placeholder.com/400x200":defaultImage}
                          alt={post.title}
                          style={{ objectFit: "cover", height: "200px" }}
                        />
                        <Card.Body>
                          <Card.Title>{post.title}</Card.Title>
                          <Card.Text>
                            <small className="text-muted">
                              Author: {post.author} | {new Date(post.created_at).toLocaleDateString()}
                            </small>
                          </Card.Text>
                          <Card.Text>{post.description}</Card.Text>
                          <div className="d-flex justify-content-between">
                            <Button
                              variant="warning"
                              onClick={() => navigate(`/edit/${post.id}`)}
                            >
                              Edit
                            </Button>
                            <Button
                              variant="danger"
                              onClick={() => handleDelete(post.id)}
                            >
                              Delete
                            </Button>
                          </div>
                        </Card.Body>
                      </Card>
                    </Col>
                  ))}
                </Row>
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