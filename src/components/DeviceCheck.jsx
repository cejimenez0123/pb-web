import React, { useEffect, useState } from 'react';
import { isPlatform } from '@ionic/react';

const DeviceCheck = () => {
  const [deviceType, setDeviceType] = useState('desktop');
const [capacitor,setCap]=useState("desktop")
  useEffect(() => {
    const userAgent = window.navigator.userAgent || window.navigator.vendor || (window).opera;

    const isCapacitor = isPlatform('capacitor'); // If it's running in a native app
    const isMobileWeb = isPlatform('mobileweb'); // If it's in a mobile browser
    setCap(isCapacitor)
    if (!isCapacitor) {
      // In browser, not in the full native app
      if (/android/i.test(userAgent)) {
        setDeviceType('android');
      } else if (/iPad|iPhone|iPod/.test(userAgent) && !window.MSStream) {
        setDeviceType('iphone');
      } else {
        setDeviceType('desktop');
      }
    }
  }, []);

  return capacitor
};

export default DeviceCheck;