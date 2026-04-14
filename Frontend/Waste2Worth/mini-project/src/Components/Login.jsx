// Login.jsx
import React, { useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";


const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState("user");
  const [message, setMessage] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    try {
      const res = await axios.post("http://localhost:8080/api/auth/login", {
        email,
        password,
        role,
      });

      const { token, name, role: serverRole } = res.data;

      // Save session data
      localStorage.setItem("token", token);
      localStorage.setItem("username", email);
      localStorage.setItem("role", serverRole);
      localStorage.setItem("name", name);

      setMessage("Login successful!");

      // Immediately redirect based on role
      if (serverRole === "user") navigate("/about");
      else if (serverRole === "admin") navigate("/AdminPanel");
      else if (serverRole === "ngo") navigate("/NGOPanel");

    } catch (error) {
      console.error("Login error:", error);
      if (
        error.response &&
        error.response.data === "NGO registration is pending. Please wait for admin approval."
      ) {
        setMessage("Your NGO account is pending approval.");
      } else {
        setMessage("Login failed. Please try again.");
      }
    }
  };

  return (
   <div className="w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">
  
  <div className="w-full max-w-md mx-4 bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
    
    <h2 className="text-3xl font-bold text-white text-center mb-6">
      Login
    </h2>

    {/* Role */}
    <label className="text-white text-sm">Role</label>
    <select
      value={role}
      onChange={(e) => setRole(e.target.value)}
      className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
    >
      <option value="user">User</option>
      <option value="admin">Admin</option>
      <option value="ngo">NGO</option>
    </select>

    {/* Email */}
    <label className="text-white text-sm">Email</label>
    <input
      type="email"
      value={email}
      onChange={(e) => setEmail(e.target.value)}
      required
      className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    {/* Password */}
    <label className="text-white text-sm">Password</label>
    <input
      type="password"
      value={password}
      onChange={(e) => setPassword(e.target.value)}
      required
      className="w-full mt-1 mb-6 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
    />

    {/* Button */}
    <button
      className="w-full bg-blue-500 hover:bg-blue-600 text-white font-semibold py-2 rounded-lg transition duration-300"
      onClick={handleLogin}
    >
      Login
    </button>

    {/* Message */}
    {message && (
      <p className="text-white text-center mt-4">{message}</p>
    )}

  </div>
</div>
  );
};

export default Login;
