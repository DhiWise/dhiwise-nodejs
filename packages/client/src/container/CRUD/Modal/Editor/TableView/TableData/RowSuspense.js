import React from 'react';

const RowSuspense = React.memo(({ children }) => <React.Suspense fallback={<div>Loading...</div>}>{children}</React.Suspense>);
export default RowSuspense;
