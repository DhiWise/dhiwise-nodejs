/* eslint-disable no-nested-ternary */
import * as React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { unwrapResult } from '@reduxjs/toolkit';
import { isEmpty } from 'lodash';
import { useHistory } from 'react-router';
import { AddRoutes } from './AddRoutes';
import { RoutesView } from './RouteView';
import { ModuleList } from './ModuleList';
import { BoxLayout, StepFooter } from '../../../components';
import Spinner from './RouteView/Route.loader';
import { listModels } from '../../../redux/thunks/models';
import { useBoolean } from '../../../components/hooks';
import { AddToggleProvider, useAddToggle } from './AddToggleProvider';
import { RouteProvider, useRoute } from './RouteProvider';
import { AddRouteTabProvider } from './AddRoutes/AddRouteProvider';
import LayoutStepUrl from '../../Shared/LayoutStepUrl';
import { StepHeader } from '../../Shared/Layout/StepHeader';
import { encryptStorage } from '../../../utils/localStorage';
import { LAYOUT_STEP_MODULE_NAME, RedirectUrl } from '../../../constant/Nodecrud';
import { BuildCodeStructure } from '../BuildCodeStructure';
import { getModelRoutes } from '../../../api/routes';
import { useToastNotifications } from '../../hooks';
import { codeGenerator } from '../../../redux/thunks/buildCode';

const RouteFooter = () => {
  // to hide footer in add popup
  const {
    isBuildLoading, buildArchitecture, generatedId, applicationId, currentApplicationCode, modelList,
  } = useSelector(({ models, buildCode, projects }) => ({
    buildArchitecture: buildCode.buildArchitecture,
    generatedId: buildCode.generatedId,
    applicationId: projects.currentApplicationId,
    currentApplicationCode: projects.currentApplicationCode,
    modelList: models.modelList,
    isBuildLoading: buildCode.isBuildLoading,
  }), shallowEqual);
  const history = useHistory();
  const openBuildRef = React.useRef();
  const { addModal } = useAddToggle();
  const { routeList } = useRoute();

  // to disable Create build button
  const [hasRoutes, setHasRoutes, unsetHasRoutes] = useBoolean(true);

  const { addErrorToast } = useToastNotifications();
  const dispatch = useDispatch();
  React.useEffect(() => {
    if (isEmpty(modelList)) {
      getModelRoutes({ applicationId, find: { modelId: null } }).then((routesRes) => {
        isEmpty(routesRes?.data?.list) ? unsetHasRoutes() : setHasRoutes();
      }).catch(addErrorToast);
    }
  }, [modelList, addModal, routeList]);

  return (
    !addModal && (
    <>
      <StepFooter
        backClick={() => {
          history.push(RedirectUrl[currentApplicationCode].route.previousUrl);
        }}
        nextClick={() => {
          generatedId ? dispatch(codeGenerator({ applicationId, projectType: buildArchitecture }))
            : openBuildRef.current?.handelOpen();
        }}
        Back="Previous"
        Next="Create Build"
        nextLoading={isBuildLoading}
        isNextDisable={isEmpty(modelList) ? !hasRoutes : false}
      />
      <BuildCodeStructure openBuildRef={openBuildRef} />
    </>
    )
  );
};

export default function Routes() {
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const [loader, setLoader, hideLoader] = useBoolean(false);

  const dispatch = useDispatch();
  const routesListRef = React.useRef();

  React.useEffect(() => {
    setLoader();
    dispatch(listModels({ applicationId })).then(unwrapResult)
      .finally(hideLoader);
  }, []);

  const handleSubmit = () => {
    routesListRef.current?.fetchAllModelRoutes();
  };

  React.useEffect(() => () => {
    // Remove
    // to maintain remove toggle from sidebar when crud in url
    !window.location.pathname.includes('crud') && encryptStorage.remove('sidebarToggle');
  }, []);

  return (
    <div className="flex flex-col h-screen">
      <StepHeader backTitle="Back to screen" headTitle="CRUD" link={RedirectUrl[currentApplicationCode].route.backScreenUrl} />
      <LayoutStepUrl isOpenBigLayout={false} isBuildShow moduleName={LAYOUT_STEP_MODULE_NAME[currentApplicationCode]}>

        {/* Context for  Route Selection and routeList Data Manage */}
        <RouteProvider>
          {/* Context for  Add  Route Toggle */}
          <AddToggleProvider>
            <div className="flex flex-grow h-0">

              <ModuleList />

              {loader && (
                <BoxLayout variant="subRight" className="sm:h-auto">
                  <div className="w-full">
                    <Spinner />
                  </div>
                </BoxLayout>
              )}

              {!(loader) && (

              <RoutesView
                applicationId={applicationId}
                ref={routesListRef}
              />
              )}

              {/* Context for  Add  Route Tab Provider */}
              <AddRouteTabProvider>
                <AddRoutes
                  handleSubmit={handleSubmit}
                  routesListRef={routesListRef}
                />
              </AddRouteTabProvider>

            </div>
            <RouteFooter />
          </AddToggleProvider>
        </RouteProvider>
      </LayoutStepUrl>
    </div>
  );
}
