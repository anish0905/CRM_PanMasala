import React, { useEffect, useState } from 'react';

const GetMobileInfo = () => {
  const [deviceInfo, setDeviceInfo] = useState({});

  useEffect(() => {
    const getDeviceInfo = () => {
      const info = {
        userAgent: navigator.userAgent,
        platform: navigator.platform,
        language: navigator.language,
        screenWidth: window.screen.width,
        screenHeight: window.screen.height,
        windowWidth: window.innerWidth,
        windowHeight: window.innerHeight,
      };
      setDeviceInfo(info);
    };

    getDeviceInfo();
    window.addEventListener('resize', getDeviceInfo);

    return () => {
      window.removeEventListener('resize', getDeviceInfo);
    };
  }, []);

  return (
    <div>
      <h1>Device Info</h1>
      <pre>{JSON.stringify(deviceInfo, null, 2)}</pre>
    </div>
  );
};

export default GetMobileInfo;
