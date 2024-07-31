import React, { useEffect, useState } from 'react';
import './Alert.css';

const Alert = ({ message, type, onClose }) => {
  const [showAlert, setShowAlert] = useState(false);

  useEffect(() => {
    if (message) {
      setShowAlert(true);
      const timer = setTimeout(() => {
        setShowAlert(false);
        if (onClose) {
          const hideTimer = setTimeout(() => {
            onClose();
          }, 500);
          return () => clearTimeout(hideTimer);
        }
      }, 5000);
      return () => clearTimeout(timer);
    }
  }, [message, onClose]);

  const alertClass = type === 'success' ? 'alert-success' : 'alert-error';
  const showHideClass = showAlert ? 'show' : 'hide';

  return (
    <div className={`alert ${alertClass} ${showHideClass}`}>
      <span className="alert-message">{message}</span>
    </div>
  );
};

export default Alert;
