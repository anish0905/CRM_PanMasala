import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import { IoMdClose } from "react-icons/io";


// Fixing the marker icon issue with Leaflet
delete L.Icon.Default.prototype._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.7.1/images/marker-shadow.png",
});

const GoogleMaps = ({ onClose, inspectionId }) => {
  const [location, setLocation] = useState(null); // State to hold location data

  // Function to fetch the shop location based on the inspection ID
  const fetchLocation = async () => {
    try {
      const response = await fetch(
        `http://localhost:5001/api/inspectionShop/shop-location/${inspectionId}`
      );
      if (response.ok) {
        const data = await response.json();
        if (data.length > 0) {
          setLocation(data[0]); // Set the first location
        } else {
          console.error("No location data found");
        }
      } else {
        console.error("Failed to fetch location");
      }
    } catch (error) {
      console.error("Error:", error);
    }
  };

  useEffect(() => {
    fetchLocation(); // Fetch location data when component mounts
  }, [inspectionId]);

  const center = location
    ? [location.latitude, location.longitude]
    : [12.9869, 77.5974]; // Default fallback coordinates

  return (
    <div>
      <div className="justify-end  flex ">
        <div className=" text-white w-20 text-center cursor-pointer  bg-red-500 ">
          <IoMdClose  onClick={onClose} />
        </div>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: "100%", height: "800px" }}
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />
        {location && (
          <Marker position={center}>
            <Popup>
              Shop Location: <br />
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default GoogleMaps;
