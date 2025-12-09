// pages/ResetPassword.tsx
import React, { useState } from "react";
import axios from "axios";
import { useParams, useNavigate } from "react-router-dom";

const ResetPassword: React.FC = () => {
  const [password, setPassword] = useState<string>("");
  const params = useParams<{ token?: string }>(); // <-- fixed typing
  const token = params.token;
  const navigate = useNavigate();

  const handleReset = async (): Promise<void> => {
    if (!token) {
      alert("Invalid link: token missing");
      return;
    }

    if (!password) {
      alert("Please enter a new password");
      return;
    }

    try {
      const res = await axios.post(`http://localhost:5000/api/reset-password/${token}`, {
  password,
});



      alert(res.data.message);
      navigate("/login");
    } catch (err) {
      if (axios.isAxiosError(err)) {
        alert(err.response?.data?.message || "Error");
      } else {
        alert("Unexpected error occurred");
      }
    }
  };

  return (
    <div style={{ maxWidth: 300, margin: "50px auto" }}>
      <h2>Reset Password</h2>

      <input
        type="password"
        placeholder="New Password"
        value={password}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setPassword(e.target.value)
        }
      />
      <br />

      <button onClick={handleReset}>Reset Password</button>
    </div>
  );
};

export default ResetPassword;
