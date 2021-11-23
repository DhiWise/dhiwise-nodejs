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
          width="100%"
          height="350px"
          // viewBox="0 0 100% 350px"
          backgroundColor="var(--color-gray-200)"
          foregroundColor="var(--color-gray-100)"
        >
          <rect x="2%" y="12" rx="3" ry="3" width="25%" height="300" />
          <rect x="30%" y="12" rx="3" ry="3" width="70%" height="300" />
        </ContentLoader>
      ))}
  </>
);

export default MyLoader;
