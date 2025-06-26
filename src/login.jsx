import React from "react";
import Logo from "./assets/logo.png"; 
import Footer from "./components/footer";
import { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await axios.post("https://backend-dismantle.vercel.app/login", {
        username,
        password,
      });

      if (response.status === 200) {
        setUsername(response.data.username);
        const expiredAt = new Date().getTime() + 2 * 60 * 60 * 1000; 
        localStorage.setItem("username", username);
        localStorage.setItem("user_expired", expiredAt.toString());
        navigate(`/admin/dashboard`);
      }
    } catch (error) {
      console.error("Login error:", error);
      setError("Username atau password salah");
    }
  }

  return (
    <div className="min-h-screen flex flex-col items-center justify-center bg-gray-100">
      <div className="bg-white p-10 rounded-lg shadow-md w-5/6 lg:w-full max-w-sm text-center m-10">
        <div className="mb-4 flex flex-col items-center justify-center">
          <img
            src={Logo} 
            alt="PLN Icon Plus"
            className="w-40"
          />
          <h1 className="text-2xl font-bold text-gray-800">ONT Management</h1>
        </div>

        <hr className="w-full bg-black mx-auto mb-2"/>

        <h2 className="text-xl font-bold mb-6">Login</h2>

        <form onSubmit={handleLogin}>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Username
            </label>
            <input
              type="text"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              placeholder="Enter your username"
              required
            />
          </div>
          <div className="mb-4 text-left">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Password
            </label>
            <input
              type="password"
              className="w-full border border-gray-300 rounded px-3 py-2 focus:outline-none focus:ring-2 focus:ring-gray-400"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              placeholder="Enter your password"
              required
            />
          </div>

          {error && (
            <div className="text-red-500 text-sm mb-4">
              {error}
            </div>
          )}

          <button
            type="submit"
            className="w-full bg-gray-600 hover:bg-gray-700 text-white py-2 rounded transition duration-200 cursor-pointer"
          >
            Sign in
          </button>
        </form>
      </div>
      <Footer />
    </div>
  );
}
