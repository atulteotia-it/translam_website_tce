import { useState, useCallback } from 'react';

interface AlertState {
  type: 'success' | 'error' | 'warning' | 'info';
  message: string;
}

export const useAlert = () => {
  const [alert, setAlert] = useState<AlertState | null>(null);

  const showAlert = useCallback((type: AlertState['type'], message: string) => {
    setAlert({ type, message });
  }, []);

  const hideAlert = useCallback(() => {
    setAlert(null);
  }, []);

  const handleApiResponse = useCallback((response: any) => {
    if (response.alert) {
      showAlert(response.alert.type || 'success', response.alert.message);
    }
  }, [showAlert]);

  return {
    alert,
    showAlert,
    hideAlert,
    handleApiResponse
  };
};