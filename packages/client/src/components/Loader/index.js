// import Loadable from 'react-loadable';
import React from 'react';
import Lottie from 'react-lottie';
import animationData from '../../config/loaderdata.json';

export const Loader = ({ style, className }) => {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return (
    <div className={`min-h-screen flex items-center justify-center ${className}`} style={style}>
      <Lottie
        options={defaultOptions}
        height={200}
        width={200}
      />
    </div>
  );
};
