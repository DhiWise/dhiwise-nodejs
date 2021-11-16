import React from 'react';

export const ResponseContext = React.createContext();

const ResponseProvider = ({ children }) => {
  const [currentResponseId, setResponseId] = React.useState(0);
  const value = {
    currentResponseId,
    setResponseId,
  };
  return <ResponseContext.Provider value={value}>{children}</ResponseContext.Provider>;
};
function useQueryResponse() {
  const context = React.useContext(ResponseContext);
  if (context === undefined) {
    throw new Error('useSmsData must be used within a SMSProvider');
  }
  return context;
}

export { ResponseProvider, useQueryResponse };
