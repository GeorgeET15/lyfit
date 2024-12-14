import React from "react";
import { BrowserRouter, Navigate, Route, Routes } from "react-router-dom";
import { useCookies } from "react-cookie";
import OnBoardingScreen from "./screens/OnBoardingScreen";
import HomeScreen from "./screens/HomeScreen";
import LoginScreen from "./screens/LoginScreen";
import SignupScreen from "./screens/SignupScreen";
import Dashboard from "./screens/Dashboard";
import DietPlan from "./screens/DietPlan";

const App = () => {
  const [cookies] = useCookies(["AuthToken"]);
  const authToken = cookies.AuthToken;

  return (
    <BrowserRouter>
      <Routes>
        {/* Redirect to Dashboard if logged in, else show Home */}
        <Route
          path="/"
          element={authToken ? <Navigate to="/dashboard" /> : <HomeScreen />}
        />

        {/* Protected route for Dashboard */}
        {authToken ? (
          <Route path="/dashboard" element={<Dashboard />} />
        ) : (
          // Redirect to Login if not authenticated
          <Route path="/dashboard" element={<Navigate to="/login" />} />
        )}

        {/* Public routes for Login and Signup */}
        {!authToken && <Route path="/login" element={<LoginScreen />} />}
        {!authToken && <Route path="/signup" element={<SignupScreen />} />}

        {/* Catch-all route redirects */}
        <Route
          path="*"
          element={<Navigate to={authToken ? "/dashboard" : "/login"} />}
        />
        <Route path="/onboarding" element={<OnBoardingScreen />} />
        <Route path="/dietplan" element={<DietPlan />} />
      </Routes>
    </BrowserRouter>
  );
};

export default App;
