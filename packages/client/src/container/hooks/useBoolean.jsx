import { useState } from 'react';

const useBoolean = (status) => {
  const [boolean, setBoolean] = useState(status);
  const setTrue = () => setBoolean(true);
  const setFalse = () => setBoolean(false);
  return [boolean, setTrue, setFalse];
};
export default useBoolean;
