"use client";
import React from "react";

const HomePage: React.FC = () => {
  return (
    <div className="homepage">
      <nav className="navbar">
        <ul>
          <li>
            <a
              href="/about"
              className="text-foreground bg-background hover:bg-[#FFD0A0] focus:outline-none focus:ring-4 focus:ring-yellow-300 font-medium rounded-full text-sm px-5 py-2.5 text-center me-2 mb-2 dark:focus:ring-yellow-900"
            >
              About
            </a>
          </li>
          <li>
            <a
              href="/login"
              className="px-6 py-2 bg-[var(--foreground)] text-[var(--background)] font-semibold rounded-md hover:bg-[#FFD0A0] transition duration-300"
            >
              Login
            </a>
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
