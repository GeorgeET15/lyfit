import React from "react";
import { Link } from "react-router-dom";

const HomeScreen = () => {
  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">LyFit</h1>
        <p className="home-tagline">"For a fit future"</p>
        <p className="home-description">An exclusive app for fitness</p>

        <div className="home-links">
          <Link to="/signup" className="home-link home-link-signup">
            Get Started
          </Link>
          <Link to="/login" className="home-link home-link-login">
            Log In
          </Link>
        </div>
      </div>

      <div className="dashboard-footer">
        <p>&copy; 2024. All Rights Reserved.</p>
        <p>Made with ❤️ in Kochi.</p>
      </div>
    </div>
  );
};

export default HomeScreen;
