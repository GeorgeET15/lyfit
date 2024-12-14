import { useCookies } from "react-cookie";
import { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

const OnboardingScreen = () => {
  const [cookies, setCookie] = useCookies(["AuthToken"]);
  const [isLoading, setLoading] = useState(false);
  const userId = localStorage.getItem("UserId");
  const [username, setUsername] = useState("");
  const [age, setAge] = useState("");
  const [height, setHeight] = useState("");
  const [weight, setWeight] = useState("");
  const [diet_res, setDietres] = useState("");
  const [exe_style, setExer] = useState("");

  const navigate = useNavigate();

  const handleOnboarding = async (e) => {
    const payload = {
      username,
      age,
      height,
      weight,
      diet_res,
      exe_style,
      userId,
    };

    try {
      await axios.post("http://localhost:8000/onboarding", payload);
      alert("Onboarding completed successfully!");
      navigate("/dashboard");
    } catch (error) {
      console.log("Error creating time capsule: ", error);
    } finally {
      navigate("/dashboard");
      setLoading(false);
    }
  };

  return (
    <div>
      <label>Name</label>
      <input
        type="name"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
      />
      <label>Age</label>
      <input type="text" value={age} onChange={(e) => setAge(e.target.value)} />
      <label>Weight</label>
      <input
        type="text"
        value={weight}
        onChange={(e) => setWeight(e.target.value)}
      />
      <label>Heigh</label>
      <input
        type="text"
        value={height}
        onChange={(e) => setHeight(e.target.value)}
      />
      <label>Diet Resctriction</label>
      <input
        type="text"
        value={diet_res}
        onChange={(e) => setDietres(e.target.value)}
      />
      <label>Exercise Style</label>
      <input
        type="text"
        value={exe_style}
        onChange={(e) => setExer(e.target.value)}
      />

      <button
        type="submit"
        className="submit-button"
        disabled={isLoading}
        onClick={handleOnboarding}
      >
        {isLoading ? "Uploading..." : "Create Capsule"}
      </button>
    </div>
  );
};

export default OnboardingScreen;
