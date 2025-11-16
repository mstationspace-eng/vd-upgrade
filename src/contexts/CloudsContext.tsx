import React, { createContext, useContext, useState } from 'react';

const CloudsContext = createContext(null);

export const CloudsProvider = ({ children }) => {
  const [showClouds, setShowClouds] = useState(false); 
  
  const toggleClouds = () => {
    setShowClouds(prevShowClouds => !prevShowClouds);
  };

  return (
    <CloudsContext.Provider value={{ showClouds, toggleClouds }}>
      {children}
    </CloudsContext.Provider>
  );
};

export const useClouds = () => {
  const context = useContext(CloudsContext);
  if (context === undefined) {
    throw new Error('useClouds must be used within a CloudsProvider');
  }
  return context;
};