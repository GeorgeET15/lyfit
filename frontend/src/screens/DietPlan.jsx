import React, { useEffect, useState } from "react";
import axios from "axios";
import { GoogleGenerativeAI } from "@google/generative-ai";

const DietPlan = () => {
  const [userData, setuserData] = useState(" ");
  const [dietPlan, setdietPlan] = useState(" ");
  const [isLoading, setisLoading] = useState(false);
  const GEMINI_API_KEY = "AIzaSyAzqhTIe7KDSgZsfRBbq4Skhw_P9cDmefE";
  useEffect(() => {
    axios
      .get("http://localhost:8000/getuserdata")
      .then((onData) => setuserData(onData.data));
  }, []);

  const generateCaption = async (videoUri) => {
    const genAI = new GoogleGenerativeAI(GEMINI_API_KEY);
    const model = genAI.getGenerativeModel({ model: "models/gemini-1.5-pro" });

    const videoResp = await fetch(videoUri).then((response) =>
      response.arrayBuffer()
    );

    const result = await model.generateContent([
      `This is a wellness app, ${userData.username}, ${userData.age}, ${userData.weight},  ${userData.height},  ${userData.diet_res}, ${userData.exe_style}, these are the data of a user create a tailored dietplan to reach the desired physique`,
    ]);

    console.log(result.response.text());

    return setdietPlan(result.response.text());
  };

  return (
    <div>
      DietPlan
      <button onClick={generateCaption}>Click for plan</button>
      <p>{dietPlan}</p>
    </div>
  );
};

export default DietPlan;
