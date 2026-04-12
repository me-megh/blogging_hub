import React, { useState } from 'react';
import { Link } from 'react-router-dom'; // This is assuming you're using React Router for navigation

const Header = () => {
  const [isAuthenticated, setIsAuthenticated] = useState(false); // Replace with actual authentication logic

  const handleLogout = () => {
    setIsAuthenticated(false);
    // Implement logout functionality (clear tokens, session, etc.)
  };

  return (
    <nav className="navbar navbar-expand-lg navbar-light bg-light">
      <div className="container">
        <Link className="navbar-brand" to="/">Blog</Link>
        <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarNav" aria-controls="navbarNav" aria-expanded="false" aria-label="Toggle navigation">
          <span className="navbar-toggler-icon"></span>
        </button>
        <div className="collapse navbar-collapse" id="navbarNav">
          <ul className="navbar-nav ms-auto">
            <li className="nav-item">
              <Link className="nav-link" to="/">Home</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/study">Study Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/motivational">Motivational Blog</Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/travel">Traveling Blog</Link>
            </li>
            {!isAuthenticated ? (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/LoginForm">Login</Link>
                </li>
                <li className="nav-item">
                  <Link className="nav-link" to="/registerForm">Register</Link>
                </li>
              </>
            ) : (
              <>
                <li className="nav-item">
                  <Link className="nav-link" to="/profile">Profile</Link>
                </li>
                <li className="nav-item">
                  <button className="nav-link btn btn-link" onClick={handleLogout}>Logout</button>
                </li>
              </>
            )}
          </ul>
        </div>
      </div>
    </nav>
  );
};

export default Header;