// pages/ForgotPassword.tsx
import React, { useState } from "react";
import axios from "axios";

const ForgotPassword: React.FC = () => {
  const [email, setEmail] = useState<string>("");

  const handleSubmit = async (): Promise<void> => {
    try {
      const res = await axios.post("http://localhost:5000/api/forgot-password", {
        email,
      });
      alert(res.data.message);
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
      <h2>Forgot Password</h2>

      <input
        type="email"
        placeholder="Enter your email"
        value={email}
        onChange={(e: React.ChangeEvent<HTMLInputElement>) =>
          setEmail(e.target.value)
        }
      />
      <br />

      <button onClick={handleSubmit}>Send Reset Link</button>
    </div>
  );
};

export default ForgotPassword;
