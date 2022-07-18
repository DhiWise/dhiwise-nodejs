import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = ({ rows }) => (
  <>
    {Array(rows || 1)
      .fill('')
      .map((d) => (
        <ContentLoader
          key={d}
          speed={2}
          className="mt-5"
          width="100%"
          height="300px"
          // viewBox="0 0 100% 300px"
          backgroundColor="var(--color-gray-200)"
          foregroundColor="var(--color-gray-100)"
        >
          <rect x="10" y="8" rx="3" ry="3" width="100%" height="300px" />
          {/* <rect x="10" y="26" rx="3" ry="3" width="50%" height="6" />

          <rect x="85%" y="8" rx="3" ry="3" width="50" height="6" />
          <rect x="90%" y="8" rx="3" ry="3" width="50" height="6" />
          <rect x="95%" y="8" rx="3" ry="3" width="50" height="6" /> */}
          {/* <circle cx="20" cy="20" r="20" /> */}
        </ContentLoader>
      ))}
  </>
);

export default MyLoader;
