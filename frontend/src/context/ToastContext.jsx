import React, { createContext, useContext, useState, useCallback } from 'react';
import { ToastContainer } from '../components/ui/Toast.jsx';

const ToastContext = createContext(null);

export function ToastProvider({ children }) {
  const [toasts, setToasts] = useState([]);

  const removeToast = useCallback((id) => {
    setToasts((prev) => prev.filter((t) => t.id !== id));
  }, []);

  const addToast = useCallback(({ type = 'info', title, message, duration = 4000 }) => {
    const id = Date.now().toString() + Math.random().toString(36).substring(2, 5);
    const newToast = { id, type, title, message };

    setToasts((prev) => [...prev, newToast]);

    if (duration > 0) {
      setTimeout(() => {
        removeToast(id);
      }, duration);
    }
  }, [removeToast]);

  const showSuccess = useCallback((message, title = 'Success') => {
    addToast({ type: 'success', title, message });
  }, [addToast]);

  const showError = useCallback((message, title = 'Error') => {
    addToast({ type: 'error', title, message, duration: 6000 });
  }, [addToast]);

  const showWarning = useCallback((message, title = 'Warning') => {
    addToast({ type: 'warning', title, message, duration: 5000 });
  }, [addToast]);

  const showInfo = useCallback((message, title = 'Information') => {
    addToast({ type: 'info', title, message });
  }, [addToast]);

  return (
    <ToastContext.Provider
      value={{
        addToast,
        removeToast,
        showSuccess,
        showError,
        showWarning,
        showInfo
      }}
    >
      {children}
      <ToastContainer toasts={toasts} onClose={removeToast} />
    </ToastContext.Provider>
  );
}

export function useToast() {
  const context = useContext(ToastContext);
  if (!context) {
    throw new Error('useToast must be used within a ToastProvider');
  }
  return context;
}
