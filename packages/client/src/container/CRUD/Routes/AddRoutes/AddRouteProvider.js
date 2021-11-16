import React from 'react';
import { isEmpty, uniqBy, last } from 'lodash';
import { FormProvider, useForm } from 'react-hook-form';
import { shallowEqual, useSelector } from 'react-redux';
import { createNodeRoute, updateNodeRoute } from '../../../../api/routes';
import { ROUTE_GENERATE_TYPE, ROUTE_VALIDATION_MESSAGE } from '../../../../constant/routes';
import useToastNotifications from '../../../hooks/useToastNotifications';
import { useRoute } from '../RouteProvider';
import { useAddToggle } from '../AddToggleProvider';

export const AddRouteTabContext = React.createContext();

export const RouteTabIndexName = {
  [ROUTE_GENERATE_TYPE.MANUAL]: {
    0: 'Basic',
    1: 'Advance',
    2: 'Configuration',
    3: 'Query builder',
  },
  [ROUTE_GENERATE_TYPE.AUTO]: {
    get: {
      '{{id}}': {
        0: 'Query builder',
        1: 'Model permission',
      },
      default: {
        0: 'Model permission',
      },
    },
    post: {
      list: {
        0: 'Query builder',
        1: 'Model permission',
      },
      default: {
        0: 'Model permission',
      },
    },
    put: {
      '{{}}': {
        0: 'Query builder',
        1: 'Model permission',
      },
      '{{id}}': {
        0: 'Query builder',
        1: 'Model permission',
      },
      updateBulk: {
        0: 'Query builder',
        1: 'Model permission',
      },
      default: {
        0: 'Model permission',
      },
    },
    delete: {
      '{{id}}': {
        0: 'Query builder',
        1: 'Model permission',
      },
      default: {
        0: 'Query builder',
        1: 'Model permission',
      },
    },
  },
};

const TabWiseFields = {
  0: { requiredFiled: ['platform', 'method', 'route', 'controller', 'action'], notRequiredFiled: ['groupName', 'description'] },
  1: { requiredFiled: [], notRequiredFiled: ['headers', 'policies'] },
  2: { requiredFiled: [], notRequiredFiled: ['queryBuilder'] },
};

const AddRouteTabProvider = ({ children }) => {
  const methods = useForm({ shouldUnregister: false, mode: 'all' });
  const { handleSubmit, getValues, errors } = methods;

  const { addErrorToast, addSuccessToast } = useToastNotifications();

  const {
    editRouteData, dispatch, selectedModelId, generalizedModel,
  } = useRoute();
  const { hideAddModal } = useAddToggle();

  const [updateId, setUpdateId] = React.useState('');
  const [tabIndex, setTabIndex] = React.useState(0);
  const loadingCallBackRef = React.useRef(() => { });

  const { currentApplicationId, currentApplicationCode, modelList } = useSelector(({ models, projects }) => ({
    currentApplicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
    modelList: models.modelList,
  }), shallowEqual);

  // If any fields gets added then add it to TabWiseFields
  const findErrorTabIndex = (data = getValues()) => {
    const tabError = [];
    if ([1, 2, 3].includes(tabIndex)) {
      Object.keys(TabWiseFields).forEach((tb) => TabWiseFields[tb].requiredFiled.forEach((filed) => {
        if (isEmpty(data[filed]) && !tabError.includes(tb)) {
          tabError.push(tb);
        }
      }));
    }
    if (!isEmpty(tabError)) {
      // const tabName = tabError.map((tab) => RouteTabIndexName[tab]).toString();
      setTabIndex(Math.min(tabError));
      addErrorToast(ROUTE_VALIDATION_MESSAGE.tabValidation);
      return false;
    }
    return true;
  };

  const handleSave = (data) => {
    const requestData = {
      ...data,
    };

    loadingCallBackRef.current({ isLoading: true });

    const uploadData = requestData.uploads ?? { isSingle: true, storage: 'local' };

    const apiRequest = {
      applicationId: currentApplicationId,
      type: ROUTE_GENERATE_TYPE.MANUAL,
      ...editRouteData,
      ...requestData,
      definitionType: currentApplicationCode,
      fileUpload: { uploads: [{ ...uploadData }] },
      uploads: undefined,
      queryBuilder: requestData?.queryBuilder?.map((query) => (
        // eslint-disable-next-line no-nested-ternary
        { ...query, filterJson: query?.filter ? query.filterJson : undefined, filter: query?.filter ? (typeof query?.filter === typeof 'string' ? JSON.parse(query?.filter) : query?.filter) : undefined })),
      ...(requestData.modelId && { groupName: modelList?.find((model) => model?._id === data?.modelId)?.name }),
      headers: !isEmpty(requestData?.headers) ? uniqBy(requestData?.headers, 'key')?.filter((header) => header?.key && header?.value) : [{ key: '', value: '' }],
    };

    if (isEmpty(data)) return;

    if ((apiRequest?.type === ROUTE_GENERATE_TYPE.AUTO) || (apiRequest?.type === ROUTE_GENERATE_TYPE.MANUAL && findErrorTabIndex())) {
      const apiCall = editRouteData?._id || updateId ? updateNodeRoute(editRouteData._id || updateId, apiRequest) : createNodeRoute(apiRequest);
      apiCall.then((response) => {
        addSuccessToast(response.message);

        if (selectedModelId !== generalizedModel?._id) {
          (selectedModelId === response?.data?.modelId) && dispatch({ type: editRouteData?._id || updateId ? 'EditRoute' : 'AddRoute', payload: response.data });
          (selectedModelId !== response?.data?.modelId) && dispatch({ type: 'DeleteRoute', payload: response.data });
        } else {
          (response?.data?.modelId === null) ? dispatch({ type: editRouteData?._id || updateId ? 'EditRoute' : 'AddRoute', payload: response.data }) : dispatch({ type: 'DeleteRoute', payload: response.data });
        }

        setUpdateId(response.data?._id); // For Calling second panel edit api

        // dispatch({ type: 'SetEditRouteData', payload: response.data });
        // setTabIndex((prevIndex) => (prevIndex !== 2 ? prevIndex + 1 : 0));

        if (tabIndex !== Object.keys(RouteTabIndexName[editRouteData?.type ?? ROUTE_GENERATE_TYPE.MANUAL]).length - 1) setTabIndex((prevIndex) => (prevIndex + 1));

        loadingCallBackRef.current({ isLoading: false });

        if (tabIndex === (Object.values(((editRouteData?.type ?? ROUTE_GENERATE_TYPE.MANUAL) === ROUTE_GENERATE_TYPE.MANUAL) ? (RouteTabIndexName[editRouteData?.type ?? ROUTE_GENERATE_TYPE.MANUAL]) : (RouteTabIndexName[editRouteData?.type][editRouteData?.method][['{{id}}', 'list', '{{}}', 'updateBulk'].includes(last(editRouteData?.route?.split('/'))) ? last(editRouteData?.route?.split('/')) : 'default']))?.length - 1)) hideAddModal();
      }).catch((error) => {
        addErrorToast(error); loadingCallBackRef.current({ isLoading: false, isFailed: true });
      });
      return;
    }
    loadingCallBackRef.current({ isLoading: false, isFailed: true });
  };

  const value = {
    handleSave: !isEmpty(errors) ? findErrorTabIndex : handleSubmit(handleSave),
    setTabIndex: (index) => { setTabIndex(index); },
    loadingCallBack: (loadingFn) => { loadingCallBackRef.current = loadingFn; },
    findErrorTabIndex,
    tabIndex,
    resetData: () => { setUpdateId(''); },
  };

  return (
    <FormProvider
      // eslint-disable-next-line react/jsx-props-no-spreading
      {...methods}
    >
      <AddRouteTabContext.Provider value={value}>{children}</AddRouteTabContext.Provider>
    </FormProvider>
  );
};

function useAddRoute() {
  const context = React.useContext(AddRouteTabContext);
  if (context === undefined) {
    throw new Error('useAddRoute must be used within a AddRouteTabProvider');
  }
  return context;
}

export { AddRouteTabProvider, useAddRoute };
