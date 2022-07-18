import React from 'react';
import { shallowEqual, useDispatch, useSelector } from 'react-redux';
import { Icons } from '@dhiwise/icons';
import Lottie from 'react-lottie';
import {
  Button, DropdownMenu, Select, MenuBox, ConfirmationAlert,
} from '../../../../components';
import { BUILD_ARCHITECTURE_CODE } from '../../../../constant/buildProcessConstant';
import { setBuildCodeState } from '../../../../redux/reducers/buildCode';
import { codeGenerator } from '../../../../redux/thunks/buildCode';
import { useBoolean } from '../../../../components/hooks';
import { apiClient, API_URLS } from '../../../../api';
import animationData from './animation.json';
import { useToastNotifications } from '../../../hooks';

const defaultOptions = {
  loop: true,
  autoplay: true,
  animationData,
  rendererSettings: {
    preserveAspectRatio: 'xMidYMid slice',
  },
};
export const BuildVSCodePopup = () => {
  // To Ask openWithVs code or not
  const {
    buildError, isOpenVsCode, generatedId, applicationName, codeGeneratedPath,
  } = useSelector((
    { buildCode, projects },
  ) => ({
    buildError: buildCode.buildError,
    isOpenVsCode: buildCode.vsCodePopup,
    generatedId: buildCode.generatedId,
    applicationName: projects.currentProjectDetail.applicationList.find((app) => app._id === projects.currentApplicationId)?.name,
    codeGeneratedPath: buildCode.codeGeneratedPath,
  }), shallowEqual);

  const { addErrorToast } = useToastNotifications();
  const dispatch = useDispatch();
  const [vsCodeLoader, setVsCodeLoader, hideVsCodeLoader] = useBoolean(false);
  const openInVsCode = () => {
    setVsCodeLoader();
    apiClient(API_URLS.application.openVsCode, { generatedId, name: applicationName }).then(() => {
      hideVsCodeLoader();
      dispatch(setBuildCodeState({ vsCodePopup: !isOpenVsCode }));
    }).catch((e) => {
      addErrorToast(e);
      hideVsCodeLoader();
      dispatch(setBuildCodeState({ vsCodePopup: !isOpenVsCode }));
    });
  };
  return (
    <ConfirmationAlert
      okText={false}
      isOpen={isOpenVsCode}
      closeModal={() => {
        dispatch(setBuildCodeState({ vsCodePopup: !isOpenVsCode }));
      }}
      titleVariant="h4"
      size="w-6/12 xxl:w-4/12"
      // eslint-disable-next-line react/jsx-props-no-spreading
      {... (codeGeneratedPath && {
        shortDesc:
  <div>
    <span>
      Access the generated code from the following path:
      <br />
      <b>
        packages/server
        {codeGeneratedPath}
      </b>
    </span>
    <span> if you do not have VS code installed.</span>
  </div>,
      })}
      title={buildError ? 'Error found while building your application' : 'Your application is successfully build'}
    >
      {buildError

        ? <div className="text-error mt-3">{buildError}</div>
        : (
          <Button
            autoFocus
            onClick={openInVsCode}
            className="w-48 mt-5"
            variant="primary"
            shape="rounded"
            loading={vsCodeLoader}
          >
            Open with VS code
          </Button>
        )}
    </ConfirmationAlert>
  );
};
const options = [
  {
    name: 'MVC',
    id: BUILD_ARCHITECTURE_CODE.MVC,
  },
  {
    name: 'Clean Code',
    id: BUILD_ARCHITECTURE_CODE.CC,
  },
];

export const BuildAppDropdown = () => {
  const { isBuildLoading, buildArchitecture, generatedId } = useSelector(({ buildCode }) => ({
    isBuildLoading: buildCode.isBuildLoading,
    buildArchitecture: buildCode.buildArchitecture,
    generatedId: buildCode.generatedId,

  }), shallowEqual);
  const [architectureValue, setArchitectureValue] = React.useState(buildArchitecture);
  const dispatch = useDispatch();

  const onChange = (val) => {
    setArchitectureValue(val);
    dispatch(setBuildCodeState({ buildArchitecture: val }));
  };
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const [isBuild, setBuild, hideBuild] = useBoolean(false);

  return (
    <>

      <DropdownMenu
        dropdownMenu="w-auto"
        position="right"
        placeholder={() => (
          <div className="flex items-center h-full bg-primary-dark hover:bg-primary-dark">
            <MenuBox
              title="Build app"
              menuClass="bg-primary-dark hover:bg-primary-dark h-full border-l border-gray-200"
              isDropdown={false}
              isIcon
              textCss="text-defaultWhite"
              icon={<Icons.Project color="#ffffff" />}
            />
            {isBuildLoading && (
              <>
                <Lottie
                  options={defaultOptions}
                  height={20}
                  width={30}
                />
              </>
            )}
          </div>
        )}
        isChildren
        triggerType="component"
        trigger="buildApp"
        wrapClass="buildDropdown"
      >
        <div className="mb-3">
          <Select
            disabled={!!generatedId || isBuildLoading}
            label="Code architecture"
            options={options}
            value={architectureValue}
            onChange={onChange}
            defaultValue="MVC"
            isClearable={false}
          />
        </div>
        <Button
          loading={isBuildLoading}
          onClick={() => {
            if (generatedId) {
              setBuild();
              return;
            }
            dispatch(codeGenerator({ applicationId, projectType: architectureValue }));
          }}
          className="w-full"
          variant="primary"
          shape="rounded"
        >
          Build app
        </Button>

      </DropdownMenu>
      <BuildVSCodePopup />
      <ConfirmationAlert
        isOpen={isBuild}
        description="Building a new application will permanently delete your old build application."
        okText="Build app"
        variant="primary"
        handleSubmit={() => {
          hideBuild();
          dispatch(codeGenerator({ applicationId, projectType: architectureValue }));
        }}
        handleClose={hideBuild}
      />

    </>
  );
};
