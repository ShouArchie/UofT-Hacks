"use client";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <ul>
          <li>
            <a href="/about">About</a>
          </li>
          <li>
            <a href="/login">Login</a>
          </li>
        </ul>
      </nav>

      <header className="header">
        <h1>ArgueMate</h1>
        <p>A new perspective on dating</p>
      </header>

      <footer id="contact" className="footer">
        <h2>Contact Us</h2>
        <p>Email: support@perspectiveapp.com</p>
        <p>Phone: +1-234-567-8901</p>
      </footer>
    </div>
  );
};

export default HomePage;
