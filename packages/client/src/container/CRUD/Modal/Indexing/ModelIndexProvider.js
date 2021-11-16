import React from 'react';
import { cloneDeep } from 'lodash';
import { useSelector } from 'react-redux';
import { useBoolean } from '../../../../components/hooks';

export const ModelIndexContext = React.createContext();

export const MODEL_INDEX_ACTION_TYPES = {
  FETCH_LIST: 'fetchModelIndexsList',
  ADD: 'addModelIndex',
  EDIT: 'editModelIndex',
  REMOVE: 'removeModelIndex',
  EDIT_DATA: 'editModelIndexData',
  RESET_EDIT_DATA: 'resetEditModelIndexData',
};

function modelIndexReducer(state, { type, payload = {} }) {
  switch (type) {
    case MODEL_INDEX_ACTION_TYPES.FETCH_LIST: {
      // to fetch model index list
      return { ...state, modelIndexList: payload };
    }
    case MODEL_INDEX_ACTION_TYPES.ADD: {
      // to add new model index
      const { modelIndexList } = state;
      modelIndexList.unshift({ ...payload });
      return { ...state, modelIndexList };
    }
    case MODEL_INDEX_ACTION_TYPES.EDIT: {
      // to edit model index data
      const modelIndexList = state?.modelIndexList?.map((modelIndex) => {
        if (modelIndex?.name === payload?.prevName) {
          // eslint-disable-next-line no-param-reassign
          delete payload?.prevName;
          return payload;
        }
        return modelIndex;
      });
      return { ...state, modelIndexList };
    }
    case MODEL_INDEX_ACTION_TYPES.REMOVE: {
      // to remove model index from list
      return { ...state, modelIndexList: state?.modelIndexList?.filter((modelIndex) => modelIndex?.name !== payload?.name) };
    }
    case MODEL_INDEX_ACTION_TYPES.EDIT_DATA: {
      // selected model index data
      return { ...state, editModelIndexData: payload };
    }
    case MODEL_INDEX_ACTION_TYPES.RESET_EDIT_DATA: {
      // to reset selected model index data
      return { ...state, editModelIndexData: {} };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const ModelIndexProvider = ({ children }) => {
  const currentId = useSelector((state) => state.models.currentId);
  const modelList = useSelector((state) => state.models.modelList) || [];
  const currentModel = React.useMemo(() => modelList.find((model) => model._id === currentId), [currentId, modelList]);

  const [stateData, dispatch] = React.useReducer(modelIndexReducer, { modelIndexList: [], editModelIndexData: {} });
  const [modelIndexLoader, showModelIndexLoader, hideModelIndexLoader] = useBoolean(false);

  React.useEffect(() => {
    if (currentModel?.modelIndexes?.length > 0) {
      let temp = [...currentModel.modelIndexes];
      temp = temp.map((x, i) => ({ ...x, index: i, isExist: true }));
      dispatch({ type: MODEL_INDEX_ACTION_TYPES.FETCH_LIST, payload: cloneDeep(temp) });
    } else { dispatch({ type: MODEL_INDEX_ACTION_TYPES.FETCH_LIST, payload: [] }); }
  }, [currentModel?.modelIndexes]);

  const value = {
    dispatch,
    modelIndexLoader,
    showModelIndexLoader,
    hideModelIndexLoader,
    modelIndexList: stateData.modelIndexList,
    editModelIndexData: stateData.editModelIndexData,
  };

  return <ModelIndexContext.Provider value={value}>{children}</ModelIndexContext.Provider>;
};

function useModelIndex() {
  const context = React.useContext(ModelIndexContext);
  if (context === undefined) {
    throw new Error('useModelIndex must be used within a ModelIndexProvider');
  }
  return context;
}

export { ModelIndexProvider, useModelIndex };
