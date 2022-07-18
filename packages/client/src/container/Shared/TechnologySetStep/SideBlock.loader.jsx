import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = () => (
  <ContentLoader
    speed={2}
    className="mt-5"
    width="100%"
    height="365"
    // viewBox="0 0 100% 100%"
    backgroundColor="var(--color-gray-200)"
    foregroundColor="var(--color-gray-100)"
    // {...props}
  >
    {/* <circle cx="20" cy="20" r="20" /> */}
    <rect x="0" y="18" rx="3" ry="3" width="100%" height="365" />
    {/* <rect x="20" y="50" rx="3" ry="3" width="1px" height="250px" /> */}
    {/* <rect x="0" y="70" rx="3" ry="3" width="90%" height="4px" />
    <rect x="0" y="80" rx="3" ry="3" width="90%" height="40px" />
    <rect x="0" y="140" rx="3" ry="3" width="90%" height="4px" />
    <rect x="0" y="150" rx="3" ry="3" width="90%" height="40px" />
    <rect x="0" y="210" rx="3" ry="3" width="90%" height="4px" />
    <rect x="0" y="220" rx="3" ry="3" width="90%" height="80px" />
    <rect x="0" y="320" rx="3" ry="3" width="250" height="42px" /> */}

    {/* <circle cx="20" cy="340" r="20" />
    <rect x="50" y="340" rx="3" ry="3" width="45px" height="6" /> */}

    {/* <circle cx="20" cy="20" r="20" /> */}
  </ContentLoader>
);

export default MyLoader;
