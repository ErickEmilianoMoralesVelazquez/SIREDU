import { useState, useCallback } from 'react';

let toastId = 0;

export const useToast = () => {
  const [toasts, setToasts] = useState([]);

  const addToast = useCallback((message, type = 'info', options = {}) => {
    const id = ++toastId;
    const toast = {
      id,
      message,
      type,
      duration: options.duration || 4000,
      position: options.position || 'top-right',
      ...options,
    };

    setToasts((prevToasts) => [...prevToasts, toast]);

    // Auto-remove toast after duration
    if (toast.duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, toast.duration);
    }

    return id;
  }, []);

  const removeToast = useCallback((id) => {
    setToasts((prevToasts) => prevToasts.filter((toast) => toast.id !== id));
  }, []);

  const removeAllToasts = useCallback(() => {
    setToasts([]);
  }, []);

  // Utility methods for different toast types
  const showSuccess = useCallback((message, options = {}) => {
    return addToast(message, 'success', options);
  }, [addToast]);

  const showError = useCallback((message, options = {}) => {
    return addToast(message, 'error', options);
  }, [addToast]);

  const showWarning = useCallback((message, options = {}) => {
    return addToast(message, 'warning', options);
  }, [addToast]);

  const showInfo = useCallback((message, options = {}) => {
    return addToast(message, 'info', options);
  }, [addToast]);

  // Loading toast with custom handling
  const showLoading = useCallback((message, options = {}) => {
    return addToast(message, 'info', {
      duration: 0, // Don't auto-remove loading toasts
      ...options,
    });
  }, [addToast]);

  return {
    toasts,
    addToast,
    removeToast,
    removeAllToasts,
    showSuccess,
    showError,
    showWarning,
    showInfo,
    showLoading,
  };
};

// Global toast instance for use outside components
class GlobalToast {
  constructor() {
    this.listeners = [];
  }

  addListener(listener) {
    this.listeners.push(listener);
  }

  removeListener(listener) {
    this.listeners = this.listeners.filter(l => l !== listener);
  }

  notify(message, type, options) {
    this.listeners.forEach(listener => {
      listener(message, type, options);
    });
  }

  success(message, options) {
    this.notify(message, 'success', options);
  }

  error(message, options) {
    this.notify(message, 'error', options);
  }

  warning(message, options) {
    this.notify(message, 'warning', options);
  }

  info(message, options) {
    this.notify(message, 'info', options);
  }

  loading(message, options) {
    this.notify(message, 'info', { duration: 0, ...options });
  }
}

export const toast = new GlobalToast();
