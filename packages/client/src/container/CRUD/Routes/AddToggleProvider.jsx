import React from 'react';
import { useBoolean } from '../../../components/hooks';

export const AddRouteTabContext = React.createContext();

const AddToggleProvider = ({ children }) => {
  const [addModal, showAddModal, hideAddModal] = useBoolean(false);
  const [openModelCount, setOpenModelCount] = React.useState(0);

  React.useEffect(() => {
    setOpenModelCount(openModelCount + 1);
  }, [addModal]);
  const value = {
    addModal,
    showAddModal,
    hideAddModal,
    openModelCount,
  };
  return <AddRouteTabContext.Provider value={value}>{children}</AddRouteTabContext.Provider>;
};
function useAddToggle() {
  const context = React.useContext(AddRouteTabContext);
  if (context === undefined) {
    throw new Error('useSmsData must be used within a SMSProvider');
  }
  return context;
}

export { AddToggleProvider, useAddToggle };
