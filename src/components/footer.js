import React from 'react';

const Footer = () => {
  return (
    <footer className="bg-dark text-white text-center py-4">
      <div className="container">
        <p>&copy; 2026 Blog. All Rights Reserved.</p>
        <p>
          <a href="/about" className="text-white">About Us</a> | 
          <a href="/contact" className="text-white"> Contact</a>
        </p>
      </div>
    </footer>
  );
};

export default Footer;