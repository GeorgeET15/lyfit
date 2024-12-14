import React from "react";
import { useNavigate } from "react-router-dom";

const Dashboard = () => {
  const navigate = useNavigate();

  const handleClick = () => {
    navigate("/dietplan");
  };
  return (
    <div>
      Dashboard
      <button onClick={handleClick}>Get Diet Plan</button>
    </div>
  );
};

export default Dashboard;
