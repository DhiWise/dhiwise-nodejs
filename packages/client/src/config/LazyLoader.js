import Loadable from 'react-loadable';
import React from 'react';
// import Lottie from 'react-lottie';
// import animationData from './loaderdata.json';
import logoLoader from '../assets/images/gif/logo-loader.gif';

export default function LazyLoader(opts) {
  return Loadable({
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        {/* <Lottie
          options={defaultOptions}
          height={200}
          width={200}
        /> */}
        <img width="200" height="200" src={logoLoader} alt="loader" />
      </div>
    ),
    delay: 200,
    timeout: 10000,
    ...opts,
  });
}
