import { useState, useEffect } from 'react';
import { CheckCircle, XCircle, AlertCircle, Info, X } from 'lucide-react';

const Toast = ({
  message,
  type = 'info',
  duration = 4000,
  onClose,
  position = 'top-right',
  isVisible = true
}) => {
  const [show, setShow] = useState(isVisible);

  useEffect(() => {
    setShow(isVisible);
  }, [isVisible]);

  useEffect(() => {
    if (show && duration > 0) {
      const timer = setTimeout(() => {
        handleClose();
      }, duration);

      return () => clearTimeout(timer);
    }
  }, [show, duration]);

  const handleClose = () => {
    setShow(false);
    setTimeout(() => {
      onClose?.();
    }, 300); // Wait for animation to complete
  };

  const getIcon = () => {
    switch (type) {
      case 'success':
        return <CheckCircle className="h-5 w-5 text-green-500" />;
      case 'error':
        return <XCircle className="h-5 w-5 text-red-500" />;
      case 'warning':
        return <AlertCircle className="h-5 w-5 text-yellow-500" />;
      default:
        return <Info className="h-5 w-5 text-blue-500" />;
    }
  };

  const getBackgroundColor = () => {
    switch (type) {
      case 'success':
        return 'bg-green-50 border-green-200';
      case 'error':
        return 'bg-red-50 border-red-200';
      case 'warning':
        return 'bg-yellow-50 border-yellow-200';
      default:
        return 'bg-blue-50 border-blue-200';
    }
  };

  const getTextColor = () => {
    switch (type) {
      case 'success':
        return 'text-green-800';
      case 'error':
        return 'text-red-800';
      case 'warning':
        return 'text-yellow-800';
      default:
        return 'text-blue-800';
    }
  };

  const getPositionClasses = () => {
    switch (position) {
      case 'top-left':
        return 'top-4 left-4';
      case 'top-center':
        return 'top-4 left-1/2 transform -translate-x-1/2';
      case 'top-right':
        return 'top-4 right-4';
      case 'bottom-left':
        return 'bottom-4 left-4';
      case 'bottom-center':
        return 'bottom-4 left-1/2 transform -translate-x-1/2';
      case 'bottom-right':
        return 'bottom-4 right-4';
      default:
        return 'top-4 right-4';
    }
  };

  if (!show) return null;

  return (
    <div
      className={`
        fixed z-50 max-w-sm w-full
        ${getPositionClasses()}
        transition-all duration-300 ease-in-out
        ${show ? 'opacity-100 translate-y-0' : 'opacity-0 -translate-y-2'}
      `}
    >
      <div
        className={`
          ${getBackgroundColor()}
          ${getTextColor()}
          border rounded-lg shadow-lg p-4
          flex items-start space-x-3
        `}
      >
        <div className="flex-shrink-0">
          {getIcon()}
        </div>

        <div className="flex-1 min-w-0">
          <p className="text-sm font-medium leading-5">
            {message}
          </p>
        </div>

        <button
          onClick={handleClose}
          className={`
            flex-shrink-0 rounded-md p-1.5 focus:outline-none focus:ring-2 focus:ring-offset-2
            ${type === 'success' ? 'hover:bg-green-100 focus:ring-green-500' : ''}
            ${type === 'error' ? 'hover:bg-red-100 focus:ring-red-500' : ''}
            ${type === 'warning' ? 'hover:bg-yellow-100 focus:ring-yellow-500' : ''}
            ${type === 'info' ? 'hover:bg-blue-100 focus:ring-blue-500' : ''}
          `}
        >
          <X className="h-4 w-4" />
        </button>
      </div>
    </div>
  );
};

// Toast Container for managing multiple toasts
export const ToastContainer = ({ toasts = [], removeToast }) => {
  return (
    <div className="fixed inset-0 pointer-events-none z-50">
      {toasts.map((toast) => (
        <Toast
          key={toast.id}
          message={toast.message}
          type={toast.type}
          duration={toast.duration}
          position={toast.position}
          onClose={() => removeToast(toast.id)}
          isVisible={true}
        />
      ))}
    </div>
  );
};

export default Toast;
