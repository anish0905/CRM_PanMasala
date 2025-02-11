import React, { useEffect, useRef, useState } from "react";
import "./NewCamera.css";
import axios from "axios";
import Swal from "sweetalert2";

function NewCamera({ cameraType, onCapture, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });

  const handleLocationChange = async (position) => {
    const { latitude, longitude } = position.coords;
    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`
      );
      const address = response.data.results[0]?.formatted || "Unknown Address";
      setCurrentLocation({ latitude, longitude, address });
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Failed to fetch location address.");
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      try {
        const constraints = {
          video: {
            facingMode: cameraType === "front" ? "user" : "environment",
          },
        };
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) videoRef.current.srcObject = stream;
      } catch (err) {
        setError(`Camera error: ${err.message}`);
      }
    };

    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationChange, (err) =>
        setError(`Location error: ${err.message}`)
      );
    }

    startCamera();
    return () => {
      if (videoRef.current?.srcObject) {
        videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
      }
    };
  }, [cameraType]);

  const capturePhoto = async () => {
    // if (!currentLocation.latitude || !currentLocation.longitude) {
    //   setError("Location not available. Please enable location services.");
    //   return;
    // }

    // setLoading(true);
    try {
      const canvas = document.createElement("canvas");
      const video = videoRef.current;

      // Maintain aspect ratio while resizing
      const aspectRatio = video.videoWidth / video.videoHeight;
      const maxSize = 800;
      const width = aspectRatio > 1 ? maxSize : maxSize * aspectRatio;
      const height = aspectRatio > 1 ? maxSize / aspectRatio : maxSize;

      canvas.width = width;
      canvas.height = height;
      canvas.getContext("2d").drawImage(video, 0, 0, width, height);

      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7);

      if (onCapture) {
        onCapture({
          image: imageDataUrl,
          location: currentLocation,
        });
      }

      if (onClose) onClose();
    } catch (err) {
      setError("Failed to capture image");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="camera-container">
      {error && <p className="error-message">{error}</p>}
      <video ref={videoRef} autoPlay playsInline className="camera-video" />
      <button
        className="capture-button"
        onClick={capturePhoto}
        disabled={loading}
      >
        {loading ? "Processing..." : "Capture"}
      </button>
    </div>
  );
}

export default NewCamera;
