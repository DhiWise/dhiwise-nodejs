import * as React from 'react';

const useBoolean = (status) => {
  const [boolean, setBoolean] = React.useState(status);
  const setTrue = () => setBoolean(true);
  const setFalse = () => setBoolean(false);
  const setToggle = () => {
    setBoolean((value) => !value);
  };
  return [boolean, setTrue, setFalse, setToggle];
};
export default useBoolean;
