import { useState, useEffect } from 'react';

export const useDraggableWindow = (NAVBAR_HEIGHT, TASKBAR_HEIGHT) => {
  const getWindowDimensions = () => {
    const width = window.innerWidth;
    const height = window.innerHeight;

    if (width < 768) {
      return {
        width: width * 0.95,
        height: height * 0.7,
        initialX: width * 0.025,
        initialY: NAVBAR_HEIGHT + 10
      };
    }
    if (width < 1024) {
      return {
        width: width * 0.85,
        height: height * 0.75,
        initialX: width * 0.075,
        initialY: NAVBAR_HEIGHT + 20
      };
    }
    return {
      width: Math.min(1024, width * 0.8),
      height: Math.min(768, height - NAVBAR_HEIGHT - TASKBAR_HEIGHT - 40),
      initialX: (width - Math.min(1024, width * 0.8)) / 2,
      initialY: NAVBAR_HEIGHT + 20
    };
  };

  const [position, setPosition] = useState(() => ({
    x: getWindowDimensions().initialX,
    y: getWindowDimensions().initialY
  }));

  const [isDragging, setIsDragging] = useState(false);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [isResizing, setIsResizing] = useState(false);
  const [resizeEdge, setResizeEdge] = useState(null);
  const [windowSize, setWindowSize] = useState(() => ({
    width: getWindowDimensions().width,
    height: getWindowDimensions().height
  }));
  const [windowState, setWindowState] = useState({
    id: 'main-window',
    isMinimized: false,
    isMaximized: false,
    isVisible: true,
    title: 'Last.fm Explorer'
  });

  const handleMouseDown = (e) => {
    if (!windowState.isMaximized) {
      setIsDragging(true);
      setDragOffset({
        x: e.clientX - position.x,
        y: e.clientY - position.y
      });
    }
  };

  const handleMouseMove = (e) => {
    if (isDragging && !isResizing && !windowState.isMaximized) {
      const newX = Math.min(
        Math.max(0, e.clientX - dragOffset.x),
        window.innerWidth - windowSize.width
      );
      const newY = Math.min(
        Math.max(NAVBAR_HEIGHT, e.clientY - dragOffset.y),
        window.innerHeight - TASKBAR_HEIGHT - windowSize.height
      );
      
      setPosition({ x: newX, y: newY });
    } else if (isResizing) {
      handleResize(e);
    }
  };

  const handleMouseUp = () => {
    setIsDragging(false);
    setIsResizing(false);
    setResizeEdge(null);
  };

  const handleResize = (e) => {
    let newWidth = windowSize.width;
    let newHeight = windowSize.height;
    let newX = position.x;
    let newY = position.y;

    switch (resizeEdge) {
      case 'right':
        newWidth = Math.max(300, e.clientX - position.x);
        break;
      case 'bottom':
        newHeight = Math.max(200, e.clientY - position.y);
        break;
      case 'bottom-right':
        newWidth = Math.max(300, e.clientX - position.x);
        newHeight = Math.max(200, e.clientY - position.y);
        break;
      case 'top-left':
        newWidth = Math.max(300, windowSize.width + (position.x - e.clientX));
        newHeight = Math.max(200, windowSize.height + (position.y - e.clientY));
        newX = e.clientX;
        newY = e.clientY;
        break;
      case 'top-right':
        newWidth = Math.max(300, e.clientX - position.x);
        newHeight = Math.max(200, windowSize.height + (position.y - e.clientY));
        newY = e.clientY;
        break;
      case 'bottom-left':
        newWidth = Math.max(300, windowSize.width + (position.x - e.clientX));
        newHeight = Math.max(200, e.clientY - position.y);
        newX = e.clientX;
        break;
    }

    setWindowSize({ width: newWidth, height: newHeight });
    setPosition({ x: newX, y: newY });
  };

  const handleResizeStart = (e, edge) => {
    e.preventDefault();
    e.stopPropagation();
    setIsResizing(true);
    setResizeEdge(edge);
  };

  const handleMinimize = () => {
    setWindowState(prev => ({ ...prev, isMinimized: true }));
  };

  const handleMaximize = () => {
    setWindowState(prev => ({ ...prev, isMaximized: !prev.isMaximized }));
  };

  const handleClose = () => {
    setWindowState(prev => ({ ...prev, isVisible: false }));
  };

  useEffect(() => {
    const handleWindowResize = () => {
      const dims = getWindowDimensions();
      if (!windowState.isMaximized) {
        setPosition({
          x: dims.initialX,
          y: dims.initialY
        });
      }
    };

    window.addEventListener('resize', handleWindowResize);
    return () => window.removeEventListener('resize', handleWindowResize);
  }, [windowState.isMaximized]);

  return {
    position,
    windowSize,
    windowState,
    isDragging,
    isResizing,
    resizeEdge,
    handleMouseDown,
    handleMouseMove,
    handleMouseUp,
    handleResizeStart,
    handleMinimize,
    handleMaximize,
    handleClose,
    setPosition,          
    getWindowDimensions,   
    setWindowState       
  };
};
