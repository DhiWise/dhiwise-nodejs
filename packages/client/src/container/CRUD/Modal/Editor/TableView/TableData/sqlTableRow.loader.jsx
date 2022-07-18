import React from 'react';
import ContentLoader from 'react-content-loader';

const MyLoader = ({ rows }) => (
  <>
    {Array(rows || 1)
      .fill('')
      .map((d) => (
        <ContentLoader
          speed={2}
          key={d}
          width="100%"
          height="50px"
          viewBox="0 0 100% 50px"
          backgroundColor="var(--color-gray-200)"
          foregroundColor="var(--color-gray-100)"
        >
          <rect x="10" y="15" rx="3" ry="3" width="4%" height="6" />
          <rect x="5%" y="0" rx="3" ry="3" width="9%" height="40" />
          <rect x="15.5%" y="0" rx="3" ry="3" width="9%" height="40" />
          <rect x="26%" y="0" rx="3" ry="3" width="9%" height="40" />
          <rect x="36%" y="0" rx="3" ry="3" width="9%" height="40" />
          <rect x="47%" y="0" rx="3" ry="3" width="9%" height="40" />
          <rect x="58.4%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="61.5%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="64.4%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="67.4%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="70.4%" y="0" rx="3" ry="3" width="24" height="24" />

          <rect x="73%" y="0" rx="3" ry="3" width="7%" height="40" />
          <rect x="81%" y="0" rx="3" ry="3" width="7%" height="40" />

          <rect x="89%" y="0" rx="3" ry="3" width="24" height="24" />

          <rect x="92%" y="0" rx="3" ry="3" width="7%" height="40" />
          {/* <circle cx="20" cy="20" r="20" /> */}
        </ContentLoader>
      ))}
  </>
);

export default MyLoader;
