import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { FiLogIn } from "react-icons/fi";

const AdminDashbord = () => {
  const navigate = useNavigate();
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const handleLogin = async () => {
    try {
      const adminResponse = await fetch(`${BASE_URL}/api/admin/login`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({ email, password })
      });
      if (adminResponse.ok) {
        const adminData = await adminResponse.json();
        const { accessToken } = adminData;
        localStorage.setItem('email', email);
        navigate("/AdminDashBoard");
      } else {
        const executiveResponse = await fetch(`${BASE_URL}/api/executives/loginexecutive`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify({ email, password })
        });
        if (executiveResponse.ok) {
          const executiveData = await executiveResponse.json();
          const { accessToken,userId } = executiveData;
          localStorage.setItem('email', email);
          localStorage.setItem('token', accessToken);
          localStorage.setItem('state', state);
          localStorage.setItem('currntUserId', userId);
          toast.success('Signin is successful', {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
          });
          navigate("/ExecutiveDashBoard");
        } else {
          toast.error('Invalid email or Password', {
            position: "top-center",
            autoClose: 5000,
            theme: "colored",
          });
        }
      }
    } catch (error) {
      console.error('Error occurred during login:', error.message);
    }
  }; 

  return (
    <div>
       <>
      <div className="lg:h-screen md:h-screen  h-4/5  lg:mt-0 md:mt-0 mt-16 flex flex-col items-center justify-center bg-gray-100">

        <ToastContainer />

        <div className="relative w-full lg:h-48 md:h-48 ">
          <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 1440 320" className="absolute bottom-0">
            <path fill="#0099ff" fillOpacity="1" d="M0,160L40,144C80,128,160,96,240,101.3C320,107,400,149,480,170.7C560,192,640,192,720,197.3C800,203,880,213,960,213.3C1040,213,1120,203,1200,213.3C1280,224,1360,256,1400,272L1440,288L1440,0L1400,0C1360,0,1280,0,1200,0C1120,0,1040,0,960,0C880,0,800,0,720,0C640,0,560,0,480,0C400,0,320,0,240,0C160,0,80,0,40,0L0,0Z"></path>
          </svg>
        </div>

        <div className="relative z-10 flex flex-col lg:flex-row justify-evenly items-center w-full lg:w-4/5 mx-auto lg:py-10 ">
          {/* Image Section */}
          <div className="lg:w-1/2 md:w-1/2 w-full  justify-center lg:justify-end lg:pl-10 mb-10 lg:mb-0  lg:block md:block hidden ">
            <img
              src="https://img.freepik.com/premium-vector/register-access-login-password-internet-online-website-concept-flat-illustration_385073-108.jpg?size=626&ext=jpg"
              alt="login illustration"
              className="object-cover rounded-lg shadow-lg w-full lg:w-3/4 transform hover:scale-105 transition-transform duration-300"
            />
          </div>

          {/* Form Section */}
          <div className="lg:w-1/2 md:w-1/2 w-full flex flex-col items-center justify-center">
            {/* <h1 className="lg:text-5xl md:text-4xl text-3xl font-bold text-blue-600 mb-6">
              Admin/Stockist Login
            </h1> */}
            <h1 className="text-3xl lg:text-5xl md:text-4xl font-bold text-blue-950 text-center mb-8">
              <span className="letter">A</span>
              <span className="letter">d</span>
              <span className="letter">m</span>
              <span className="letter">i</span>
              <span className="letter">n</span>
              <span className="letter">/</span>
      

              <span className="letter">S</span>
              <span className="letter">t</span>
              <span className="letter">o</span>
              <span className="letter">c</span>
              <span className="letter">k</span>
              <span className="letter">i</span>
              <span className="letter">s</span>
              <span className="letter">t</span>
              <span className="letter">&nbsp;</span>
              <span className="letter">L</span>
              <span className="letter">o</span>
              <span className="letter">g</span>
              <span className="letter">i</span>
              <span className="letter">n</span>
            </h1>

            <h3 className="text-lg text-gray-700 mb-4">
              Enter your Email and Password to sign in
            </h3>

            <div className=" lg:w-full md:full w-[90%] max-w-sm mx-auto">
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
              <Link to={`/Admin-Register`} className="text-blue-600  mt-2 float-end text-xl">I don't have an account</Link>
            </div>
            {/* Management and Superstockist */}
            <div className="flex flex-col lg:flex-row mt-10 gap-6 lg:gap-10 justify-center items-center">
              <button className="w-full lg:w-96 lg:text-2xl px-6 py-4 lg:px-10 lg:py-5 bg-white rounded-full font-bold 
    text-blue-500 flex justify-between items-center hover:bg-blue-200 hover:text-black border border-black 
    shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-400">
                <Link to={`/superstockistLogin/${routesName}`} className="w-full text-center">
                  Super Stockist Login
                </Link>
                <span className="ml-2 bg-blue-500 p-2 rounded-full">
                  <FiLogIn className="text-white" />
                </span>
              </button>

              <button className="w-full lg:w-96 lg:text-2xl px-6 py-4 lg:px-10 lg:py-5 bg-white rounded-full font-bold 
    text-blue-500 flex justify-between items-center hover:bg-blue-200 hover:text-black border border-black 
    shadow-lg hover:shadow-xl transition duration-300 ease-in-out transform hover:-translate-y-1 focus:outline-none focus:ring-4 focus:ring-blue-400">
                <Link to={`/managementLogin/${routesName}`} className="w-full text-center">
                  Management Login
                </Link>
                <span className="ml-2 bg-blue-500 p-2 rounded-full">
                  <FiLogIn className="text-white" />
                </span>
              </button>
            </div>

          </div>
        </div>
      </div>

    </>
    </div>
  )
}

export default AdminDashbord
