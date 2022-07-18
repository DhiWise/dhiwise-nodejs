import * as React from 'react';
import { useToasts } from 'react-toast-notifications';

export default function useToastNotifications() {
  const { addToast, removeAllToasts } = useToasts();

  const addSuccessToast = React.useCallback((message) => {
    if (typeof message === 'string') {
      removeAllToasts();
      addToast(message, { appearance: 'success', autoDismiss: true });
    }
  }, []);

  const addErrorToast = React.useCallback((message) => {
    if (typeof message === 'string' && message !== 'Invalid token.') {
      removeAllToasts();
      addToast(message, { appearance: 'error', autoDismiss: true });
    }
  }, []);

  return { addSuccessToast, addErrorToast };
}
