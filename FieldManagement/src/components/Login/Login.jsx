import React, { useState } from "react";
import { useNavigate } from "react-router-dom";

const Login = () => {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const URI = import.meta.env.VITE_API_URL;

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError(""); // Reset error state
    if (!email || !password) {
      setError("Please fill in both fields.");
      return;
    }

    try {
      const response = await fetch(`${URI}/api/fieldManager/login`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (!response.ok) {
        setError("Invalid email or password.");
        return;
      }

      const data = await response.json();
      localStorage.setItem("token", data.token);
      localStorage.setItem("email", data.user.email);
      localStorage.setItem("fieldManager_Id", data.user.id);
      localStorage.setItem("role", data.user.role);
      localStorage.setItem("FEA_id", data.user.FEA_id);
      navigate("/Attendance/login");
    } catch (error) {
      setError("Failed to login. Please try again.");
    }
  };

  return (
    <div
      className="flex justify-center items-center min-h-screen bg-cover bg-center w-[100vw]"
      style={{
        backgroundImage:
          "url('https://i.postimg.cc/XYjWrv36/dark-hexagonal-background-with-gradient-color_79603-1409.jpg')",
      }}
    >
      <div className="relative w-[370px] h-[450px] bg-[#1c1c1c] rounded-[50px_5px] overflow-hidden">
        <div
          className="absolute top-[-50%] left-[-50%] w-[370px] h-[450px] bg-gradient-to-br from-transparent via-[#45f3ff] to-[#45f3ff] 
                        origin-bottom-right animate-spin-slow"
        ></div>
        <div
          className="absolute top-[-50%] left-[-50%] w-[370px] h-[450px] bg-gradient-to-br from-transparent via-[#d9138a] to-[#d9138a] 
                        origin-bottom-right animate-spin-slow delay-[-3s]"
        ></div>

        <form
          className="absolute inset-[2px] bg-[#28292d] p-8 rounded-[50px_5px] flex flex-col z-10"
          onSubmit={handleSubmit}
        >
          <h2 className="text-[#45f3ff] text-[35px] font-medium text-center">
            Sign In
          </h2>
          {error && (
            <div className="text-[#ff0000] text-[15px] text-center mb-4">
              {error}
            </div>
          )}

          <div className="relative w-full mt-9">
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter your email"
              autoComplete="off" // Disable autofill
              className="relative w-full px-3 py-2 bg-transparent text-white text-lg tracking-wider outline-none border-none peer"
            />
            <label className="absolute left-3 top-2 text-gray-400 text-lg tracking-wide transition-all duration-500 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-[#45f3ff]"></label>
            <label className="absolute left-3 top-2 text-gray-400 text-lg tracking-wide transition-all duration-500 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-[#45f3ff]"></label>
            <i className="absolute left-0 bottom-0 w-full h-[2px] bg-[#88d1d6] transition-all duration-500 peer-focus:h-[44px] peer-focus:bg-[#030303]/50 rounded-md"></i>
          </div>

          <div className="relative w-full mt-8">
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter your Password"
              autoComplete="off" // Disable autofill
              className="relative w-full px-3 py-2 bg-transparent text-white text-lg tracking-wider outline-none border-none peer"
            />
            <label className="absolute left-3 top-2 text-gray-400 text-lg tracking-wide transition-all duration-500 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-[#45f3ff]"></label>
            <label className="absolute left-3 top-2 text-gray-400 text-lg tracking-wide transition-all duration-500 peer-focus:-translate-y-6 peer-focus:text-sm peer-focus:text-[#45f3ff]"></label>
            <i className="absolute left-0 bottom-0 w-full h-[2px] bg-[#45f3ff] transition-all duration-500 peer-focus:h-[44px] peer-focus:bg-[#030303]/50 rounded-md"></i>
          </div>

          <button
            type="submit"
            className="mt-10 text-[20px] font-semibold bg-[#45f3ff] py-2 rounded-full hover:bg-gradient-to-r from-[#45f3ff] to-[#d9138a] transition-all active:opacity-80"
          >
            Login
          </button>

          <div className="flex justify-between mt-8 text-gray-400">
            {/* <a href="#" className="hover:text-[#45f3ff]">
              Forgot Password?
            </a>
            <a href="#" className="hover:text-[#d9138a]">
              Sign Up
            </a> */}
          </div>
        </form>
      </div>
    </div>
  );
};

export default Login;
