import React from 'react';
import { MapContainer, TileLayer, Marker, Popup } from 'react-leaflet';
import { IoCloseSharp } from "react-icons/io5";

export const Location = ({ onClose, location }) => {
  // Check if latitude and longitude are valid
  const isValidLocation = location && location.latitude !== null && location.longitude !== null;

  // If valid location, use the provided coordinates, otherwise use a default center (e.g., London)
  const center = isValidLocation ? [location.latitude, location.longitude] : [51.505, -0.09];

  return (
    <div>
      <div className="justify-end flex">
        <div className="text-white w-10 rounded-lg text-center cursor-pointer bg-red-500">
          <IoCloseSharp onClick={onClose} className='text-4xl' />
        </div>
      </div>

      {/* Conditionally render the map only if valid location data exists */}
      {isValidLocation ? (
        <MapContainer center={center} zoom={15} style={{ width: '100%', height: '800px' }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={center}>
            <Popup>
              Shop Location: <br />
              Latitude: {location.latitude}, Longitude: {location.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div>Location data is not available.</div> // Fallback message when location data is invalid
      )}
    </div>
  );
};
