import React, { useState, useEffect, useRef } from "react";
import axios from "axios";
import Box from '@mui/material/Box';
import BottomNavigation from '@mui/material/BottomNavigation';
import BottomNavigationAction from '@mui/material/BottomNavigationAction';
import RestoreIcon from '@mui/icons-material/Restore';
import { VscCheckAll } from "react-icons/vsc";
import { RxLapTimer } from "react-icons/rx";
import RecentOrder from './RecentOrder';
import CompletedOrders from './CompletedOrders';
import OverdueOrders from './OverdueOrders';

const API_URL = process.env.REACT_APP_API_URL;

function Recents() {
  return <div><RecentOrder /></div>;
}

function Completed() {
  return <div><CompletedOrders /></div>;
}

function Overdue() {
  return <div><OverdueOrders /></div>;
}

export default function DeliveryBoyHomePage() {
  const [value, setValue] = React.useState(0);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [prevLocation, setPrevLocation] = useState(null);
  const loggedInUserId = localStorage.getItem("CurrentUserId");

  const locationWatchRef = useRef(null);  // Ref to keep track of geolocation watching state

  useEffect(() => {
    // A function to handle location updates
    const handleLocationChange = async (position) => {
      const { latitude, longitude } = position.coords;

      try {
        const response = await axios.get(`https://api.opencagedata.com/geocode/v1/json?key=b5ddfdc0bf0c428e8530c8aeae8ec37e&q=${latitude}+${longitude}&pretty=1&no_annotations=1`);
        const address = response.data.results[0]?.formatted || "Unknown Address";
        
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
      locationWatchRef.current = navigator.geolocation.watchPosition(handleLocationChange, (error) => {
        console.error("Error in geolocation:", error);
      });
    }

    return () => {
      // Cleanup geolocation watch on component unmount
      if (locationWatchRef.current) {
        navigator.geolocation.clearWatch(locationWatchRef.current);
      }
    };
  }, []);

  useEffect(() => {
    if (currentLocation && JSON.stringify(currentLocation) !== JSON.stringify(prevLocation)) {
      console.log("Sending location:", currentLocation);
      axios
        .post(`${API_URL}/api/location`, {
          deliveryBoysId: loggedInUserId,
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

  const getContent = (value) => {
    switch (value) {
      case 0:
        return <Recents />;
      case 1:
        return <Completed />;
      case 2:
        return <Overdue />;
      default:
        return null;
    }
  };

  return (
    <Box sx={{ position: 'fixed', left: 0, width: '100%' }}>
      <BottomNavigation
        showLabels
        value={value}
        onChange={(event, newValue) => {
          setValue(newValue);
        }}
      >
        <BottomNavigationAction label="Recents" icon={<RestoreIcon />} />
        <BottomNavigationAction label="Completed" icon={<div className='text-2xl'><VscCheckAll /></div>} />
        <BottomNavigationAction label="Overdue" icon={<RxLapTimer />} />
      </BottomNavigation>
      <Box sx={{ padding: '20px' }}>{getContent(value)}</Box>
    </Box>
  );
}
