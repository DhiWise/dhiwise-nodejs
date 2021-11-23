/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import {
  get, isEmpty, omit, pick,
} from 'lodash';
import { useForm, Controller, FormProvider } from 'react-hook-form';
import { useSelector } from 'react-redux';
import {
  Tab, Tabs, TabList, TabPanel,
} from 'react-tabs';
import ScrollArea from 'react-scrollbar';
import { TabCSs } from '../../../assets/css/tab';
import {
  Select, Input, Checkbox, SelectTree, Button, Heading, BoxLayout, Description,
} from '../../../components';
import { getError } from '../../../utils/validationMsgs';
import { COMPONENT_TYPE, MASTER_PARENT_CODE } from '../../../constant/master';
import { fetchByCode } from '../../../api/master';
import { createApplicationConfig, updateApplicationConfig } from '../../../api/applicationConfig';
import { useBoolean } from '../../../components/hooks';
import useToastNotifications from '../../hooks/useToastNotifications';
import Spinner from './CodeGenerateConfiguration.loader';
import { UploadAttachmentSetting } from './UploadAttachmentSetting';
import {
  APPLICATION_CONFIG_TABS, DISABLED_QUERY_PARAMETER_KEYS,
} from '../../../constant/applicationConfigConstant';
import { getApplicationPlatforms } from '../../../utils/applicationPlatform';
import { defaultAttributes } from '../../../components/SelectTree';
import { DataFormatConfig } from './DataFormatConfig/index';
import {
  getMediumObject, getServiceProvideData, getSocialAuthData, prepareQueryParameters,
} from './CodeGenConfigHelperFunctions';

export const CodeGenerateConfiguration = (props) => {
  // const { userData } = useCurrentUser();
  const modelList = useSelector((state) => state.models.modelList);
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const projectDetail = useSelector((state) => state.projects.currentProjectDetail);
  const ormType = useSelector((state) => state.projects.applicationDatabase.ormType);
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const applicationLoginAccess = projectDetail?.applicationList?.find((d) => d._id === applicationId)?.configInput?.platform;

  const [isLoading, setLoading, unsetLoading] = useBoolean(false);
  const [isSubmitting, setSubmitting, unsetSubmitting] = useBoolean(false);

  const [mastersList, setMastersList] = React.useState([]); // notification master data
  const [updatedProjectId, setUpdatedProjectId] = React.useState(null);
  const [socialMastersList, setSocialMastersList] = React.useState([]); // social auth master data
  const [callMaster, setCallMaster] = React.useState(props?.fetchMasters); // to fetch notifications and social authentication masters' list based on flag
  const { addSuccessToast, addErrorToast } = useToastNotifications();

  const methods = useForm({ shouldUnregister: false, mode: 'onBlur' });
  const {
    handleSubmit, errors, control, reset, setValue, watch,
  } = methods;

  React.useEffect(() => {
    // to fetch notifications and social authentication masters' list
    const fetchData = async () => {
      try {
        setLoading();
        const notificationData = await fetchByCode({ parentCode: MASTER_PARENT_CODE.NOTIFICATION, isSub: true });
        const socialAuthData = await fetchByCode({ parentCode: MASTER_PARENT_CODE.SOCIAL_AUTH, isSub: true });
        setMastersList(notificationData?.data?.list || []);
        setSocialMastersList(socialAuthData?.data?.list || []);
        setCallMaster(false); // to fetch notifications and social authentication masters' list only on first render
        unsetLoading();
      } catch (error) {
        addErrorToast(error);
      }
    };
    if (callMaster) {
      fetchData();
    }
  }, []);

  const setInitialData = (updatedData) => {
    const projectConfig = updatedData || props?.projectConfig;
    if (projectConfig?._id) {
      setValue('authModuleId', projectConfig?.authModuleId);
      setValue('username', projectConfig?.loginWith?.username?.filter((key) => !DISABLED_QUERY_PARAMETER_KEYS.includes(key)) ?? [...Object.keys(pick(modelList?.find((model) => model?._id === watch('authModuleId'))?.schemaJson, ['username', 'email']))]); // to remove disabled query parameter keys from older applications // TODO: remove this filter condition after 2 sprints
      setValue('password', projectConfig?.loginWith?.password ?? (Object.keys(modelList?.find((model) => model?._id === watch('authModuleId'))?.schemaJson ?? {})?.includes('password') ? 'password' : ''));
      setValue('loginRetryLimitMax', projectConfig?.loginRetryLimit?.max?.toString());
      setValue('loginReActiveTime', projectConfig?.loginRetryLimit?.reActiveTime?.toString());
      setValue('rateLimitMax', projectConfig?.loginRateLimit?.max?.toString());
      setValue('rateReActiveTime', projectConfig?.loginRateLimit?.reActiveTime?.toString());
      setValue('isRestrictDevice', projectConfig?.restrictNoOfDevice ?? false);
      setValue('noOfDevice', projectConfig?.noOfDevice?.toString() || '1');
      setValue('tokenExpireTime', projectConfig?.tokenExpiryTime?.toString());
      setValue('uploadPlatform', projectConfig?.fileUpload?.uploads?.[0]?.platform);
      setValue('uploadFileType', projectConfig?.fileUpload?.uploads?.[0]?.validationType);
      setValue('uploadStorageType', projectConfig?.fileUpload?.uploads?.[0]?.storage ?? 'local');
      setValue('uploadTimeAuth', projectConfig?.fileUpload?.uploads?.[0]?.authentication ?? false);
      setValue('uploadMaxSize', projectConfig?.fileUpload?.uploads?.[0]?.maxSize?.toString());
      setValue('isSingleFileUpload', projectConfig?.fileUpload?.uploads?.[0]?.isSingle ?? true);
      setValue('responseFormatter', projectConfig?.responseFormatter ?? []);

      setValue('platform', Object.keys(projectConfig?.twoFactorAuthentication?.platform || {}) || []);
      setValue('resetPasswordMasterIds', projectConfig?.resetPassword?.link?.masterIds);

      setValue('expireTime', projectConfig?.resetPassword?.expireTime?.toString());
      if (!isLoading) {
        mastersList?.forEach((master) => {
          if (projectConfig?.externalServiceProviderData?.find((provider) => provider?.typeId === master?._id)) {
            setValue(`notification-${master?.code}`, projectConfig?.externalServiceProviderData?.find((provider) => provider?.typeId === master?._id)?.serviceProviderId); // to get selected notification provider from dropdown
          }
          master?.subMaster?.forEach((sub) => {
            sub?.customJson?.map((field) => (
              setValue(`${field?.fieldName}-${sub?._id}`, get(projectConfig?.externalServiceProviderData?.find((provider) => provider?.typeId === master?._id)?.customJson, `${field?.fieldName}`)) // to get fields' data of selected notification provider
            ));
          });
        });
      }
      if (!isLoading) {
        socialMastersList?.forEach((socialMaster) => {
          setValue(`platform-${socialMaster?._id}`, projectConfig?.socialPlatform?.find((platform) => platform?.typeId === socialMaster?._id)?.platform); // to get all the selected platforms for particular social auth medium
          setValue(`platform-${socialMaster?._id}-selection`, projectConfig?.socialPlatform?.find((platform) => platform?.typeId === socialMaster?._id)?.isChecked); // to (un)check checkbox of particular social auth medium
          socialMaster?.customJson?.forEach((field) => {
            setValue(`${field?.fieldName}-${socialMaster?._id}`, !isEmpty(get(projectConfig?.socialPlatform?.find((platform) => platform?.typeId === socialMaster?._id)?.credential, `${field?.fieldName}`)) ? get(projectConfig?.socialPlatform?.find((platform) => platform?.typeId === socialMaster?._id)?.credential, `${field?.fieldName}`) : `${field?.defaultUrl}`); // to get fields' data of particular social auth medium
          });
        });
      }
    } else {
      reset();
    }
  };

  React.useEffect(() => {
    setInitialData();
  }, [props?.projectConfig?._id, isLoading]);

  const onSubmit = (updatedData, cb) => {
    const { projectConfig = {} } = props;
    const apiData = {
      applicationId,
      authModuleId: updatedData?.authModuleId,
      authModule: modelList?.find((model) => model?._id === updatedData?.authModuleId)?.name,
      loginWith: {
        username: updatedData?.username ?? [],
        password: updatedData?.password ?? '',
      },
      isTwoFA: updatedData?.isTwoFA,
      restrictNoOfDevice: updatedData?.isRestrictDevice,
      noOfDevice: updatedData?.isRestrictDevice ? +updatedData?.noOfDevice || 1 : 1,

      loginRetryLimit: {
        max: updatedData?.loginRetryLimitMax && Number(updatedData?.loginRetryLimitMax),
        reActiveTime: updatedData?.loginReActiveTime && Number(updatedData?.loginReActiveTime),
      },
      resetPassword: {
        link: getMediumObject(updatedData?.resetPasswordMasterIds, mastersList, updatedData, [], 'resetPasswordTemplates'),
        expireTime: updatedData?.expireTime && Number(updatedData?.expireTime),
      },

      loginRateLimit: {
        max: updatedData?.rateLimitMax && Number(updatedData?.rateLimitMax),
        reActiveTime: updatedData?.rateReActiveTime && Number(updatedData?.rateReActiveTime),
      },
      isSocialMediaAuth: getSocialAuthData(socialMastersList, updatedData)?.some((platform) => platform?.isChecked),
      socialPlatform: getSocialAuthData(socialMastersList, updatedData)?.some((platform) => platform?.isChecked) ? getSocialAuthData(socialMastersList, updatedData) : [],
      externalServiceProviderData: getServiceProvideData(mastersList, updatedData),
      tokenExpiryTime: updatedData?.tokenExpireTime && Number(updatedData?.tokenExpireTime),
      fileUpload: {
        uploads: [{
          platform: updatedData?.uploadPlatform,
          validationType: updatedData?.uploadFileType,
          storage: updatedData?.uploadStorageType,
          authentication: updatedData?.uploadTimeAuth,
          maxSize: updatedData?.uploadMaxSize && Number(updatedData?.uploadMaxSize),
          isSingle: updatedData?.isSingleFileUpload ?? true,
        }],
      },
      responseFormatter: updatedData?.responseFormatter?.map((x) => omit(x, 'model')) || [],
    };
    setSubmitting();
    const promise = (projectConfig?._id || updatedProjectId) ? updateApplicationConfig((projectConfig?._id || updatedProjectId), apiData) : createApplicationConfig(apiData);
    promise.then((applicationConfigRes) => {
      if (applicationConfigRes?.data?._id) {
        addSuccessToast(applicationConfigRes?.message);
        setUpdatedProjectId(applicationConfigRes?.data?._id);
        setInitialData(applicationConfigRes?.data);
        unsetSubmitting();
        cb && typeof cb === 'function' && cb();
      }
    }).catch((error) => {
      addErrorToast(error);
    }).finally(unsetSubmitting);
  };
  return (
    <BoxLayout variant="mainRight">
      {isLoading ? <Spinner /> : (
        <div className="flex w-full h-body">
          <FormProvider
            {...methods}
          >
            <Tabs selectedTabPanelClassName="h-full flex flex-col" className="flex w-full" selectedTabClassName={TabCSs.tabVerselectTab}>
              <TabList className={`${TabCSs.tabVerHead} xxl:w-1.5/12 w-2.5/12 flex flex-col`}>
                <div className="flex justify-between p-3 items-center border-b-1 border-gray-100 relative configTop">
                  <div className="text-primary-text text-base font-semibold">Configuration</div>
                </div>
                <div className="overflow-auto sticky top-0 p-2">
                  <ScrollArea
                    speed={0.8}
                    className="area h-full justify-between"
                    contentClassName="w-full"
                    smoothScrolling
                  >
                    {
                      APPLICATION_CONFIG_TABS[currentApplicationCode]?.map((tab) => (
                        <Tab key={tab} className={`${TabCSs.tabVerTitle}`}>
                          <span className={TabCSs.tabverTitleName}>{tab}</span>
                        </Tab>
                      ))
                    }
                  </ScrollArea>
                </div>
              </TabList>
              <div className="xxl:w-10.5/12 w-9.5/12">
                <TabPanel>
                  <div className="px-5 py-3 flex justify-between headerTop items-center">
                    <div className="w-8/12 xxl:w-6/12">
                      <Heading variant="h4">Authentication</Heading>
                      <Description className="mt-1">
                        Configure authentication module and customize security for your project.
                      </Description>
                    </div>
                    <div className="flex justify-end w-4/12 xxl:w-6/12">
                      <Button size="medium" variant="primary" shape="rounded" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Update</Button>
                    </div>
                  </div>
                  <div className="overflow-auto flex-grow p-5 pt-0 border-t border-gray-100">
                    <div className="grid grid-cols-2 xxl:grid-cols-3 gap-5 items-start py-4">
                      <Controller
                        control={control}
                        name="authModuleId"
                        render={(controlProps) => (
                          <Select
                            {...controlProps}
                            label="Auth model"
                            placeholder="Select Auth model"
                            options={modelList}
                            onChange={(value) => {
                              setValue('authModuleId', value);
                              setValue('username', [...Object.keys(pick(modelList?.find((model) => model?._id === watch('authModuleId'))?.schemaJson, ['username', 'email']))]); // select "username" and "email" if that attribute is available in selected auth model
                              setValue('password', (Object.keys(modelList?.find((model) => model?._id === watch('authModuleId'))?.schemaJson ?? {})?.includes('password') ? 'password' : '')); // select "password" if that attribute is available in selected auth model
                            }}
                            error={getError(errors, 'authModuleId', 'Auth Model')}
                            valueKey="_id"
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="username"
                        render={(controlProps) => (
                          <SelectTree
                            {...controlProps}
                            defaultValue={controlProps?.value}
                            label="Login query parameter for username"
                            placeholder="Select login query parameter for username"
                            mode="multiple"
                            data={prepareQueryParameters({ ...(watch('authModuleId') && defaultAttributes[ormType]), ...modelList?.find((model) => model?._id === watch('authModuleId'))?.schemaJson }, ormType)} // to display list of login query parameters according to selected model
                            error={getError(errors, 'username', 'Login query parameter for username')}
                            handleChange={(values) => {
                              setValue('username', values?.allSelectedNode?.map((node) => node?.fullName));
                            }}
                            disabledKey={[...DISABLED_QUERY_PARAMETER_KEYS, 'password']}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="password"
                        render={(controlProps) => (
                          <SelectTree
                            {...controlProps}
                            defaultValue={!isEmpty(controlProps?.value) ? [controlProps?.value] : []}
                            label="Login query parameter for password"
                            placeholder="Select login query parameter for password"
                            mode="radioSelect"
                            data={prepareQueryParameters(modelList?.find((model) => model?._id === watch('authModuleId'))?.schemaJson, ormType)} // to display list of password query parameters according to selected model
                            error={getError(errors, 'password', 'Login query parameter for password')}
                            handleChange={(values) => {
                              setValue('password', values?.allSelectedNode?.[0]?.fullName); // to keep the updated value of password query while changing values of other fields
                            }}
                            disabledKey={[...DISABLED_QUERY_PARAMETER_KEYS, 'username', 'email']}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="loginRetryLimitMax"
                        rules={{ min: 3, max: 5 }}
                        render={(controlProps) => (
                          <Input.Number
                            {...controlProps}
                            label="Login retry limit"
                            placeholder="Enter login retry limit"
                            error={getError(errors, 'loginRetryLimitMax', errors?.loginRetryLimitMax?.type === 'min' ? '3' : '5')}
                          />
                        )}
                      />
                      <Controller
                        control={control}
                        name="loginReActiveTime"
                        render={(controlProps) => (
                          <Input.Number
                            {...controlProps}
                            label="Login re-active time (in minutes)"
                            placeholder="Enter login re-active time"
                            error={getError(errors, 'loginReActiveTime', 'Login re-active time')}
                          />
                        )}
                      />
                    </div>

                    <hr className="border-t boredr-1 border-gray-100 my-6" />
                    <div className="py-4">
                      <div className="grid grid-cols-2 xxl:grid-cols-3 gap-5">
                        <Controller
                          control={control}
                          name="resetPasswordMasterIds"
                          render={(controlProps) => (
                            <Select
                              {...controlProps}
                              label="Reset password link"
                              placeholder="Select reset password link"
                              isMulti
                              options={mastersList?.filter((master) => master?.code !== 'PUSH_NOTIFICATION')}
                              valueKey="_id"
                              labelKey="name"
                              error={getError(errors, 'resetPasswordMasterIds', 'Reset password medium')}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="expireTime"
                          render={(controlProps) => (
                            <Input.Number
                              {...controlProps}
                              label="Expire time (in minutes)"
                              placeholder="Enter expire time"
                              error={getError(errors, 'expireTime', 'Expire time')}
                            />
                          )}
                        />
                      </div>

                    </div>

                    <div className="py-4">
                      <hr className="border-t boredr-1 border-gray-100 my-6" />
                      <div className="">
                        <Controller
                          control={control}
                          name="isRestrictDevice"
                          defaultValue={watch('isRestrictDevice')}
                          render={(controlProps) => (
                            <Checkbox
                              {...controlProps}
                              checked={controlProps.value}
                            >
                              Is restrict device?
                            </Checkbox>
                          )}
                        />
                      </div>
                      {watch('isRestrictDevice')
                            && (
                            <div className="grid w-11/12 grid-cols-2 gap-5 mt-5">
                              <>
                                <Controller
                                  control={control}
                                  name="noOfDevice"
                                  render={(controlProps) => (
                                    <Input.Number
                                      {...controlProps}
                                      label="Number of device(s)"
                                      placeholder="Enter number of device(s)"
                                    />
                                  )}
                                />
                              </>
                            </div>
                            )}
                    </div>
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="px-5 py-3 flex justify-between headerTop items-center">
                    <div className="w-9/12 xxl:w-6/12">
                      <Heading variant="h4">Social auth setting</Heading>
                      <Description className="mt-1">
                        Fill details of the respective platforms you want to enable social authetication for. All details will be stored in the .env file. You can further update the detail in the same file after downloading the code.
                      </Description>
                    </div>
                    <div className="flex justify-end w-3/12 xxl:w-6/12">
                      <Button size="medium" variant="primary" shape="rounded" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Update</Button>
                    </div>
                  </div>
                  <div className="overflow-auto flex-grow p-5 pt-0 border-t border-gray-100">
                    {!isLoading && (
                    <div className="">
                      { socialMastersList?.map((socialMaster) => (
                        <div key={socialMaster?._id} className="py-5 border-b border-gray-200">
                          <div className="flex items-center">
                            <Controller
                              control={control}
                              name={`platform-${socialMaster?._id}-selection`}
                              render={(controlProps) => (
                                <Checkbox
                                  {...controlProps}
                                  checked={!!controlProps?.value}
                                />
                              )}
                            />
                            <Heading variant="h5" className="ml-1">{socialMaster?.name}</Heading>
                          </div>
                          {
                              // watch(`platform-${socialMaster?._id}-selection`)
                              // && (
                            <div className={`grid-cols-2 xxl:grid-cols-3 gap-5 mt-2 ${watch(`platform-${socialMaster?._id}-selection`) ? 'grid' : 'hidden'}`}>
                              {/* to get selection dropdown of platforms for social auth */}
                              <Controller
                                control={control}
                                name={`platform-${socialMaster?._id}`}
                                render={(controlProps) => (
                                  <Select
                                    {...controlProps}
                                    placeholder="Select platform"
                                    options={getApplicationPlatforms(applicationLoginAccess)} // to fetch all the platforms
                                    label="Platform"
                                    isMulti
                                    error={getError(errors, `platform-${socialMaster?._id}`, 'Platform')}
                                  />
                                )}
                              />
                              {
                                    socialMaster?.customJson?.map((field) => {
                                      if (watch(`platform-${socialMaster?._id}-selection`)) {
                                        return (
                                          // to get fields' of all social auth
                                          <Controller
                                            control={control}
                                            name={`${field?.fieldName}-${socialMaster?._id}`}
                                            rules={{ required: !!watch(`platform-${socialMaster?._id}-selection`), ...(field?.pattern && { pattern: /^\/[a-zA-Z0-9]+/ }) }}
                                            render={(controlProps) => (
                                              React.createElement(COMPONENT_TYPE[field?.inputType], {
                                                ...controlProps,
                                                key: `${field?.fieldName}-${socialMaster?._id}`,
                                                label: `${field?.displayName}${field?.isRequired ? '*' : ''}`,
                                                placeholder: `Enter ${field?.displayName}`,
                                                error: !!watch(`platform-${socialMaster?._id}-selection`) && getError(errors, `${field?.fieldName}-${socialMaster?._id}`, (errors?.[`${field?.fieldName}-${socialMaster?._id}`]?.type === 'pattern') ? `Enter valid ${field?.displayName}` : field?.displayName),
                                              })
                                            )}
                                          />
                                        );
                                      }
                                      delete errors?.[`${field?.fieldName}-${socialMaster?._id}`]; // to remove errors from not selected social auth's fields'
                                      return null;
                                    })
                                }
                            </div>
                              // )
                            }
                        </div>
                      ))}
                    </div>
                    )}
                  </div>
                </TabPanel>
                <TabPanel>
                  <div className="px-5 py-3 flex justify-between headerTop items-center">
                    <div className="w-8/12 xxl:w-6/12">
                      <Heading variant="h4">Security setting</Heading>
                      <Description className="mt-1">
                        Manage number of API calls per minute to avoid undesired activity in your project.
                      </Description>
                    </div>
                    <div className="flex justify-end w-4/12 xxl:w-6/12">
                      <Button size="medium" variant="primary" shape="rounded" onClick={handleSubmit(onSubmit)} loading={isSubmitting}>Update</Button>
                    </div>
                  </div>
                  <div className="overflow-auto flex-grow p-5 pt-0 border-t border-gray-100">
                    <div className="">
                      <div className="grid grid-cols-2 xxl:grid-cols-3 gap-5 py-4">
                        <Controller
                          control={control}
                          name="rateLimitMax"
                          render={(controlProps) => (
                            <Input.Number
                              {...controlProps}
                              label="Rate limit"
                              placeholder="Enter rate limit"
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="rateReActiveTime"
                          render={(controlProps) => (
                            <Input.Number
                              {...controlProps}
                              label="Rate limit re-active time (in minutes)"
                              placeholder="Enter rate limit re-active time (in minutes)"
                              error={getError(errors, 'rateReActiveTime', 'Rate limit re-active time')}
                            />
                          )}
                        />
                        <Controller
                          control={control}
                          name="tokenExpireTime"
                          render={(controlProps) => (
                            <Input.Number
                              {...controlProps}
                              label="Token expiry time (in minutes)"
                              placeholder="Enter token expiry time (in minutes)"
                            />
                          )}
                        />
                      </div>
                    </div>

                  </div>
                </TabPanel>
                <TabPanel>
                  <UploadAttachmentSetting platforms={getApplicationPlatforms(applicationLoginAccess)} onSubmit={onSubmit} loading={isSubmitting} />
                </TabPanel>
                <TabPanel>
                  <DataFormatConfig
                    onSubmit={onSubmit}
                    loading={isSubmitting}
                  />
                </TabPanel>
              </div>
            </Tabs>
          </FormProvider>
        </div>
      )}
    </BoxLayout>
  );
};
