import { useEffect, useState } from "react";
import { useParams } from "react-router-dom";
import Header from "./header";
import Footer from "./footer";
import backgroundImage from "../mona-eendra-vC8wj_Kphak-unsplash.jpg";

const BlogPostDetail = () => {
  const { id } = useParams(); // Getting the blog post ID from the URL
  const [post, setPost] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const apiUrl =
      process.env.NODE_ENV === "production"
        ? process.env.REACT_APP_API_BASE_URL_PROD // For production (Vercel)
        : process.env.REACT_APP_API_BASE_URL_LOCAL; // For local development
    const fetchPost = async () => {
      const res = await fetch(`${apiUrl}/api/blog-posts/${id}/`);
      const result = await res.json();
      setPost(result);
      setLoading(false);
    };
    fetchPost();
  }, [id]);

  if (loading) {
    return (
      <div className="text-center my-5">
        <h2>Loading...</h2>
      </div>
    );
  }

  if (!post) {
    return (
      <div className="text-center my-5">
        <h2>Post not found</h2>
      </div>
    );
  }

  return (
    <>
      <Header />
      <div
        className="container my-5 blog-container"
        style={{
          backgroundImage: `url(${backgroundImage})`, // Apply your background image URL
          backgroundSize: "cover",
          backgroundPosition: "center center",
          backgroundAttachment: "fixed",
          padding: "30px",
          borderRadius: "8px",
        }}
      >
        {/* Blog Post Section */}
        <div className="row justify-content-center">
          <div className="col-md-8">
            {/* Image Section */}
            <div className="mb-4">
              {post.image && (
                <img
                  src={`${post.image}`}
                  alt={post.title}
                  className="img-fluid rounded shadow-sm"
                  style={{ height: "400px", objectFit: "cover", width: "100%" }}
                />
              )}
            </div>

            {/* Title Section */}
            <h1 className="display-4 font-weight-bold">{post.title}</h1>

            {/* Description Section */}
            <p className="lead text-muted">{post.description}</p>

            {/* Author and Date Section */}
            <div className="d-flex justify-content-between align-items-center mt-4">
              <small className="text-secondary">
                By <strong>{post.author}</strong> on{" "}
                {new Date(post.created_at).toLocaleDateString()}
              </small>
            </div>

            {/* Content Section */}
            <div className="mt-4">
              <p>{post.content}</p>
            </div>
          </div>
        </div>
      </div>
      <Footer />
    </>
  );
};

export default BlogPostDetail;
