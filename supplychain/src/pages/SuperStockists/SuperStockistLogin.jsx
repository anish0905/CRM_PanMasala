import React, { useState } from 'react';
import axios from 'axios';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import { useNavigate } from 'react-router-dom';
import { BASE_URL } from '../../constants';

function SuperStockistLogin() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      const res = await axios.post(`${BASE_URL}/api/superstockist/login`, {
        email,
        password,
      });

      const { accessToken } = res.data;

      
      localStorage.setItem('stockistToken', accessToken);
      localStorage.setItem('email', email);

      // Fetch super stockist details
      await findTheSuperStockistDetails();

      // Show success notification and navigate
      toast.success('Login successful!', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
      navigate('/SuperStockist-Order');
    } catch (error) {
      toast.error('Login failed, please try again', {
        position: 'top-center',
        autoClose: 5000,
        hideProgressBar: false,
        closeOnClick: true,
        pauseOnHover: true,
        draggable: true,
        theme: 'colored',
      });
    }
  };

  const findTheSuperStockistDetails = async () => {
    try {
      const resp = await axios.get(`${BASE_URL}/api/superstockist/current`, {
        headers: {
          Authorization: `Bearer ${localStorage.getItem('stockistToken')}`,
        },
      });

        localStorage.setItem('currentUserId', resp.data.user.id);
    
    } catch (error) {
      console.error('Error in API call:', error.message);
    }
  };

  return (
    <>
      <ToastContainer />
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-r from-blue-200 via-purple-100 to-pink-200 px-4">
        <div className="bg-white p-8 rounded-2xl shadow-lg max-w-md w-full">
          <div className="text-center mb-6">
            <img
              src="https://dev.whitewizard.in/images/log2.jpg"
              alt="Login"
              className="mx-auto h-20 w-auto"
            />
            <h2 className="text-2xl font-bold text-gray-800 mt-4">Super Stockist Login</h2>
          </div>
          <form onSubmit={handleSubmit}>
            <div className="mb-4">
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-600"
              >
                Email
              </label>
              <div className="relative">
                <input
                  type="email"
                  id="email"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  ✉️
                </span>
              </div>
            </div>
            <div className="mb-4">
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-600"
              >
                Password
              </label>
              <div className="relative">
                <input
                  type="password"
                  id="password"
                  className="w-full p-3 border border-gray-300 rounded-lg shadow-sm focus:outline-none focus:ring-2 focus:ring-blue-400"
                  placeholder="Enter your password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
                <span className="absolute inset-y-0 right-4 flex items-center text-gray-400">
                  🔒
                </span>
              </div>
            </div>
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-3 rounded-lg hover:bg-blue-600 focus:ring-2 focus:ring-blue-400 transition duration-200"
            >
              Login
            </button>
          </form>
        </div>
      </div>
    </>
  );
}

export default SuperStockistLogin;
