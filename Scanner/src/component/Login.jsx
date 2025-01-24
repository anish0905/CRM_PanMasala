import React, { useState } from "react";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { useNavigate } from "react-router-dom";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const API_URL = process.env.REACT_APP_API_URL;
  console.log(API_URL); // should print "http://localhost:5001" if set up correctly

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(
        `${API_URL}/api/qrGeneraterBoy/login`,
        {
          email,
          password,
        }
      );

      // Store the token in local storage
      localStorage.setItem("token", res.data.accessToken);
      localStorage.setItem("id", res.data.id);
      // console.log("accessToken",accessToken)
      // console.log("res",res.data)

      await toast.success("Login successful!", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
      navigate("/register");
    } catch (error) {
      toast.error("Login failed, please try again", {
        position: "top-center",
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        progress: undefined,
        theme: "colored",
      });
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex flex-col md:flex-row items-center justify-center bg-gray-100 px-4">
        <div className="w-full md:w-1/2 lg:w-2/3 xl:w-3/4 2xl:w-4/5">
          <img
            src="https://dev.whitewizard.in/images/log2.jpg"
            alt="Login"
            className="w-full h-auto"
          />
        </div>
        <div className="bg-white p-4 md:p-8 lg:p-10 xl:p-12 2xl:p-16 rounded-lg shadow-md w-full max-w-md md:max-w-xl lg:max-w-2xl xl:max-w-3xl 2xl:max-w-4xl mb-4 md:mb-0 mx-4">
          <h2 className="text-lg md:text-xl lg:text-2xl xl:text-3xl 2xl:text-4xl font-semibold mb-4 text-center">
            Login
          </h2>
          <form onSubmit={handleSubmit} className="h-full">
            <div className="mb-2 sm:mb-4 md:mb-6 lg:mb-8">
              <label
                htmlFor="email"
                className="block text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-600 mb-1"
              >
                Email
              </label>
              <input
                type="email"
                id="email"
                className="mt-1 p-2 w-full border rounded-md text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
                placeholder="Enter your email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
              />
            </div>
            <div className="mb-2 sm:mb-4 md:mb-6 lg:mb-8">
              <label
                htmlFor="password"
                className="block text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl font-medium text-gray-600 mb-1"
              >
                Password
              </label>
              <input
                type="password"
                id="password"
                className="mt-1 p-2 w-full border rounded-md text-xs sm:text-sm md:text-base lg:text-lg xl:text-xl 2xl:text-2xl"
                placeholder="Enter your password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
            </div>
            <div className="mb-4 text-center">
              <button
                type="submit"
                className="w-full bg-blue-500 text-white p-3 rounded-md text-base sm:text-lg md:text-xl lg:text-xl xl:text-2xl 2xl:text-3xl"
              >
                Login
              </button>
            </div>
            <div className="text-center">
              <p>
                Delivery Boy Login{" "}
                <span className="text-blue-600 underline rounded-md font-semibold ">
                  {" "}
                  <a href="/DeliveryBoyLogin">Click here</a>
                </span>
              </p>
            </div>
          </form>
        </div>
      </div>
    </>
  );
}

export default Login;
