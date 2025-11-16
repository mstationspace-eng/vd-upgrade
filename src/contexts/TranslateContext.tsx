import React, { createContext, useContext, useState } from 'react';

const TranslateContext = createContext(null);

export const TranslateProvider = ({ children }) => {
  const [language, setLanguage] = useState('en'); 

  return (
    <TranslateContext.Provider value={{ language, setLanguage }}>
      {children}
    </TranslateContext.Provider>
  );
};

export const useTranslate = () => {
  const context = useContext(TranslateContext);
  if (context === undefined) {
    throw new Error('useTranslate must be used within a TranslateProvider');
  }
  return context;
};