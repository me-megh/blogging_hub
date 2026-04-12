import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom'; // Import Link for routing
import Header from './header';
import Footer from './footer';

const Home = () => {
  const [posts, setPosts] = useState([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      const res = await fetch('http://127.0.0.1:8000/api/blog-posts/');
      const result = await res.json();
      setPosts(result);
    };
    fetchData();
  }, []);

  return (
    <>
      <Header />
      <div className="container">
        {/* Hero Section */}
        <div className="text-center my-5">
          <h1 className="display-4 font-weight-bold">Blog Posts</h1>
          <p className="lead text-muted">Welcome to our blog where we share useful tips, tutorials, and insights on web development, design, and more..</p>
        </div>

        {/* Blog Post Cards */}
        <div className="row">
          {posts.map((post) => (
            <div key={post.id} className="col-md-6 col-lg-4 mb-4">
              <div className="card h-100 shadow-sm">
                <img
                  src={post.image ? `http://127.0.0.1:8000${post.image}` : 'online-message-blog-chat-communication-envelop-graphic-icon-concept_53876-139717.avif'}
                  className="card-img-top"
                  alt={post.title}
                  style={{ width: '100%', height: '200px', objectFit: 'cover' }}
                />
                <div className="card-body d-flex flex-column">
                  <h5 className="card-title">{post.title}</h5>
                  <p className="card-text text-muted flex-grow-1">{post.content}</p>
                  <div className="mt-auto">
                    <small className="text-secondary">By {post.author}</small>
                  </div>
                  {/* Link to Blog Post Detail page */}
                  <Link to={`/blog/${post.id}`} className="btn btn-primary mt-3">
                    Read More
                  </Link>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>
      <Footer />
    </>
  );
};

export default Home;