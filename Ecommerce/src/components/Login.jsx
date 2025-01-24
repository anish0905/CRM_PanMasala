import React, { useEffect, useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom'; 
import axios from 'axios';

const Login = () => {
  const { panshopOwner_id } = useParams();
  const navigate = useNavigate();
  const [loginData, setLoginData] = useState(null);
  const apiUrl = import.meta.env.VITE_API_URL;


  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await axios.get(`${apiUrl}/api/panShopLogin/${panshopOwner_id}`);
        setLoginData(response.data);
        console.log(response.data);

        const addressParts = response.data.owner.address.split(',');
        const state = addressParts[addressParts.length - 2].trim(); // Extract the second last part which is the state

        localStorage.setItem("id", response.data.owner._id);
        localStorage.setItem("panShopOwner", response.data.owner.panShopOwner);
        localStorage.setItem("address", response.data.owner.address);
        localStorage.setItem("state", state);
        
        navigate("/admin");

      } catch (error) {
        console.log(error);
      }
    };

    fetchData();
  }, [panshopOwner_id, navigate]);

  return (
    <>
      {loginData ? (
        <h1 className='text-white'>Login successful</h1>
      ) : (
        <div className='flex justify-center items-center content-center'>
          <h1 className='text-white font-semibold text-3xl pt-20'>Login failed, please try again</h1>
        </div>
      )}
    </>
  );
}

export default Login;