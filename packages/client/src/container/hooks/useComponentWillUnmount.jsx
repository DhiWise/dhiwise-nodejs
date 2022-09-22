import React from 'react';

// usage : useComponentWillUnmount(() => console.log('Component will unmount'));

const useComponentWillUnmount = (onUnmountHandler) => {
  React.useEffect(
    () => () => {
      onUnmountHandler();
    },
    [],
  );
};
export default useComponentWillUnmount;
