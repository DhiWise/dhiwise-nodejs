import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = ({ rows }) => (
  <>
    {Array(rows || 5)
      .fill('')
      .map((d) => (
        <ContentLoader
          key={d}
          speed={2}
          width="100%"
          height="80"
          // viewBox="0 0 100% 80"
          backgroundColor="var(--color-gray-200)"
          foregroundColor="var(--color-gray-100)"
        >
          <rect x="10" y="8" rx="3" ry="3" width="15%" height="6" />
          <rect x="10" y="26" rx="3" ry="3" width="15%" height="6" />

          <rect x="27%" y="8" rx="3" ry="3" width="20%" height="6" />
          <rect x="27%" y="25" rx="3" ry="3" width="20%" height="6" />

          <rect x="55%" y="8" rx="3" ry="3" width="20%" height="6" />
          <rect x="55%" y="25" rx="3" ry="3" width="20%" height="6" />

          <rect x="80%" y="8" rx="3" ry="3" width="20%" height="6" />
          <rect x="80%" y="25" rx="3" ry="3" width="20%" height="6" />
          {/* <circle cx="20" cy="20" r="20" /> */}
        </ContentLoader>
      ))}
  </>
);

export default MyLoader;
