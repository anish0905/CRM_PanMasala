import React from "react";
import { MapContainer, TileLayer, Marker, Popup } from "react-leaflet";
import "leaflet/dist/leaflet.css";
import L from "leaflet";
import CloseIcon from "@mui/icons-material/Close";

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

const ShopCaseMap = ({ setShowCaseModalOpen, selectLocation }) => {
  // Default center coordinates if no location is provided
  const defaultCenter = [12.9869, 77.5974];
  const center = selectLocation
    ? [selectLocation.latitude, selectLocation.longitude]
    : defaultCenter;

  return (
    <div className="relative w-full h-full bg-white rounded-md shadow-lg">
      {/* Close button */}
      <div className="flex justify-end p-2">
        <button
          className="text-white bg-red-500 hover:bg-red-600 p-2 rounded-full"
          onClick={() => setShowCaseModalOpen(false)}
          title="Close Map"
        >
          <CloseIcon />
        </button>
      </div>

      {/* Leaflet Map */}
      <MapContainer
        center={center}
        zoom={15}
        style={{ width: "100%", height: "800px", borderRadius: "10px" }}
      >
        {/* OpenStreetMap tile layer */}
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a> contributors'
        />

        {/* Marker for the selected location */}
        {selectLocation && (
          <Marker position={center}>
            <Popup>
              <div>
                <strong>Shop Location:</strong>
                <br />
                Latitude: {selectLocation.latitude}
                <br />
                Longitude: {selectLocation.longitude}
              </div>
            </Popup>
          </Marker>
        )}
      </MapContainer>
    </div>
  );
};

export default ShopCaseMap;
