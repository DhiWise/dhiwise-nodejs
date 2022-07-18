import React from 'react';
import { useSelector } from 'react-redux';
import { DB_CONST } from '../../../../constant/model';
import { prepareIndexing } from '../../../../constant/modelIndexing';

export const LibraryContext = React.createContext();

function selectionReducer(state, { type, payload = {} }) {
  switch (type) {
    case 'SetSelectionModel': {
      // For selected model id set
      return { ...state, selectedModel: payload };
    }
    case 'ResetSelectionModel': {
      return { ...state, selectedModel: {} };
    }
    case 'SetLibraryModelList': {
      return { ...state, libraryModelList: payload };
    }
    case 'SetIndexes': {
      return { ...state, indexes: payload };
    }
    case 'SetCheckedData': {
      return { ...state, checkedData: { ...state.checkedData, ...payload } };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const LibraryProvider = ({ children }) => {
  const [stateData, dispatch] = React.useReducer(selectionReducer, {
    checkedData: {
      schemaCheckedData: null, // to set initial Data
      indexCheckedData: null,
    },
    selectedModel: {},
    libraryModelList: [],
    indexes: [],
  });
  const dbType = useSelector((state) => DB_CONST[state.projects.applicationDatabase.databaseType]);

  React.useMemo(() => {
    if (dbType && stateData?.selectedModel?.modelIndexes) {
      dispatch({
        type: 'SetIndexes',
        payload: prepareIndexing({ modelIndexes: stateData.selectedModel.modelIndexes, dbType }),
      });
    }
  }, [dbType, stateData?.selectedModel]);
  React.useEffect(() => () => {
    dispatch({
      type: 'SetCheckedData',
      payload: {
        schemaCheckedData: null,
        indexCheckedData: null,
      },
    });
  }, [stateData.selectedModel._id]);
  const value = {
    selectedModel: stateData.selectedModel,
    libraryModelList: stateData.libraryModelList,
    indexes: stateData.indexes,
    checkedData: stateData.checkedData,
    dispatch,
  };
  return <LibraryContext.Provider value={value}>{children}</LibraryContext.Provider>;
};
function useLibrary() {
  const context = React.useContext(LibraryContext);
  if (context === undefined) {
    throw new Error('useLibrary must be used within a LibraryProvider');
  }
  return context;
}

export { LibraryProvider, useLibrary };
