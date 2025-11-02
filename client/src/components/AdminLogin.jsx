import React, { useState, useEffect } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import { jwtDecode } from "jwt-decode"; 


const AdminLogin = () => {
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword] = useState(false);
  const [isRegister, setIsRegister] = useState(false);
  const [message, setMessage] = useState("");
  const [messageType, setMessageType] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const navigate = useNavigate();


  // Show denied access message if redirected here from PrivateRoute
  useEffect(() => {
    const msg = sessionStorage.getItem("noAccessMessage");
    if (msg) {
      setMessage(msg);
      setMessageType("error");
      sessionStorage.removeItem("noAccessMessage");
    }
  }, []);

const handleChange = (e) => {
  const { name, value } = e.target;
  setForm(prev => ({
    ...prev,
    [name]: name === 'email' ? value.trim() : value,
  }));
};

  const handleSubmit = async (e) => {
    e.preventDefault();
    setIsSubmitting(true);
    setMessage("");
    setMessageType(""); 
    setTimeout(() => setMessage(false), 5050); // Clear message after 5 seconds
    try {
      const url = isRegister
        ? "http://localhost:5000/api/auth/signup"
        : "http://localhost:5000/api/auth/login";
      const res = await axios.post(url, form);

      const token = res.data.token;
      if (token) {
        let payload = null;
        try {
          payload = jwtDecode(token);
        } catch {
          setMessage("Received invalid token from server. Please try again.");
          setMessageType("error");
          localStorage.removeItem("token");
          setIsSubmitting(false);
          return;
        }

        if (payload.exp && Date.now() >= payload.exp * 1000) {
          setMessage("Your session expired, please log in again.");
          setMessageType("error");
          localStorage.removeItem("token");
          setIsSubmitting(false);
          return;
        }
        if (payload.role !== "admin") {
          setMessage(
            "Access denied: Admins only. Contact owner for admin access."
          );
          setMessageType("error");
          localStorage.removeItem("token");
          setIsSubmitting(false);
          return;
        }

        localStorage.setItem("token", token);
        setMessage("Authentication successful! Redirecting...");
        setMessageType("success");
        setTimeout(() => {
          navigate("/store");
        }, 800);
      } else if (isRegister) {
        setMessage("Registration successful! Please sign in.");
        setMessageType("success");
        setIsRegister(false);
      }
    } catch (err) {
      setMessage(
        err.response?.data?.message || "An error occurred. Please try again."
      );
      setMessageType("error");
    }
    setIsSubmitting(false);
  };

  return (
    <div className="min-h-screen flex items-center justify-center px-4 py-8 bg-gradient-to-r from-indigo-100 via-purple-100 to-pink-100 font-sans">
      <div className="bg-white/90 shadow-2xl rounded-2xl max-w-md w-full p-6 sm:p-8 md:p-10 transition duration-300">
        <h2 className="text-3xl font-bold text-center text-purple-600 mb-8 tracking-tight drop-shadow-sm">
          {isRegister ? "Create Account" : "Sign In"}
        </h2>
        {message && (
          <div
            className={`mb-6 px-5 py-3 rounded-xl text-center font-semibold ${
              messageType === "success"
                ? "bg-green-100 text-green-800"
                : "bg-red-100 text-red-800"
            } shadow`}
            role="alert"
          >
            {message}
          </div>
        )}
        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
      <input
        type="text"
        name="email"
        placeholder="Email"
        value={form.email}
        onChange={handleChange}
        required
        autoComplete="email"
        className="w-full rounded-lg border border-gray-200 bg-purple-50/40 px-4 py-3 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-200 transition"
      />
  <input
    type={showPassword ? "text" : "password"}
    name="password"
    placeholder="Password"
    value={form.password}
    onChange={handleChange}
    required
    autoComplete="current-password"
    className="w-full rounded-lg border border-gray-200 bg-purple-50/40 px-4 py-3 pr-12 text-lg text-gray-800 focus:outline-none focus:ring-2 focus:ring-purple-400 transition"
  />
      <button
        type="submit"
        disabled={isSubmitting}
        className={`w-full rounded-lg bg-gradient-to-r from-indigo-200 via-purple-200 to-pink-200 text-purple-700 font-semibold py-3 shadow hover:bg-gradient-to-r hover:from-indigo-300 hover:to-pink-100 transition text-lg ${
          isSubmitting ? "opacity-70 cursor-not-allowed" : ""
        }`}
      >
        {isRegister ? "Sign Up" : "Sign In"}
      </button>
    </form>
        <div className="mt-7 text-center text-gray-700 font-semibold text-base">
          {isRegister ? "Already have an account? " : "New here? "}
          <button
            onClick={() => {
              setIsRegister(!isRegister);
              setMessage("");
              setMessageType("");
              setForm({ email: "", password: "" });
            }}
            className="underline hover:text-pink-500 cursor-pointer transition"
          >
            {isRegister ? "Sign In" : "Sign Up"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default AdminLogin;
