import React, { useState } from "react";
import { useCookies } from "react-cookie";
import { useNavigate } from "react-router-dom";

const LoginScreen = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false); // Add loading state
  const [cookies, setCookie] = useCookies(["AuthToken"]);
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setLoading(true); // Start loading
    try {
      const response = await fetch("http://localhost:8000/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email, password }),
      });
      const data = await response.json();
      if (data.token) {
        localStorage.setItem("AuthToken", data.token);
        localStorage.setItem("userId", data.userId);
        setCookie("AuthToken", data.token, { path: "/" });
        navigate("/dashboard");
      } else {
        alert("Login failed");
      }
    } catch (error) {
      console.error("Login error:", error);
    } finally {
      setLoading(false); // Stop loading
    }
  };

  return (
    <div className="auth-container">
      <div className="auth-card">
        <h2 className="auth-title">Login</h2>
        {loading ? ( // Display loading message if loading is true
          <div className="loading-screen">
            <p>Loading...</p>
            {/* You can add a spinner or animation here if you have one */}
          </div>
        ) : (
          <form onSubmit={handleLogin} className="auth-form">
            <div className="input-group">
              <label htmlFor="email" className="input-label">
                Email
              </label>
              <input
                type="email"
                id="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <div className="input-group">
              <label htmlFor="password" className="input-label">
                Password
              </label>
              <input
                type="password"
                id="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="input-field"
                required
              />
            </div>
            <button type="submit" className="auth-button">
              Login
            </button>
          </form>
        )}
        <div className="auth-footer">
          <span>
            Don't have an account?{" "}
            <a href="/signup" className="auth-link">
              Sign Up
            </a>
          </span>
        </div>
      </div>
    </div>
  );
};

export default LoginScreen;
