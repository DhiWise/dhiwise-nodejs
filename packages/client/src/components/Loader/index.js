// import Loadable from 'react-loadable';
import React from 'react';
// import Lottie from 'react-lottie';
// import animationData from '../../config/loaderdata.json';
import logoLoader from '../../assets/images/gif/logo-loader.gif';

export const Loader = ({ style, className }) => (
  <div className={`min-h-screen flex items-center justify-center ${className}`} style={style}>
    {/* <Lottie
        options={defaultOptions}
        height={200}
        width={200}
      /> */}
    <img width="200" height="200" src={logoLoader} alt="loader" />
  </div>
);
