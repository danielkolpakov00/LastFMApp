import React, { useRef, useState, useEffect } from "react";
import BlueScreen from "./BlueScreen";

const Navbar = ({ openWindows }) => {
  const navbarRef = useRef();
  const [cpuUsage, setCpuUsage] = useState(4);
  const [ramUsage, setRamUsage] = useState(256);
  const [statusColor, setStatusColor] = useState('#00ff00');
  const [textSize, setTextSize] = useState('12px');
  const [showBSOD, setShowBSOD] = useState(false);
  const [clickCount, setClickCount] = useState(0);

  useEffect(() => {
    let clickTimes = [];
    
    const handleClick = () => {
      const now = Date.now();
      clickTimes.push(now);
      
      // Only keep clicks from the last second
      clickTimes = clickTimes.filter(time => now - time < 600);
      
      if (clickTimes.length >= 5) {
        setShowBSOD(true);
        clickTimes = [];
      }
    };

    window.addEventListener('click', handleClick);
    return () => window.removeEventListener('click', handleClick);
  }, []);

  useEffect(() => {
    const getResourceUsage = () => {
      // Count open windows
      const windowCount = Object.values(openWindows).filter(Boolean).length;
      
      // Base CPU usage: 1-15% for one window
      // Add 5-20% per additional window
      const baseCpu = Math.floor(Math.random() * 15) + 1;
      const additionalCpu = windowCount > 1 ? 
        (windowCount - 1) * (Math.floor(Math.random() * 40) + 5) : 0;
      const totalCpu = Math.min(baseCpu + additionalCpu, 100);

      // Base RAM: 256-384MB for one window
      // Add 64-128MB per additional window
      const baseRam = Math.floor(Math.random() * (384 - 256 + 1)) + 256;
      const additionalRam = windowCount > 1 ?
        (windowCount - 1) * (Math.floor(Math.random() * 128) + 128) : 0;
      const totalRam = Math.min(baseRam + additionalRam, 512);

      setCpuUsage(totalCpu);
      setRamUsage(totalRam);

      // More aggressive flickering
      if (Math.random() < 0.8) {  // 80% chance of flicker
        setStatusColor('#ff0000');
        setTimeout(() => {
          setStatusColor('#00ff00');
        }, Math.random() * 50 + 10);  // flicker duration between 10-60ms
      }
    };

    // Much more frequent checks
    const statsInterval = setInterval(getResourceUsage, 300); // changed from 1000

    return () => clearInterval(statsInterval);
  }, [openWindows]);

  // Add responsive text sizing
  const updateTextSize = () => {
    const width = window.innerWidth;
    if (width < 768) {
      return '4px';  // Mobile
    } else if (width < 1024) {
      return '11px';  // Tablet
    }
    return '12px';    // Desktop
  };

  // Handle window resize
  useEffect(() => {
    const handleResize = () => {
      setTextSize(updateTextSize());
    };

    // Set initial size
    handleResize();

    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  if (showBSOD) {
    return <BlueScreen />;
  }

  return (
    <nav
      ref={navbarRef}
      style={{
        background: '#000080',
        color: '#ffffff',
        padding: window.innerWidth < 768 ? '0 4px' : '0 8px',
        fontFamily: 'Consolas, monospace',
        fontSize: textSize,
        display: 'flex',
        justifyContent: 'space-between',
        alignItems: 'center',
        letterSpacing: '0.5px',
        position: 'relative',
        zIndex: 99999  // Added very high z-index to stay on top
      }}
    >
      <div style={{ display: 'flex', alignItems: 'center', gap: '12px' }}>
        <span>[DEVELOPMENT BUILD]</span>
        <span>windows_xp_build_08_24_2001.iso</span>
        <span style={{ 
          color: statusColor,
          transition: 'color 0.1s ease',
        }}>●</span>
        <span>VIRTUAL_MACHINE_01</span>
      </div>
      <div style={{ display: 'flex', gap: '16px' }}>
        <span>CPU: {cpuUsage}%</span>
        <span>RAM: {ramUsage}MB/512MB</span>
        <span>BUILD: 2600</span>
      </div>
    </nav>
  );
};

export default Navbar;
