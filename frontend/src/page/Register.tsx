import { useState } from "react";
import { registerUser } from "../services/auth.service"; 
import "../styles/auth.css";
import { AxiosError } from "axios";


const Register = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    password: "",
  });

  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    setLoading(true);
    setError("");

    try {
      // ✅ SEND DATA TO BACKEND
      const response = await registerUser(formData);

      alert("✅ Registration successful!");
      console.log("Backend Response:", response);

      // ✅ OPTIONAL: Redirect to login page after success
      window.location.href = "/login";
    }
    catch (err: unknown) {
  const error = err as AxiosError<{ message: string }>;
  console.error("Registration Error:", error);
  setError(error.response?.data?.message || error.message || "Registration failed");
}

finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-container">
      <form className="auth-form" onSubmit={handleSubmit}>
        <h2>Register</h2>

        {/* ✅ ERROR MESSAGE */}
        {error && <p style={{ color: "red", textAlign: "center" }}>{error}</p>}

        <input
          type="text"
          name="name"
          placeholder="Full Name"
          value={formData.name}
          onChange={handleChange}
          required
        />

        <input
          type="email"
          name="email"
          placeholder="Email Address"
          value={formData.email}
          onChange={handleChange}
          required
        />

        <input
          type="password"
          name="password"
          placeholder="Password"
          value={formData.password}
          onChange={handleChange}
          required
        />

        <button type="submit" disabled={loading}>
          {loading ? "Registering..." : "Register"}
        </button>

        <p>
          Already have an account? <a href="/login">Login</a>
        </p>
      </form>
    </div>
  );
};

export default Register;
