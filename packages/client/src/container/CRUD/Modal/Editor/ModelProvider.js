import React, { useState } from 'react';
import { flatten } from 'lodash';

export const ModelContext = React.createContext();

const ModelProvider = React.memo(({ children }) => {
  const [modelErrors, setModelErrors] = useState();
  const [modelErrCount, setModelErrCount] = useState(0);
  const [isJsonError, setIsJsonError] = useState(false);

  React.useEffect(() => {
    if (!modelErrors) return;
    const count = flatten(modelErrors.map((x) => x.error))?.length;
    setModelErrCount(count);
  }, [modelErrors]);

  const isError = React.useCallback((name) => modelErrors?.find((x) => x.modelName === name), [modelErrors]);

  const value = {
    modelErrors,
    setModelErrors,
    modelErrCount,
    setModelErrCount,
    isError,
    isJsonError,
    setIsJsonError,
  };
  return <ModelContext.Provider value={value}>{children}</ModelContext.Provider>;
});

function useModel() {
  const context = React.useContext(ModelContext);
  if (context === undefined) {
    throw new Error('useModel must be used within a ModelProvider');
  }
  return context;
}
ModelProvider.displayName = 'ModelProvider';
export { ModelProvider, useModel };
