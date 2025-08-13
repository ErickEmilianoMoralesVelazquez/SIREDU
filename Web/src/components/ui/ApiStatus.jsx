import React, { useState, useEffect } from 'react';
import { apiService } from '../../services/api';

export default function ApiStatus() {
  const [status, setStatus] = useState('checking');
  const [error, setError] = useState(null);

  useEffect(() => {
    const checkApiStatus = async () => {
      try {
        setStatus('checking');
        setError(null);
        
        // Intentar hacer una petición simple al backend
        await apiService.get('/items/categories');
        setStatus('connected');
      } catch (err) {
        console.error('API connection error:', err);
        setStatus('error');
        setError(err.message || 'Error de conexión');
      }
    };

    checkApiStatus();
  }, []);

  if (status === 'checking') {
    return (
      <div className="fixed top-4 right-4 bg-yellow-500 text-white px-3 py-1 rounded-lg text-sm">
        Conectando...
      </div>
    );
  }

  if (status === 'error') {
    return (
      <div className="fixed top-4 right-4 bg-red-500 text-white px-3 py-1 rounded-lg text-sm">
        Error: {error}
      </div>
    );
  }

  return (
    <div className="fixed top-4 right-4 bg-green-500 text-white px-3 py-1 rounded-lg text-sm">
      API Conectada
    </div>
  );
}
