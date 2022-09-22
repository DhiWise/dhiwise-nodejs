import React, { useState } from 'react';
import { flatten } from 'lodash';
import { useBoolean } from '../../../../components/hooks';

export const ModelContext = React.createContext();

const ModelProvider = React.memo(({ children }) => {
  const [modelErrors, setModelErrors] = useState();
  const [modelErrCount, setModelErrCount] = useState(0);
  const [isJsonError, setIsJsonError] = useState(false);
  const [isChangeInTable, setChangeInTable, setNoChangeInTable] = useBoolean(false);
  const changeNextEvent = React.useRef();
  const [isSaveWarning, setSaveWarning, hideSaveWarning] = useBoolean(false);

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
    setChangeInTable,
    setNoChangeInTable,
    isChangeInTable,
    setChangeNextEvent: (event) => {
      changeNextEvent.current = event;
    },
    changeNextEvent, // when model some changes and do next event for store that
    hideSaveWarning,
    setSaveWarning,
    isSaveWarning,
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
