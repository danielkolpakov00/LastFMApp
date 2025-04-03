import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import xpLogo from '../assets/xp.png';

const ICONS = {
  start: '/icons/start.ico',
  windows: '/icons/windows.ico',
  messenger: '/icons/messenger.ico',
  volume: '/icons/volume.ico',
  homepage: '/icons/homepage.ico',
  floppysave: '/icons/floppysave.ico',
  minesweeper: '/icons/minesweeper.ico',
  paint: '/icons/paint.ico'  // Make sure paint icon is included
};

const TaskBar = ({ 
  onStartClick, 
  isStartMenuOpen, 
  openWindows, 
  activeWindow,
  onWindowClick 
}) => {
  const navigate = useNavigate();
  const location = useLocation();
  const [currentTime, setCurrentTime] = useState(new Date());

  useEffect(() => {
    const timer = setInterval(() => {
      setCurrentTime(new Date());
    }, 1000);
    return () => clearInterval(timer);
  }, []);

  const getMobileStyles = () => {
    const isMobile = window.innerWidth <= 768;
    
    return {
      taskbar: {
        height: isMobile ? '28px' : '36px',
        padding: isMobile ? '0' : '0', // Removed horizontal padding
      },
      startButton: {
        height: isMobile ? '100%' : '100%',
        padding: isMobile ? '1px 8px' : '1px 12px',
        fontSize: isMobile ? '10px' : '11px',
      },
      startIcon: {
        width: isMobile ? '14px' : '18px',
        height: isMobile ? '13px' : '17px',
      },
      appButton: {
        height: isMobile ? '24px' : '28px',
        minWidth: isMobile ? '40px' : '160px',
        padding: isMobile ? '0 4px' : '0 10px',
        fontSize: isMobile ? '10px' : '11px',
      },
      clock: {
        padding: isMobile ? '0 8px' : '0 12px',
        fontSize: isMobile ? '10px' : '11px',
      }
    };
  };

  const styles = getMobileStyles();

  const appButton = {
    height: '28px',  // Increased from 23px
    minWidth: '160px',
    margin: '0 0px',
    padding: '0 10px', // Slightly increased padding
    border: '1px solid #0f3f95',
    borderRadius: '2px',
    fontSize: '11px',
    textAlign: 'left',
    cursor: 'pointer',
    display: 'flex',
    alignItems: 'center',
  };

const getAppStyle = (windowId) => ({
    ...appButton,
    background: activeWindow === windowId ?
        'linear-gradient(to bottom, #1c51b7 0%, #1644a7 15%, #15419e 40%, #15419e 100%)' :
        'linear-gradient(to bottom, #2584ff 0%, #2584ff 5%, #1159d5 8%, #1159d5 95%, #0b47a8 100%)',
    color: '#ffffff', // Always white text
    boxShadow: activeWindow === windowId ?
        'inset 1px 1px 0 rgba(255,255,255,0.2)' :
        'inset 1px 1px 0 rgba(255,255,255,0.1)',
    textShadow: '1px 1px 1px rgba(0,0,0,0.4)', // Always add text shadow
});

  return (
    <div style={{
      ...styles.taskbar,
      position: 'fixed',
      bottom: 0,
      left: 0,
      width: '100%',
       // Added to ensure no padding
        background: 'linear-gradient(to bottom, #2584ff 0%, #2584ff 5%, #1159d5 8%, #1159d5 95%, #0b47a8 100%)',
        display: 'flex',
        alignItems: 'center',
        zIndex: 1000,
        boxShadow: 'inset 0 1px 0 rgba(255,255,255,0.3)',
        borderTop: '1px solid #0842a0',
          }}>
        <button 
          onClick={onStartClick}
          style={{
            ...styles.startButton,
            background: 'linear-gradient(to right, #316A21 0%, #4a992d 20%, #3c8b27 80%, #316A21 100%)',
            border: '1px solid #215315',
            borderRadius: '8px 8px 8px 0', // Rounded top right and bottom right corners
          color: 'white',
          margin: '2px 0', // Removed left and right margin
          display: 'flex',
          alignItems: 'center',
          fontWeight: 'bold',
          fontFamily: 'Tahoma, sans-serif',
          cursor: 'pointer',
          boxShadow: '1px 1px 0 rgba(255,255,255,0.3) inset, -1px -1px 0 rgba(0,0,0,0.2) inset',
          textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
        }}
      >
        <img 
          src={xpLogo} 
          alt="Windows XP"
          style={{
            ...styles.startIcon,
            marginRight: '5px',
            filter: 'drop-shadow(1px 1px 1px rgba(0,0,0,0.3))',
          }}
        />
        {window.innerWidth > 768 && 'start'}
      </button>

      <div style={{ 
        display: 'flex', 
        flex: 1, 
        margin: '0 4px 0 2px', // Added left margin to create slight spacing after start button
        gap: '3px',
        overflow: 'auto',
        
      }}>
        {openWindows.explorer && (
          <button
            onClick={() => onWindowClick('explorer')}
            style={{
              ...getAppStyle('explorer'),
              ...styles.appButton,
            }}
          >
            <img 
              src={ICONS.homepage}
              alt="Last.fm Explorer"
              style={{
                width: '16px',
                height: '16px',
                marginRight: window.innerWidth > 768 ? '4px' : '0',
                opacity: activeWindow === 'explorer' ? 0.8 : 1
              }}
            />
            {window.innerWidth > 768 && 'Last.fm Explorer'}
          </button>
        )}
        
        {openWindows.minesweeper && (
          <button
            onClick={() => onWindowClick('minesweeper')}
            style={{
              ...getAppStyle('minesweeper'),
              ...styles.appButton,
            }}
          >
            <img 
              src={ICONS.minesweeper}
              alt="Minesweeper"
              style={{
                width: '16px',
                height: '16px',
                marginRight: window.innerWidth > 768 ? '4px' : '0',
                opacity: activeWindow === 'minesweeper' ? 0.8 : 1
              }}
            />
            {window.innerWidth > 768 && 'Minesweeper'}
          </button>
        )}

        {openWindows.paint && (
          <button
            onClick={() => onWindowClick('paint')}
            style={{
              ...getAppStyle('paint'),
              ...styles.appButton,
            }}
          >
            <img 
              src={ICONS.paint}
              alt="Paint"
              style={{
                width: '16px',
                height: '16px',
                marginRight: window.innerWidth > 768 ? '4px' : '0',
                opacity: activeWindow === 'paint' ? 0.8 : 1
              }}
            />
            {window.innerWidth > 768 && 'Paint'}
          </button>
        )}
      </div>

      <div style={{
        ...styles.clock,
        background: 'linear-gradient(to bottom, #2467dd 0%, #1d5bc5 100%)',
        height: '100%',
        display: 'flex',
        alignItems: 'center',
        color: 'white',
        fontFamily: 'Tahoma, sans-serif',
        borderLeft: '1px solid #1752b7',
        boxShadow: 'inset 1px 0 0 rgba(255,255,255,0.2)',
        textShadow: '1px 1px 1px rgba(0,0,0,0.4)',
      }}>
        {currentTime.toLocaleTimeString([], { 
          hour: '2-digit', 
          minute: '2-digit',
          hour12: window.innerWidth > 768
        })}
      </div>
    </div>
  );
};

export default TaskBar;
