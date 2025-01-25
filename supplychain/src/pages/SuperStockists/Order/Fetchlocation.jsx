import React, { useState } from "react";
import axios from "axios";
import { SuperStockistSideBar } from "../SuperStockistSideBar";
import { useNavigate } from "react-router-dom";
import Swal from "sweetalert2"; // Import SweetAlert2
import { BASE_URL } from "../../../constants";

const Fetchlocation = () => {
  const navigate = useNavigate();
  // States for managing pop-up, location, and messages
  const [isPopupOpen, setIsPopupOpen] = useState(true); // Start with the pop-up open
  const [isLocationFetched, setIsLocationFetched] = useState(false);
  const [location, setLocation] = useState(null);
  const userId = localStorage.getItem("currentUserId");

  // Function to handle fetching the location
  const fetchLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        (position) => {
          const { latitude, longitude } = position.coords;
          setLocation({ latitude, longitude });
          setIsLocationFetched(true);
        },
        (error) => {
          console.error("Error fetching geolocation:", error);
          Swal.fire({
            icon: "error",
            title: "Oops...",
            text: "Unable to fetch location",
          });
        }
      );
    } else {
      Swal.fire({
        icon: "error",
        title: "Oops...",
        text: "Geolocation is not supported by this browser.",
      });
    }
  };

  // Function to handle the API call to update the location
  const updateLocation = async () => {
    if (location) {
      try {
        const response = await axios.put(
          `${BASE_URL}/api/superstockist/update-location/${userId}`,
          {
            locations: {
              latitude: location.latitude,
              longitude: location.longitude,
            },
          }
        );
        // Show success message using SweetAlert2
        Swal.fire({
          icon: "success",
          title: "Location Updated",
          text: "Thank you! Your warehouse location will be added.",
        });

        // Close the pop-up after saving the location
        setIsPopupOpen(false);

        // Navigate to the desired route after saving the location
        navigate("/SuperStockist-Order");
      } catch (error) {
        console.error("Error updating location:", error);

        Swal.fire({
          icon: "error",
          title: "Failed to Update Location",
          text: "There was an issue while saving the location.",
        });
      }
    }
  };

  // Handle the "Yes" button click
  const handleYesClick = () => {
    fetchLocation();
  };

  // Handle the "No" button click
  const handleNoClick = () => {
    Swal.fire({
      icon: "info",
      title: "Thank You!",
      text: "You chose not to provide the location.",
    });
    setIsPopupOpen(false);
  };

  return (
    <div className="flex gap-6 bg-[#dbeafe] w-full h-screen">
      <div className="lg:p-5 xl:p-5 p-4 ml-0">
        <SuperStockistSideBar />
      </div>

      {/* Pop-up */}
      {isPopupOpen && (
        <div className="fixed top-0 left-0 w-full h-full bg-gray-800 bg-opacity-50 flex justify-center items-center z-10">
          <div className="bg-white p-6 rounded shadow-lg max-w-md">
            <h2 className="text-xl mb-4">
              Are you available inside the warehouse?
            </h2>
            <div className="flex gap-4">
              <button
                onClick={handleYesClick}
                className="bg-green-500 text-white px-4 py-2 rounded"
              >
                Yes
              </button>
              <button
                onClick={handleNoClick}
                className="bg-red-500 text-white px-4 py-2 rounded"
              >
                No
              </button>
            </div>
            {isLocationFetched && (
              <div className="mt-4">
                <p>Latitude: {location.latitude}</p>
                <p>Longitude: {location.longitude}</p>
                <button
                  onClick={updateLocation}
                  className="bg-blue-500 text-white px-4 py-2 mt-4 rounded"
                >
                  Save Location
                </button>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
};

export default Fetchlocation;
