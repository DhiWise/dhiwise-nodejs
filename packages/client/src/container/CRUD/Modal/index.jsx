/* eslint-disable no-nested-ternary */
/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { useSelector, useDispatch } from 'react-redux';
// import Layout from '../../Shared/Layout/index';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';
import { ModelList } from './ModelList';
import Editor, { NoModelData } from './Editor';
import {
  BoxLayout, Loader, NoData, StepFooter,
} from '../../../components';
import { listModels } from '../../../redux/thunks/models';
import { ModelPanel } from '../../../constant/model';
import { ModelProvider } from './Editor/ModelProvider';
import LayoutStepUrl from '../../Shared/LayoutStepUrl';
import { StepHeader } from '../../Shared/Layout/StepHeader';
import { encryptStorage } from '../../../utils/localStorage';
import { LAYOUT_STEP_MODULE_NAME, RedirectUrl } from '../../../constant/Nodecrud';
import { useBoolean } from '../../../components/hooks';
import { useToastNotifications } from '../../hooks';
import { LibraryPreview } from './LibraryPreview';
import { LibraryProvider } from './LibraryPreview/LibraryProvider';
import { EditorProvider } from './Editor/EditorProvider';

// import { LibraryDashboard } from './LibraryPreview/LibraryDashboard';
// const Editor = React.lazy(() => new Promise((resolve) => setTimeout(() => resolve(import('./Editor')), 3000)));
const ModalFooter = ({ saveRef, loaderRef, listFetching }) => {
  // loaderRef=to setloader async and await not work in delete loader
  const history = useHistory();
  const [isLoading, , , setLoader] = useBoolean(false);
  const buttonRef = React.useRef('');
  const { addErrorToast } = useToastNotifications();
  const { modelList } = useSelector(({ models }) => ({ modelList: models.modelList, currentModel: models.currentId }));
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  React.useEffect(() => {
    if (!isLoading)buttonRef.current = 'save';
  }, [isLoading]);
  const handleSave = (buttonText) => {
    buttonRef.current = buttonText;
    if (isEmpty(modelList)) {
      addErrorToast(NoModelData);
      return;
    }
    saveRef.current?.handleSave({ isRedirect: buttonRef.current === 'next' });
  };
  React.useImperativeHandle(loaderRef, () => ({ setLoader }));
  return (
    <StepFooter
      backClick={() => {
        history.push(RedirectUrl[currentApplicationCode].model.previousUrl);
      }}
      isSaveDisable={listFetching}
      isNextDisable={listFetching}
      nextClick={() => {
        handleSave('next');
      }}
      nextLoading={buttonRef.current === 'next' && isLoading}
      saveLoading={buttonRef.current === 'save' && isLoading}
      saveClick={() => {
        handleSave('save');
      }}
      Back="Previous"
      Next="Save & Next"
      saveText="Save"
    />
  );
};
export default function Modal(props) {
  const saveRef = React.useRef();
  const loaderRef = React.useRef();

  const applicationId = useSelector(
    (state) => state.projects.currentApplicationId,
  );
  const dispatch = useDispatch();
  const currentId = useSelector((state) => state.models.currentId);
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const listFetching = useSelector((state) => state.models.listFetching);
  const [modelPanel, setPanel] = React.useState(ModelPanel.CUSTOM.name);

  React.useEffect(() => {
    dispatch(listModels({ applicationId }));
  }, []);
  React.useEffect(() => () => {
    // Remove
    // to maintain remove toggle from sidebar when crud in url
    !window.location.pathname.includes('crud') && encryptStorage.remove('sidebarToggle');
  }, []);
  const EditorWrap = () => (
    <Editor
      saveRef={saveRef}
      loaderRef={loaderRef}
      currentId={currentId}
    />
  );

  return (
    <div className="flex flex-col h-screen">
      {/* // Remove */}
      <StepHeader backTitle="Back to screen" headTitle="CRUD" link={RedirectUrl[currentApplicationCode].model.backScreenUrl} />
      <LayoutStepUrl isOpenBigLayout={false} isBuildShow moduleName={LAYOUT_STEP_MODULE_NAME[currentApplicationCode]}>
        {/* w-sidebarRight */}
        {listFetching && <Loader style={{ minHeight: '100%' }} />}
        {!listFetching && (
          <ModelProvider currentId={currentId}>
            <LibraryProvider>
              <div className="flex h-0 flex-row flex-grow">
                <ModelList
                  setPanel={setPanel}
                  modelPanel={modelPanel}
                  {...props}
                />
                <BoxLayout variant="subRight" className="sm:h-auto" style={{ width: 'calc(100% - 16rem)' }}>
                  <div className="w-full flex flex-col">
                    {!currentId && modelPanel === ModelPanel.CUSTOM.name ? (
                      <div style={{ minHeight: 'calc(100vh - 215px)' }} className="flex items-center h-full">
                        <NoData
                          title="No model found"
                        />
                      </div>
                    ) : (
                      <React.Suspense fallback={<Loader />}>
                        {modelPanel === ModelPanel.CUSTOM.name ? <EditorWrap /> : (
                          <EditorProvider>
                            <LibraryPreview setPanel={setPanel} />
                          </EditorProvider>
                        ) }
                      </React.Suspense>
                    )}
                  </div>
                </BoxLayout>
              </div>
            </LibraryProvider>
            {/* // Remove */}
            {modelPanel === ModelPanel.CUSTOM.name && <ModalFooter saveRef={saveRef} loaderRef={loaderRef} />}
          </ModelProvider>
        )}
      </LayoutStepUrl>
    </div>
  );
}
