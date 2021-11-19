import Loadable from 'react-loadable';
import React from 'react';
import Lottie from 'react-lottie';
import animationData from './loaderdata.json';

export default function LazyLoader(opts) {
  const defaultOptions = {
    loop: true,
    autoplay: true,
    animationData,
    rendererSettings: {
      preserveAspectRatio: 'xMidYMid slice',
    },
  };
  return Loadable({
    loading: () => (
      <div className="min-h-screen flex items-center justify-center">
        <Lottie
          options={defaultOptions}
          height={200}
          width={200}
        />
      </div>
    ),
    delay: 200,
    timeout: 10000,
    ...opts,
  });
}
