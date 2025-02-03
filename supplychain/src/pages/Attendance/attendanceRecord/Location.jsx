import React, { useState, useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import CloseIcon from "@mui/icons-material/Close";
import "leaflet/dist/leaflet.css"; // Import Leaflet CSS

const Location = ({ onClose, location }) => {
  // Log location for debugging
  console.log("Received location:", location);

  // Check if latitude and longitude are valid
  const isValidLocation = location && location.latitude && location.longitude;

  // Log validity
  console.log("isValidLocation:", isValidLocation);

  // Default center (if location is invalid)
  const defaultCenter = [51.505, -0.09];

  // State to store the map center
  const [mapCenter, setMapCenter] = useState(defaultCenter);

  // Update center when location changes
  useEffect(() => {
    if (isValidLocation) {
      setMapCenter([location.latitude, location.longitude]);
    }
  }, [location]);

  return (
    <div>
      {/* Close Button */}
      <div className="flex justify-end">
        <div className="text-white w-10 h-10 flex items-center justify-center cursor-pointer bg-red-500 rounded-full">
          <CloseIcon onClick={onClose} />
        </div>
      </div>

      {/* Show map only if the location is valid */}
      {isValidLocation ? (
        <MapContainer center={mapCenter} zoom={15} style={{ width: "100%", height: "500px" }}>
          <TileLayer
            url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
            attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
          />
          <Marker position={mapCenter}>
            <Popup>
              <b>Shop Location:</b>
              <br />
              Latitude: {location.latitude}
              <br />
              Longitude: {location.longitude}
            </Popup>
          </Marker>
        </MapContainer>
      ) : (
        <div className="text-center text-red-500 font-semibold p-4">
          Location data is not available.
        </div>
      )}
    </div>
  );
};

export default Location;
