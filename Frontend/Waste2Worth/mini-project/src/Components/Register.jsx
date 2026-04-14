import React, { useState } from 'react';
import axios from 'axios';
// import "./register.css";

const Register = () => {
  const [form, setForm] = useState({
    name: '',
    email: '',
    phone: '',
    password: '',
    role: 'User',
    status: 'APPROVED', // Default for User
  });

  const [message, setMessage] = useState('');

  const handleChange = (e) => {
    const { id, value } = e.target;
    setForm(prevForm => {
      const updatedForm = { ...prevForm, [id]: value };
      // Update status based on role selection
      if (id === 'role') {
        updatedForm.status = value === 'NGO' ? 'PENDING' : 'APPROVED';
      }
      return updatedForm;
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post('http://localhost:8080/api/auth/register', form);
      setMessage(res.data);
    } catch (err) {
      setMessage('Registration failed. Please try again.');
    }
  };

  return (
   <div className="w-screen min-h-screen bg-gradient-to-r from-blue-500 to-purple-600 flex items-center justify-center">

  <div className="w-full max-w-md mx-4 bg-white/20 backdrop-blur-lg shadow-2xl rounded-2xl p-8 border border-white/30">
    
    <h2 className="text-3xl font-bold text-white text-center mb-6">
      Food Bank Registration
    </h2>

    <form onSubmit={handleSubmit}>

      {/* Name */}
      <label className="text-white text-sm">Full Name</label>
      <input
        type="text"
        id="name"
        onChange={handleChange}
        required
        className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Email */}
      <label className="text-white text-sm">Email</label>
      <input
        type="email"
        id="email"
        onChange={handleChange}
        required
        className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Phone */}
      <label className="text-white text-sm">Phone</label>
      <input
        type="tel"
        id="phone"
        onChange={handleChange}
        required
        className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Role */}
      <label className="text-white text-sm">Register as</label>
      <select
        id="role"
        onChange={handleChange}
        required
        className="w-full mt-1 mb-4 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      >
        <option value="User">User</option>
        <option value="NGO">NGO</option>
      </select>

      {/* Password */}
      <label className="text-white text-sm">Password</label>
      <input
        type="password"
        id="password"
        onChange={handleChange}
        required
        className="w-full mt-1 mb-6 p-2 rounded-lg bg-white/80 focus:outline-none focus:ring-2 focus:ring-blue-400"
      />

      {/* Button */}
      <button
        type="submit"
        className="w-full bg-purple-500 hover:bg-purple-600 text-white font-semibold py-2 rounded-lg transition duration-300"
      >
        Register
      </button>

    </form>

    {/* Message */}
    {message && (
      <p className="text-white text-center mt-4">{message}</p>
    )}

  </div>
</div>
  );
};

export default Register;
