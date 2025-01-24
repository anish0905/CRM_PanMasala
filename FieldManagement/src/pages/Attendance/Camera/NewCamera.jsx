import React, { useEffect, useRef, useState } from 'react';
import axios from 'axios';
import './NewCamera.css';
import { useNavigate } from 'react-router-dom';

function NewCamera({ cameraType, onCapture, onClose }) {
  const videoRef = useRef(null);
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);
  const userId = localStorage.getItem('fieldManager_Id');
  const BASE_URL = import.meta.env.VITE_API_URL;
  const navigate = useNavigate();

  const [currentLocation, setCurrentLocation] = useState({
    latitude: '',
    longitude: '',
    address: '',
  });

  const role = localStorage.getItem('role');

  const handleLocationChange = async (position) => {
    const { latitude, longitude } = position.coords;

    try {
      const response = await axios.get(
        `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`
      );
      const address = response.data.results[0]?.formatted || 'Unknown Address';

      setCurrentLocation({
        latitude,
        longitude,
        address,
      });
    } catch (error) {
      console.error('Error fetching address:', error);
      setError('Failed to fetch location address.');
    }
  };

  useEffect(() => {
    const startCamera = async () => {
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        try {
          const constraints = {
            video: {
              facingMode: cameraType === "frontend" ? "user" : "environment",
            },
          };
          const stream = await navigator.mediaDevices.getUserMedia(constraints);
          if (videoRef.current) {
            videoRef.current.srcObject = stream;
          }
        } catch (err) {
          setError(`Error accessing camera: ${err.message}`);
          console.error('Error accessing camera:', err);
        }
      } else {
        setError('getUserMedia API is not supported in this browser.');
        console.error('getUserMedia API is not supported in this browser.');
      }
    };

    startCamera();

    // Cleanup the stream when the component unmounts
    return () => {
      stopCamera();
    };
  }, [cameraType]);

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      videoRef.current.srcObject.getTracks().forEach((track) => track.stop());
    }
  };

  const capturePhoto = async () => {
    if (videoRef.current) {
      const canvas = document.createElement('canvas');
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
      const context = canvas.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, width, height);
  
      // Convert the resized image to a Base64 string with reduced quality
      const imageDataUrl = canvas.toDataURL('image/jpeg', 0.7); // Use JPEG with 70% quality for smaller size
  
      setLoading(true);
  
      const messageData = {
        user_id: userId,
        loginLocation: {
          lat: currentLocation.latitude,
          lng: currentLocation.longitude,
        },
        loginImg: imageDataUrl, // The compressed Base64 encoded image
      };
  
      try {
        const response = await axios.post(`${BASE_URL}/api/attendance/login`, messageData);
        console.log('Photo and data sent successfully:', response.data);
  
        if (onCapture) {
          onCapture(imageDataUrl);
        }
  
        stopCamera();
        if (role == "Admin") {
          navigate("/Field-Executive-Approval-Dashboard");
        } else if (role == "FieldManager") {
          navigate("/fieldManagerDashboard");
        } else {
          navigate("/");
        }
  
        if (onClose) {
          onClose();
        }
      } catch (error) {
        if (error.response) {
          console.error('Error response:', error.response.data);
        }
        console.error('Error sending data:', error.message);
        setError('Failed to send photo and data.');
      } finally {
        setLoading(false);
      }
    }
  };
  
  
  

  useEffect(() => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        handleLocationChange,
        (err) => setError(`Location error: ${err.message}`)
      );
    } else {
      setError('Geolocation is not supported by this browser.');
    }
  }, []);

  return (
    <div className="camera-container">
      {error && <p className="error-message">{error}</p>}
      <video ref={videoRef} autoPlay playsInline className="camera-video" />
      <button
        className="capture-button"
        onClick={capturePhoto}
        disabled={loading}
      >
        {loading ? 'Processing...' : 'Capture Photo'}
      </button>
    </div>
  );
}

export default NewCamera;
