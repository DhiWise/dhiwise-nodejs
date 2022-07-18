import React from 'react';

const RowSuspense = ({ children }) => <React.Suspense fallback={<div>Loading...</div>}>{children}</React.Suspense>;
export default React.memo(RowSuspense);
