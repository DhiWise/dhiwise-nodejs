import React from 'react';

export const RouteContext = React.createContext();

function selectionReducer(state, { type, payload = {} }) {
  switch (type) {
    case 'SetGeneralizedModel': {
      // Set generalized model data
      return { ...state, generalizedModel: payload };
    }
    case 'SetSelectionModel': {
      // For selected model id set
      return { ...state, selectedModelId: payload?._id };
    }
    case 'SetEditRouteData': {
      // For selected Route EditData
      return { ...state, editRouteData: payload };
    }
    case 'ResetEditRouteData': {
      return { ...state, editRouteData: {} };
    }
    case 'SetRouteList': {
      // Set routeList
      return { ...state, routeList: payload };
    }
    case 'AddRoute': {
      // Add new Route List
      const { routeList } = state;
      routeList.unshift({ ...payload });
      return { ...state, routeList };
    }
    case 'EditRoute': {
      // Edit new Route List
      const routeList = state.routeList.map((route) => {
        if (route._id === payload._id) {
          return payload;
        }
        return route;
      });
      return { ...state, routeList };
    }

    case 'DeleteRoute': {
      return { ...state, routeList: state.routeList.filter((route) => route._id !== payload._id) };
    }
    default: {
      throw new Error(`Unhandled action type: ${type}`);
    }
  }
}

const RouteProvider = ({ children }) => {
  const [stateData, dispatch] = React.useReducer(selectionReducer, {
    selectedModelId: '', editRouteData: '', routeList: [], generalizedModel: {},
  });
  const value = {
    generalizedModel: stateData.generalizedModel,
    selectedModelId: stateData.selectedModelId,
    editRouteData: stateData.editRouteData,
    routeList: stateData.routeList,
    dispatch,
  };
  return <RouteContext.Provider value={value}>{children}</RouteContext.Provider>;
};
function useRoute() {
  const context = React.useContext(RouteContext);
  if (context === undefined) {
    throw new Error('useRoute must be used within a RouteProvider');
  }
  return context;
}

export { RouteProvider, useRoute };
