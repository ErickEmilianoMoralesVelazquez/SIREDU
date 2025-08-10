import React, { createContext, useContext } from 'react';
import { useToast as useToastHook } from '../hooks/useToast.js';

const ToastContext = createContext();

export const ToastProvider = ({ children }) => {
  const toast = useToastHook();
  return (
    <ToastContext.Provider value={toast}>
      {children}
    </ToastContext.Provider>
  );
};

export const useToast = () => {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast debe usarse dentro de ToastProvider');
  }
  return context;
};
