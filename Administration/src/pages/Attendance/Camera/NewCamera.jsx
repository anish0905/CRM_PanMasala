import React, { useEffect, useRef, useState } from "react";
import axios from "axios";
import "./NewCamera.css";
import { useNavigate } from "react-router-dom";

function NewCamera({ cameraType, onCapture, onClose, role }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const [cameraMode, setCameraMode] = useState('user');
  const [currentLocation, setCurrentLocation] = useState({
    latitude: "",
    longitude: "",
    address: "",
  });

  const toggleCamera = () => {
    setCameraMode(prev => prev === 'user' ? 'environment' : 'user');
  };


  const handleLocationChange = async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`
      );
      const address = response.data.results[0]?.formatted || "Unknown Address";

      setCurrentLocation({
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      console.error("Error fetching address:", error);
      setError("Failed to fetch location address.");
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      setError(null);
      
      // Stop existing stream first
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }

      try {
        const constraints = {
          video: { facingMode: cameraMode }
        };
        
        const stream = await navigator.mediaDevices.getUserMedia(constraints);
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
        }
      } catch (err) {
        setError(`Camera error: ${err.message}`);
        console.error("Camera access error:", err);
      }
    };

    startCamera();

    return () => {
      if (videoRef.current && videoRef.current.srcObject) {
        videoRef.current.srcObject.getTracks().forEach(track => track.stop());
      }
    };
  }, [cameraMode]); // Restart camera when mode changes

  // ... rest of the existing code (capturePhoto, etc) ...


  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement("canvas");
      const maxWidth = 800; // Set the maximum width for the image
      const maxHeight = 800; // Set the maximum height for the image

      // Get the original dimensions of the video feed
      let width = videoRef.current.videoWidth;
      let height = videoRef.current.videoHeight;

      // Resize the canvas while maintaining the aspect ratio
      if (width > height) {
        if (width > maxWidth) {
          height = Math.round((maxWidth / width) * height);
          width = maxWidth;
        }
      } else {
        if (height > maxHeight) {
          width = Math.round((maxHeight / height) * width);
          height = maxHeight;
        }
      }

      canvas.width = width;
      canvas.height = height;
      const context = canvas.getContext("2d");
      context.drawImage(videoRef.current, 0, 0, width, height);

      // Convert the resized image to a Base64 string with reduced quality
      const imageDataUrl = canvas.toDataURL("image/jpeg", 0.7); // Use JPEG with 70% quality for smaller size

      setLoading(true);

      const capturedData = {
        image: imageDataUrl,
        location: {
          latitude: currentLocation.latitude,
          longitude: currentLocation.longitude,
        },
      };

      setLoading(true);
      try {
        if (onCapture) {
          await onCapture(capturedData);
        }
        stopCamera();
      } catch (error) {
        setError("Failed to process capture.");
      } finally {
        setLoading(false);
      }
    }
  };

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(handleLocationChange, (err) =>
        setError(`Location error: ${err.message}`)
      );
    } else {
      setError("Geolocation is not supported by this browser.");
    }
  }, []);

  return (
    <div className="camera-container h-screen ">
  {error && <p className="error-message">{error}</p>}
  <video ref={videoRef} autoPlay playsInline className="camera-video "  />
  
  <div className="camera-controls ">
    <button
      className="toggle-camera-button"
      onClick={toggleCamera}
      title="Switch camera"
    >
      🔄
    </button>
    
    <div className="capture-button-container ">
      <button
        className="capture-button"
        onClick={capturePhoto}
        disabled={loading}
        title="Take photo"
      >
        {loading && (
          <div className="loading-spinner">
            {/* Add your spinner component or animation here */}
          </div>
        )}
      </button>
    </div>
  </div>
</div>
  );
}

export default NewCamera;
