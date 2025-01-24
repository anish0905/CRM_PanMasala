import React, { useState, useEffect, useRef } from "react";
import axios from "axios";

export default function FieldManagerLocation() {
  const URI = import.meta.env.VITE_API_URL;
  const [currentLocation, setCurrentLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const loggedInUserId = localStorage.getItem("fieldManager_Id");

  const locationWatchRef = useRef(null); // Ref to keep track of geolocation watching state

  useEffect(() => {
    // A function to handle location updates
    const handleLocationChange = async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await axios.get(
          `https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`
        );
        const address =
          response.data.results[0]?.formatted || "Unknown Address";

        setCurrentLocation({
          latitude,
          longitude,
          address,
        });
      } catch (error) {
        console.error("Error fetching address:", error);
      }
    };

    // Start watching location
    if (!locationWatchRef.current) {
      locationWatchRef.current = navigator.geolocation.watchPosition(
        handleLocationChange,
        (error) => {
          console.error("Error in geolocation:", error);
        }
      );
    }

    return () => {
      // Cleanup geolocation watch on component unmount
      if (locationWatchRef.current) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (
      currentLocation &&
      JSON.stringify(currentLocation) !== JSON.stringify(prevLocation)
    ) {
      console.log("Sending location:", currentLocation);
      axios
        .post(`${URI}/api/filedManagerLocation`, {
          FieldManagerId: loggedInUserId,
          longitude: currentLocation.longitude,
          latitude: currentLocation.latitude,
        })
        .then((response) => {
          console.log("Location saved:", response.data);
        })
        .catch((error) => {
          console.error("Error saving location:", error);
        });

      setPrevLocation(currentLocation);
    }
  }, [currentLocation, prevLocation, loggedInUserId]);

  return <div></div>;
}
