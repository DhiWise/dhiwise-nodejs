/* eslint-disable react/jsx-props-no-spreading */
import React from 'react';
import { Controller, useForm } from 'react-hook-form';
import { useDispatch, useSelector } from 'react-redux';
import { useHistory } from 'react-router';
import { isEmpty } from 'lodash';
import {
  editApplication,
  // getApplication
}
  from '../../../api/project';
import {
  Heading, StepFooter, Select, Loader,
} from '../../../components';
import { useBoolean } from '../../../components/hooks';
import { LAYOUT_STEP_MODULE_NAME, RedirectUrl } from '../../../constant/Nodecrud';
import {
  PLATFORM_FILTER, USER_TYPE_FILTER,
} from '../../../constant/Project/applicationStep';
import { selectCurrentApplication } from '../../../redux/reducers/projects';
import { encryptStorage } from '../../../utils/localStorage';
import { getError } from '../../../utils/validationMsgs';
import { StepHeader } from '../../Shared/Layout/StepHeader';
import LayoutStepUrl from '../../Shared/LayoutStepUrl';
import TagNameSelect from '../../Shared/TechnologySetStep/addNewTag';
import { useToastNotifications } from '../../hooks';

const Configuration = () => {
  const {
    errors, control,
    getValues,
    handleSubmit, watch, setValue,
  } = useForm({ mode: 'all' });
  const dispatch = useDispatch();
  const buttonRef = React.useRef('');
  const { addSuccessToast, addErrorToast } = useToastNotifications();
  const applicationId = useSelector(({ projects }) => (projects.currentApplicationId));
  const applicationList = useSelector(({ projects }) => (projects.currentProjectDetail.applicationList));
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);
  const history = useHistory();
  const [loading, setLoading, hideLoading] = useBoolean(false);
  const [fetchLoading, setFetchLoading, hideFetchLoading] = useBoolean(false);
  const configInput = applicationList?.find?.((d) => d._id === applicationId)?.configInput;

  const defaultPlatForm = PLATFORM_FILTER.map((platform) => platform.id);
  const [customPlatForm, setCustomPlatForm] = React.useState([]);
  React.useEffect(() => {
    setCustomPlatForm(configInput?.platform?.filter((p) => !customPlatForm.includes(p) && !defaultPlatForm.includes(p)).map((p) => ({ id: p, name: p })) ?? []);
  }, []);
  const getPlatformData = () => {
    setFetchLoading();
  };
  React.useEffect(() => {
    getPlatformData();
    hideFetchLoading();
    return () => {
    // REMOVE
    // to maintain remove toggle from sidebar when crud in url
      !window.location.pathname.includes('crud') && encryptStorage.remove('sidebarToggle');
    };
  }, []);
  const handleSave = (buttonName) => {
    buttonRef.current = buttonName;
    setLoading();

    editApplication(applicationId, {
      name: applicationList.find((app) => app._id === applicationId)?.name,
      configInput: {
        ...(configInput && configInput),
        ...getValues(),
      },
    }).then((res) => {
      addSuccessToast(res.message);
      if (buttonName === 'next') history.push(RedirectUrl[currentApplicationCode].platformConfig.nextUrl);
      hideLoading();
      dispatch(
        selectCurrentApplication({
          currentProject: {
            applications: applicationList.map((a) => (a._id === applicationId ? { ...a, ...res.data } : a)),
          },
        }),
      );
    }).catch((error) => {
      addErrorToast(error);
      hideLoading();
    });
  };
  return (
    <div className="flex flex-col h-screen">
      <StepHeader backTitle="Back to screen" headTitle="CRUD" link={RedirectUrl[currentApplicationCode].platformConfig.backScreenUrl} />
      <LayoutStepUrl isOpenBigLayout={false} isBuildShow moduleName={LAYOUT_STEP_MODULE_NAME[currentApplicationCode]}>
        {fetchLoading && <Loader />}
        <div className="headTop p-3 px-5 border-b border-gray-200">
          <div className="w-8/12 xxl:w-6/12">
            <Heading variant="h5">Platform Configuration</Heading>
            {/* <Description className="mt-1">Lorem Ipsum is simply dummy text of the Lorem Ipsum is simply dummy text of the Lorem Ipsum is simply dummy text of the</Description> */}
          </div>
        </div>
        { !fetchLoading && (
        <div className="p-3 px-5 overflow-auto flex-grow">
          <div className="grid grid-cols-2 gap-5">
            <Controller
              control={control}
              defaultValue={isEmpty(configInput?.platform) ? undefined : configInput?.platform}
              name="platform"
              rules={{ required: true }}
              render={(controlProps) => (
                <TagNameSelect
                  {...controlProps}
                  setCustomTag={(p) => {
                    setCustomPlatForm(p.filter((platform) => !defaultPlatForm?.includes(platform.id)));
                  }}
                  onChange={(options) => {
                    const adminAccess = getValues('loginAccess[Admin]')?.filter((admin) => options?.includes(admin));
                    const customerAccess = getValues('loginAccess[User]')?.filter((user) => options?.includes(user));
                    setValue('loginAccess[Admin]', isEmpty(adminAccess) ? undefined : adminAccess);
                    setValue('loginAccess[User]', isEmpty(customerAccess) ? undefined : customerAccess);
                    controlProps.onChange(options);
                  }}
                  tagNameCustom={customPlatForm}
                  placeholder="Select platform selection"
                  options={PLATFORM_FILTER}
                  isMulti
                  label="Platform selection*"
                  desc={(
                    <>
                      Select the platform for which you would like to build an application. Just write any name and press enter to add a custom platform.
                    </>
                          )}
                  error={getError(errors, 'platform', 'Platform')}
                />
              )}
            />
            <Controller
              control={control}
              name="types"
              defaultValue={configInput?.types}
              rules={{ required: true }}
              render={(controlProps) => (
                <Select
                  {...controlProps}
                  placeholder="Select user type"
                  options={USER_TYPE_FILTER}
                  isMulti
                  valueKey="name"
                  label="User types*"
                  desc="Select user type who are going to use the application."
                  error={getError(errors, 'types', 'User type')}
                />
              )}
            />
            {watch('types')?.includes?.('Admin') && (
            <Controller
              control={control}
              defaultValue={configInput?.loginAccess?.Admin}
              name="loginAccess[Admin]"
              rules={{ required: true }}
              render={(controlProps) => (
                <Select
                  {...controlProps}
                  placeholder="Select login access for admin"
                  options={[...PLATFORM_FILTER.filter((platform) => watch('platform')?.includes(platform.id)), ...customPlatForm.filter((platform) => watch('platform')?.includes(platform.id))]}
                  isMulti
                  label="Login access for admin* "
                  desc="Select platform allows admin to login."
                  error={getError(errors?.loginAccess ?? {}, 'Admin', 'Login access for admin')}
                />
              )}
            />
            )}
            {watch('types')?.includes?.('User') && (
            <Controller
              control={control}
              defaultValue={configInput?.loginAccess?.User}
              name="loginAccess[User]"
              rules={{ required: true }}
              render={(controlProps) => (
                <Select
                  {...controlProps}
                  placeholder="Select login access for user"
                  options={[...PLATFORM_FILTER.filter((platform) => watch('platform')?.includes(platform.id)), ...customPlatForm.filter((platform) => watch('platform')?.includes(platform.id))]}
                  isMulti
                  label="Login access for user* "
                  desc="Select platform allows user to login."
                  error={getError(errors?.loginAccess ?? {}, 'User', 'Login access for user')}
                />
              )}
            />
            )}

          </div>
        </div>
        )}
        {/* // REMOVE */}
        <StepFooter
          nextClick={
            handleSubmit(() => handleSave('next'))
          }
          saveClick={
            handleSubmit(() => handleSave('save'))
          }
          saveLoading={buttonRef.current === 'save' && loading}
          nextLoading={buttonRef.current === 'next' && loading}
          Next="Save & Next"
          saveText="Save"
        />
      </LayoutStepUrl>
    </div>
  );
};
export default Configuration;
