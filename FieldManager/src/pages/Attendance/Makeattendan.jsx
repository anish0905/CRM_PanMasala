import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';

const Makeattendan = () => {
  const userId = localStorage.getItem("fieldManager_Id");
  const [formData, setFormData] = useState({
    userId: userId,
    isPresent: false,
    loginTime: '',
    logoutTime: '',
    loginLocation: {
      latitude: '',
      longitude: ''
    },
    logoutLocation: {
      latitude: '',
      longitude: ''
    },
    photo: '',
  });

  const [currentLocation, setCurrentLocation] = useState({
    latitude: '',
    longitude: '',
    address: ''
  });
  
  const [cameraActive, setCameraActive] = useState(false);
  const videoRef = useRef(null);
  const canvasRef = useRef(null);
  const locationWatchRef = useRef(null);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.includes('loginLocation') || name.includes('logoutLocation')) {
      const [key, field] = name.split('.');
      setFormData((prev) => ({
        ...prev,
        [key]: {
          ...prev[key],
          [field]: value
        }
      }));
    } else {
      setFormData({ ...formData, [name]: value });
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    console.log(formData); // Replace with your submit logic
  };

  const startCamera = () => {
    if (navigator.mediaDevices.getUserMedia) {
      navigator.mediaDevices.getUserMedia({ video: true })
        .then((stream) => {
          videoRef.current.srcObject = stream;
          setCameraActive(true);
        })
        .catch((err) => {
          console.error("Error accessing camera:", err);
        });
    }
  };

  const capturePhoto = () => {
    if (canvasRef.current && videoRef.current) {
      const context = canvasRef.current.getContext('2d');
      context.drawImage(videoRef.current, 0, 0, canvasRef.current.width, canvasRef.current.height);
      const photoURL = canvasRef.current.toDataURL('image/png');
      setFormData((prev) => ({ ...prev, photo: photoURL }));
      stopCamera();
    }
  };

  const stopCamera = () => {
    if (videoRef.current && videoRef.current.srcObject) {
      const stream = videoRef.current.srcObject;
      const tracks = stream.getTracks();
      tracks.forEach(track => track.stop());
      setCameraActive(false);
    }
  };

  const getLocation = () => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition((position) => {
        const { latitude, longitude } = position.coords;
        setFormData((prev) => ({
          ...prev,
          loginLocation: { latitude, longitude },
          loginTime: new Date().toLocaleString(),  // Set the login time to the current date and time
        }));

        // Fetch the address using the location
        axios.get(
          `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`
        )
        .then(response => {
          const address = response.data.results[0]?.formatted || "Unknown Address";
          setCurrentLocation({ latitude, longitude, address });
        })
        .catch(error => {
          console.error("Error fetching address:", error);
        });
      });
    }
  };

  useEffect(() => {
    getLocation();

    return () => {
      if (locationWatchRef.current) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
      }
    };
  }, []);

  return (
    <div className="max-w-3xl mx-auto p-6 bg-white shadow-lg rounded-md">
      <h2 className="text-xl font-semibold mb-4">Attendance Form</h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        
        <div>
          <label className="block text-sm font-medium mb-1" htmlFor="photo">Photo</label>
          <div className="flex justify-center mb-4">
            {cameraActive ? (
              <div>
                <video ref={videoRef} autoPlay width="320" height="240" />
                <button
                  type="button"
                  onClick={capturePhoto}
                  className="mt-2 w-full bg-blue-600 text-white py-2 rounded-md"
                >
                  Capture Photo
                </button>
              </div>
            ) : (
              <button
                type="button"
                onClick={startCamera}
                className="w-full bg-blue-600 text-white py-2 rounded-md"
              >
                Start Camera
              </button>
            )}
            <canvas ref={canvasRef} width="320" height="240" style={{ display: 'none' }} />
          </div>
          {formData.photo && (
            <div className="mt-4">
              <img src={formData.photo} alt="Captured" className="rounded-md shadow-lg" />
            </div>
          )}
        </div>

        <button
          type="submit"
          className="w-full bg-blue-600 text-white py-2 rounded-md hover:bg-blue-700 focus:ring focus:ring-blue-200"
        >
          Submit Attendance
        </button>
      </form>
    </div>
  );
};

export default Makeattendan;
