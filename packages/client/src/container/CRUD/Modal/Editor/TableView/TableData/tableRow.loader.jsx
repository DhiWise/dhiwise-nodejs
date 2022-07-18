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
          <rect x="5%" y="0" rx="3" ry="3" width="7%" height="30" />
          <rect x="13%" y="0" rx="3" ry="3" width="7%" height="30" />
          <rect x="22%" y="0" rx="3" ry="3" width="7%" height="30" />
          <rect x="30%" y="0" rx="3" ry="3" width="7%" height="30" />

          <rect x="40%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="43%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="46%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="49%" y="0" rx="3" ry="3" width="24" height="24" />

          <rect x="52%" y="0" rx="3" ry="3" width="6.5%" height="30" />
          <rect x="60%" y="0" rx="3" ry="3" width="6.5%" height="30" />

          <rect x="68%" y="0" rx="3" ry="3" width="24" height="24" />
          <rect x="71%" y="0" rx="3" ry="3" width="24" height="24" />

          <rect x="74%" y="0" rx="3" ry="3" width="7%" height="30" />
          {/* <circle cx="20" cy="20" r="20" /> */}
        </ContentLoader>
      ))}
  </>
);

export default MyLoader;
