import React, { useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import Swal from "sweetalert2";
import { FiLogIn } from "react-icons/fi";

const Login = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [role, setRole] = useState(""); // Empty initially, user must select one role
  const URI = import.meta.env.VITE_API_URL;

  useEffect(() => {
    Swal.fire({
      title: "Welcome!",
      text: "Please select your role:",
      icon: "question",
      showDenyButton: true,
      showCancelButton: true,
      confirmButtonText: "CNF",
      denyButtonText: "Super Stockist",
      cancelButtonText: "Distributer",
    }).then((result) => {
      if (result.isConfirmed) {
        setRole("CNF");
        Swal.fire("Welcome CNF!", "", "success");
      } else if (result.isDenied) {
        setRole("Super Stockist");
        Swal.fire("Welcome Super Stockist!", "", "success");
      } else if (
        result.isDismissed &&
        result.dismiss === Swal.DismissReason.cancel
      ) {
        setRole("Distributer");
        Swal.fire("Welcome Distributer!", "", "success");
      }
    });
  }, []);
  const handleLogin = async (e) => {
    e.preventDefault();

    if (!role) {
      toast.error("Please select a valid role before logging in.", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
      return;
    }

    try {
      const endpointMap = {
        CNF: "/api/CNF_Agent/login",
        "Super Stockist": "/api/superstockist/login",
        Distributer: "/api/distributer/login", // Example endpoint
      };

      const url = `${URI}${endpointMap[role]}`;
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
      });

      if (response.ok) {
        const { accessToken, userId } = await response.json();
        localStorage.setItem("email", email);
        localStorage.setItem("token", accessToken);
        localStorage.setItem("userId", userId);

        toast.success("Login successful!", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });

        navigate(`/${role.replace(" ", "")}DashBoard`);
      } else {
        toast.error("Invalid email or password.", {
          position: "top-center",
          autoClose: 5000,
          theme: "colored",
        });
      }
    } catch (error) {
      console.error("Login error:", error.message);
      toast.error("Something went wrong. Please try again.", {
        position: "top-center",
        autoClose: 5000,
        theme: "colored",
      });
    }
  };

  return (
    <div>
      <div className="lg:h-screen md:h-screen h-4/5 lg:mt-0 md:mt-0 mt-16 flex flex-col items-center justify-center ">
        <ToastContainer />

        <div className="relative w-full lg:h-48 md:h-48 ">
          <svg
            xmlns="http://www.w3.org/2000/svg"
            viewBox="0 0 1440 320"
            className="absolute bottom-0"
          >
            <path
              fill="#0099ff"
              fillOpacity="1"
              d="M0,160L40,144C80,128,160,96,240,101.3C320,107,400,149,480,170.7C560,192,640,192,720,197.3C800,203,880,213,960,213.3C1040,213,1120,203,1200,213.3C1280,224,1360,256,1400,272L1440,288L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"
            ></path>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-evenly items-center w-full lg:w-4/5 mx-auto lg:py-10">
          {/* Image Section */}
          <div className="lg:w-1/2 md:w-1/2 w-full justify-center lg:justify-end lg:pl-10 mb-10 lg:mb-0 lg:block md:block">
            <img
              src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg?size=626&ext=jpg"
              alt="login illustration"
              className="object-cover rounded-lg w-full lg:w-3/4 "
            />
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 md:w-1/2 w-full flex flex-col items-center justify-center">
            <h1 className="text-3xl lg:text-5xl md:text-4xl font-bold text-blue-950 text-center mb-8">
              {role === "CNF"
                ? "CNF Login"
                : role === "subadmin"
                ? "Subadmin Login"
                : "Select Role and Login"}
            </h1>

            <h3 className="text-lg text-gray-700 mb-4">
              Enter your Email and Password to sign in
            </h3>

            <div className="lg:w-full md:full w-[90%] max-w-sm mx-auto">
              <form className="flex flex-col">
                <input
                  type="text"
                  placeholder="Email"
                  className="mb-4 px-6 py-4 font-semibold bg-blue-100 rounded-lg text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
                <input
                  type="password"
                  placeholder="Password"
                  className="mb-4 px-6 py-4 font-semibold bg-blue-100 rounded-lg text-lg shadow-md focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all duration-300"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </form>
              <button
                onClick={handleLogin}
                className="w-full bg-blue-600 text-white py-3 rounded-lg font-bold text-lg shadow-lg hover:bg-white hover:text-blue-600 hover:border hover:border-blue-600 hover:shadow-xl transition-all duration-300 mt-4"
              >
                Sign In
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
