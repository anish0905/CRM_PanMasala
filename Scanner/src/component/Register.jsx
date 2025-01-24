import React, { useState, useRef, useEffect } from "react";
import img from "../../src/assets/registerImage.webp";
import axios from "axios";
import { useNavigate } from "react-router-dom";
import Logout from "./utils/Logout";

export default function Register() {
  const navigate = useNavigate();
  const [latitude, setLatitude] = useState(null);
  const [longitude, setLongitude] = useState(null);
  const [address, setAddress] = useState("");
  const [stateDistrict, setStateDistrict] = useState(""); // Added state for state_district

  console.log(stateDistrict);

  const API_URL= process.env.REACT_APP_API_URL;

  const [suburb, setSuburb] = useState("");
  console.log(suburb);
  const [state, setState] = useState("");
  console.log("staate ...", state);

  const [formData, setFormData] = useState({
    panShopOwner: "",
    phoneNumber: "",
    address: "",
    latitude: 0,
    longitude: 0,
    district: stateDistrict,
    subDivision: suburb,
    state: state,
    id: localStorage.getItem("id"),
  });

  console.log("formData  ...", formData);
  const [error, setError] = useState("");

  const panShopOwnerRef = useRef();
  const phoneNumberRef = useRef();

  // Fetch user's geolocation
  useEffect(() => {
    const geo = navigator.geolocation;
    if (geo) {
      geo.getCurrentPosition((position) => {
        const userLatitude = position.coords.latitude;
        const userLongitude = position.coords.longitude;
        setLatitude(userLatitude);
        setLongitude(userLongitude);
        setFormData((prevData) => ({
          ...prevData,
          latitude: userLatitude,
          longitude: userLongitude,
        }));
        getUserAddress(userLatitude, userLongitude);
      });
    }
  }, []);

  // Fetch user's address using OpenCage API
  const getUserAddress = async (lat, lon) => {
    const url = `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${lat}+${lon}&pretty=1&no_annotations=1`;
    console.log(url);

    try {
      const response = await fetch(url);
      const data = await response.json();
      console.log("User Address", data);
      setAddress(data.results[0].formatted);
      setState(data.results[0].components.state || "complete");

      setStateDistrict(data.results[0].components.state_district || "");
      setSuburb(data.results[0].components.suburb || "");
      setFormData((prevFormData) => ({
        ...prevFormData,
        address: data.results[0].formatted,
      }));
    } catch (error) {
      console.error("Error fetching address:", error);
    }
  };

  // Handle form submission
  const handleSubmit = async (e) => {
    e.preventDefault();
    const token = localStorage.getItem("accessToken");

    // Update the formData with the current state values
    const dataToSend = {
      panShopOwner: panShopOwnerRef.current.value,
      phoneNumber: phoneNumberRef.current.value,
      address,
      latitude: formData.latitude,
      longitude: formData.longitude,
      id: formData.id,
      district: stateDistrict, // Use stateDistrict here
      subDivision: suburb, // Use suburb here
      state: state, // Use state here
    };
    console.log("dataToSend  ", dataToSend);
    try {
      const response = await axios.post(
        `${API_URL}/api/panShopOwner/`,
        dataToSend,
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );
      const { _id } = response.data.owner;
      localStorage.setItem("user_id", _id);
      navigate("/qrDetail");
    } catch (error) {
      console.error("Error submitting form:", error);
      if (error.response && error.response.status === 401) {
        setError("Unauthorized: User is not authorized. Please login again.");
      } else {
        setError("Invalid Phone Number.");
      }
    }
  };

  // Handle form reset
  const handleCancel = () => {
    setFormData({
      panShopOwner: "",
      phoneNumber: "",
      address: "",
      latitude: 0,
      longitude: 0,
      district: "",
      subDivision: "",
      state: "",
      id: localStorage.getItem("id"),
    });
    setAddress("");
  };

  return (
    <div className="lg:flex justify-center content-center lg:p-32 p-0 m-0 bg-slate-100 w-full">
      <div className="flex flex-col lg:flex-row mx-auto p-0 rounded w-full gap-0">
        <div className="lg:w-1/2 lg:flex block p-0">
          <div className="py-2 px-4 fixed">
            <Logout />
          </div>
          <img className="rounded-r h-full object-cover" src={img} alt="" />
        </div>
        <div className="w-full lg:w-1/3 p-4 lg:px-5 py-5 lg:py-10 overflow-hidden bg-blue-500 text-white rounded-t-3xl lg:rounded-lg h-full shadow-xl">
          <h2 className="mt-2 text-center font-heading leading-9 tracking-tight text-white">
            Register
          </h2>
          <form className="mt-6 lg:py-3 px-5" onSubmit={handleSubmit}>
            <div>
              <label
                htmlFor="panShopOwner"
                className="block font text-white leading-6"
              >
                Shopkeeper Name
              </label>
              <input
                id="panShopOwner"
                type="text"
                ref={panShopOwnerRef}
                required
                className="block w-full text-black mt-1 rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="phoneNumber"
                className="block font leading-6 text-white"
              >
                Phone Number
              </label>
              <input
                id="phoneNumber"
                type="number"
                ref={phoneNumberRef}
                required
                className="block w-full mt-1 text-black rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
              />
            </div>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {/* Display state_district and suburb */}
            {/* 
            <div className="mt-4">
              <label
                htmlFor="state"
                className="block font leading-6 text-white"
              >
                State
              </label>
              <input
                id="state"
                type="text"
                value={state}
                className="block w-full mt-1 text-black rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
                readOnly
              />
            </div>
            <div className="mt-4">
              <label
                htmlFor="state_district"
                className="block font leading-6 text-white"
              >
                State District
              </label>
              <input
                id="state_district"
                type="text"
                value={stateDistrict}
                className="block w-full mt-1 text-black rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
                readOnly
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="suburb"
                className="block font leading-6 text-white"
              >
                Suburb
              </label>
              <input
                id="suburb"
                type="text"
                value={suburb}
                className="block w-full mt-1 text-black rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
                readOnly
              />
            </div>

            <div className="mt-4">
              <label
                htmlFor="address"
                className="block font leading-6 text-white"
              >
                Address
              </label>
              <textarea
                id="address"
                value={address}
                className="block w-full mt-1 text-black rounded-xl border-gray-300 shadow-sm focus:border-indigo-600 focus:ring focus:ring-indigo-200 focus:ring-opacity-50 border border-solid py-3 px-4"
                readOnly
              />
            </div> */}

            <div className="mt-6">
              <button
                type="submit"
                className="block w-full bg-green-500 text-white font-bold rounded-xl py-3 hover:bg-green-600"
              >
                Register
              </button>
            </div>
            <div className="mt-2">
              <button
                type="button"
                onClick={handleCancel}
                className="block w-full bg-red-500 text-white font-bold rounded-xl py-3 hover:bg-red-600"
              >
                Reset
              </button>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}
