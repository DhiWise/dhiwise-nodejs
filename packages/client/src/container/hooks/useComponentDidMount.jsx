import React from 'react';
// usage: useComponentDidMount(() => console.log('Component did mount'));
const useComponentDidMount = (onMountHandler) => {
  React.useEffect(() => {
    onMountHandler();
  }, []);
};
export default useComponentDidMount;
