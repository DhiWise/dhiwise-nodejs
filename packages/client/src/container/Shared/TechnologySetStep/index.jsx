/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React from 'react';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory, useLocation } from 'react-router-dom';
import { Controller, useForm } from 'react-hook-form';
import {
  createNewApplication, redirectApplication,
} from '../../../api/project';
import {
  ContainerBox, Heading,
} from '../../../components';
import { useBoolean } from '../../../components/hooks';
import {
  APPLICATION_STEP, APPLICATION_CODE, APP_NAME_PATTERN, APP_NAME_VALIDATION_MESSAGE, APPLICATION_DASHBOARD,
} from '../../../constant/Project/applicationStep';
import { useQueryParams, useToastNotifications } from '../../hooks';

import { selectCurrentApplication } from '../../../redux/reducers/projects';
import Layout from '../Layout';
import { ApplicationStep } from './applicationForm';
import { Input } from '../../../components/Input';
import { resetBuildState, setBuildCodeState } from '../../../redux/reducers/buildCode';

const TechnologySetStep = () => {
  const history = useHistory();
  const dispatch = useDispatch();
  const { projectId, appId } = useQueryParams(['projectId', 'appId']);
  const { addErrorToast, addSuccessToast } = useToastNotifications();
  const [loading, setLoading, hideLoading] = useBoolean(false);
  const location = useLocation();
  const applicationId = useSelector(({ projects }) => (projects.currentApplicationId));

  const {
    control, errors, handleSubmit, watch, register, setValue, setError,
  } = useForm({ mode: 'onChange' });
  React.useEffect(() => {
    dispatch(resetBuildState());
    if (!location.state?.isNewApp && applicationId) {
      redirectApplication(applicationId).then((response) => {
        dispatch(setBuildCodeState({
          buildArchitecture: response.data.projectType,
          generatedId: response.data.generatedId,
        }));
        history.push('/node/dashboard');
      });
    }
  }, []);

  const createApp = (data) => {
    const values = data;
    // eslint-disable-next-line no-nested-ternary
    setLoading();
    const apiFun = createNewApplication;

    const apiReq = {
      ...values, projectId, definitionId: appId, projectDefinitionCode: APPLICATION_CODE.nodeExpress,
    };

    apiFun(apiReq).then((res) => {
      addSuccessToast('Application added successfully.');
      try {
        dispatch(
          selectCurrentApplication({
            projectId,
            applicationId: res?.data?._id,
            applicationCode: APPLICATION_CODE.nodeExpress,
            currentProject: { applications: [res.data] },
            generatedProjectData: res?.data?.generatedIdData || {},
            prevGeneratedProjectData: res?.data?.tempGeneratedIdData || {},
            statics: res?.data?.statics || {},
            generatedProjectArchitecture: res?.data?.projectType || '',
            processStep: res?.data?.processStep || '',
            generatedId: res?.data?.generatedId || '',
          }),
        );
      } catch (e) {
        console.warn('Error:', e);
      }
      history.push(APPLICATION_DASHBOARD.NODE_EXPRESS);
    }).catch((err) => {
      const errMessage = typeof err === 'string' ? err : err?.message;
      addErrorToast(errMessage);
      if (errMessage === 'Application name already exists.') {
        const nextfield = document.querySelector('input[name="name"]');
        nextfield?.focus();
        setError('name', {
          type: 'duplicate',
          message: '',
        });
      }
    })
      .finally(() => { hideLoading(); });
  };

  const handleClick = async (data) => {
    if (errors?.length > 0) {
      return;
    }
    createApp(data);
  };

  return (
    <Layout hideHeader bodyClass="flex-col h-full">
      <>
        <div className="flex px-3 py-2 bg-gray-200 justify-center relative header flex-shrink-0">
          {/* <div className="w-full"> */}
          <img
            className="absolute left-4 top-2.5 z-1 w-20"
            src="https://dxuoui1db8w1y.cloudfront.net/DhiWise-white.svg"
            alt="logo"
          />
          {/* </div> */}
          <ContainerBox className="py-0 text-center">
            <div className="full">
              <Heading className="hidden md:block" variant="h5">
                Create Node.js application
              </Heading>
            </div>
          </ContainerBox>
        </div>
        <div className="overflow-auto flex-grow relative">
          <ContainerBox className="pb-0 pt-0 h-full">
            <div className="w-full md:w-6/12 xxl:w-full m-auto flex flex-col min-h-full">
              <div className="applicationNameBox pt-5 pb-4 md:py-5 ">
                <Controller
                  key="name"
                  control={control}
                  name="name"
                  rules={{
                    required: true,
                    minLength: 1,
                    maxLength: 40,
                    validate: (value) => APP_NAME_PATTERN[APPLICATION_CODE.nodeExpress]?.test(value) && /^[a-zA-Z0-9]+/.test(value[0]),
                  }}
                  render={(controlProps) => (
                    <Input
                        // eslint-disable-next-line react/jsx-props-no-spreading
                      {...controlProps}
                      label="Application name*"
                      placeholder="Enter application name"
                      desc="Enter name of your application."
                      error={
                          errors?.name ? APP_NAME_VALIDATION_MESSAGE[APPLICATION_CODE.nodeExpress]?.name[errors?.name?.type] : ''
                        }
                    />
                  )}
                />
              </div>
              <div className="flex flex-wrap md:flex-nowwrap flex-grow w-full">

                <form onSubmit={handleSubmit(handleClick)} className="w-full">
                  <ApplicationStep
                    applicationStep={[...APPLICATION_STEP]}
                    handleClick={handleClick}
                    loading={loading}
                    projectData={APPLICATION_CODE.nodeExpress}
                    control={control}
                    errors={errors}
                    handleSubmit={handleSubmit}
                    watch={watch}
                    register={register}
                    setValue={setValue}
                    projectId={projectId}
                  />

                </form>

              </div>
            </div>
          </ContainerBox>
        </div>
      </>
    </Layout>
  );
};
export default TechnologySetStep;
