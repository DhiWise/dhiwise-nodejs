/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useState, useRef } from 'react';
import { useDispatch, useSelector } from 'react-redux';
import cloneDeep from 'lodash/cloneDeep';
import concat from 'lodash/concat';
import { isEmpty, uniq } from 'lodash';
import { useHistory } from 'react-router';
import { NoData, StepFooter } from '../../../components';
import {
  getModelPermissions,
  upsertModelPermissions,
} from '../../../api/models';
import Header from './Header';
import Permissions from './Permissions';
import useToastNotifications from '../../hooks/useToastNotifications';
import useBoolean from '../../hooks/useBoolean';
import { validationMsg } from '../../../utils/validationMsgs';
import Spinner from './Permission.loader';
import { CRUD } from '../../../constant/permission';
import { getPolicies } from '../../../api/policy';
import { listModels } from '../../../redux/thunks/models';
import { PermissionSettingProvider, SETTING_ACTION_TYPES } from './PermissionSettingProvider';
import { prepareData, prepareSettingData } from './PermissionHelperFunctions';
import LayoutStepUrl from '../../Shared/LayoutStepUrl';
import { StepHeader } from '../../Shared/Layout/StepHeader';
import { encryptStorage } from '../../../utils/localStorage';
import { LAYOUT_STEP_MODULE_NAME, RedirectUrl } from '../../../constant/Nodecrud';

export default function Permission() {
  const history = useHistory();
  const [permissionList, setPermissionList] = useState([]);
  const [policyLists, setPolicyLists] = React.useState([]);
  const [loader, setLoader, hideLoader] = useBoolean(false);
  const [upsertLoader, setUpsertLoader, hideUpsertLoader] = useBoolean(false);
  const applicationId = useSelector((state) => state.projects.currentApplicationId);
  const projectDetail = useSelector((state) => state.projects.currentProjectDetail);
  const applicationLoginAccess = projectDetail?.applicationList?.find((d) => d._id === applicationId)?.configInput?.platform;
  const [deviceData, setDeviceData] = React.useState({});
  const dataRef = useRef(null);
  const buttonRef = React.useRef('');
  const modelList = useSelector(({ models }) => models.modelList);
  const currentApplicationCode = useSelector((state) => state.projects.currentApplicationCode);

  React.useEffect(() => () => {
    // Remove
    // to maintain remove toggle from sidebar when crud in url
    !window.location.pathname.includes('crud') && encryptStorage.remove('sidebarToggle');
  }, []);

  const {
    addErrorToast,
    addSuccessToast,
  } = useToastNotifications();
  const dispatch = useDispatch();

  const fetchData = async () => {
    try {
      setLoader();
      const policyRes = await getPolicies({ applicationId });
      const permissionRes = await getModelPermissions({ applicationId });

      setPolicyLists(policyRes?.data?.list || []);
      if (!isEmpty(permissionRes?.data?.list)) {
        const newPermissionData = prepareData(permissionRes?.data?.list, cloneDeep(applicationLoginAccess), setDeviceData);
        setPermissionList(newPermissionData);
        setTimeout(() => {
          hideLoader();
        }, 100);
      } else {
        setPermissionList(permissionRes?.data?.list || []);
        hideLoader();
      }
    } catch (error) {
      addErrorToast(error);
    }
  };

  const fetch = () => {
    setLoader();
    getModelPermissions({ applicationId }).then((data) => {
      if (!isEmpty(data?.data?.list)) {
        const newPermissionData = prepareData(data?.data?.list, cloneDeep(applicationLoginAccess), setDeviceData);
        setPermissionList(newPermissionData);
        hideLoader();
      } else {
        setPermissionList(data?.data?.list || []);
        hideLoader();
      }
    }).catch(addErrorToast).finally(hideLoader);
  };

  React.useEffect(() => {
    fetchData();
  }, []);

  React.useEffect(() => {
    if (applicationId) {
      dispatch(listModels({ applicationId }));
    }
  }, [applicationId]);

  const handleSave = () => {
    const currentPermissions = cloneDeep(dataRef?.current?.permissions) || []; // to get all latest/updated permissions list
    const permissionSetting = cloneDeep(dataRef?.current?.editSettingData) || {}; // to get latest/updated additionalSetting data of selected model's selected platform

    const exist = currentPermissions?.find((permission) => Object.keys(permission?.schemaJson)?.some((platform) => Object.values(permission.schemaJson[platform])?.some((key) => (key)))); // to check schemaJson Data

    if (!exist) {
      addErrorToast(validationMsg.select('Model Permissions'));
      return;
    }

    const model = permissionSetting?.[Object.keys(permissionSetting)?.[0]]?.model; // to get selected model _id of selected platform

    const requestArray = [];
    currentPermissions?.map((permission) => {
      const reqJson = {};
      const settingJson = {};
      const settings = (permission?.schemaId?._id === model) ? permissionSetting : (permission?.additionalJson?.additionalSetting || {});

      Object.keys(permission.schemaJson)?.forEach((platform) => {
        // to add/remove 'auth' policy in additionalSetting object based on 'isAuth' value
        !isEmpty(settings?.[platform]) && Object.keys(settings?.[platform])?.forEach((operation) => {
          settings[platform][operation][CRUD.POLICY] = permission?.schemaJson?.[platform]?.[CRUD.isAuth] ? uniq(settings?.[platform]?.[operation]?.[CRUD.POLICY]?.concat('auth')) : settings?.[platform]?.[operation]?.[CRUD.POLICY]?.filter((policy) => policy !== 'auth');
        });
      });

      if (!model) { // if settings drawer isn't opened
        !isEmpty(settings) ? Object.keys(permission?.schemaJson)?.forEach((platform) => {
          if (settings[platform]) { // if additionalJson for selected platform exists
            Object.keys((permission?.schemaJson?.[platform]))?.forEach((operation) => {
              if (![CRUD.isAuth, CRUD.POLICY, CRUD.ALL].includes(operation)) {
                if (permission?.schemaJson?.[platform]?.[operation]) {
                  if (settings?.[platform]?.[operation]) {
                    settings[platform][operation].isAuth = permission?.schemaJson?.[platform]?.[CRUD.isAuth];
                    settings[platform][operation].selected = permission?.schemaJson?.[platform]?.[operation];
                    settings[platform][operation].policy = !isEmpty(settings?.[platform]?.[operation].policy) ? settings?.[platform]?.[operation].policy : permission?.schemaJson?.[platform]?.[CRUD.POLICY];
                  } else {
                    prepareSettingData(settings, platform, operation, permission);
                  }
                } else {
                  delete settings?.[platform]?.[operation]; // to remove unchecked operation from additionalSetting
                }
              }
            });
          } else { // if additionalJson for selected platform doesn't exist, create the same in additionalJson
            settings[platform] = {};
            Object.keys((permission?.schemaJson?.[platform]))?.forEach((operation) => {
              if (![CRUD.isAuth, CRUD.POLICY, CRUD.ALL].includes(operation)) {
                if (permission?.schemaJson?.[platform][operation]) {
                  prepareSettingData(settings, platform, operation, permission);
                }
              }
            });
          }
        })
          : Object.keys((permission?.schemaJson))?.forEach((platform) => { // if additionalJson object doesn't exist, create the same in additionalSetting object
            settings[platform] = {};
            Object.keys((permission?.schemaJson?.[platform]))?.forEach((operation) => {
              if (![CRUD.isAuth, CRUD.POLICY, CRUD.ALL].includes(operation)) {
                if (permission?.schemaJson?.[platform][operation]) {
                  prepareSettingData(settings, platform, operation, permission);
                }
              }
            });
          });
      }

      if (permission?.schemaId?._id === model) {
        // to add/remove (un)checked operations' data of selected permission in/from additionalJson object
        Object.keys(settings)?.forEach((action) => {
          const platform = settings?.[action]?.platformType;
          settingJson[platform] = {};
          !isEmpty(settings) && Object.keys(settings)?.map((operation) => {
            if (permission?.schemaId?._id === model && permission?.schemaJson?.[platform]?.[operation]) {
              settingJson[platform][operation] = {};
              settingJson[platform][operation].selected = permission?.schemaJson?.[platform]?.[operation] ? settings?.[operation]?.selected : permission?.schemaJson?.[platform]?.[operation];
              settingJson[platform][operation].policy = uniq(settings?.[operation]?.policy);
              settingJson[platform][operation].isAuth = permission?.schemaJson?.[platform]?.[CRUD.isAuth] ? settings?.[operation]?.isAuth : permission?.schemaJson?.[platform]?.[CRUD.isAuth];
              settingJson[platform][operation].attributes = settings?.[operation]?.attributes || [];
            } else {
              delete settings?.[platform]?.[operation];
            }
            return settingJson;
          });
        });
      }

      Object.keys(permission.schemaJson)?.map((platform) => {
        // remove extra keys
        delete permission.schemaJson[platform].ALL;
        reqJson[platform] = [];
        reqJson[platform].push({ [CRUD.isAuth]: !!permission?.schemaJson[platform][CRUD.isAuth], policy: permission?.schemaJson?.[platform]?.[CRUD.POLICY] || [] });
        delete permission.schemaJson[platform][CRUD.isAuth];
        delete permission.schemaJson[platform][CRUD.POLICY];
        delete permission.schemaJson[platform].isAuthentication;
        reqJson[platform] = concat(reqJson[platform], Object.keys(permission.schemaJson[platform])?.filter((act) => permission?.schemaJson[platform][act]));
        return platform;
      });

      const obj = {
        _id: permission._id,
        schemaId: permission.schemaId._id,
        schemaJson: reqJson,
        additionalJson: {
          additionalSetting: (permission?.schemaId?._id === model) ? { ...(!isEmpty(permission?.additionalJson?.additionalSetting) && permission?.additionalJson?.additionalSetting), ...settingJson } : settings,
        },
      };
      requestArray.push(obj);
      return permission;
    });

    setUpsertLoader();
    upsertModelPermissions({ data: requestArray }).then((data) => {
      fetch();
      addSuccessToast(data?.message);
      dataRef?.current?.dispatch({ type: SETTING_ACTION_TYPES.RESET_EDIT_DATA });
      hideUpsertLoader();

      if (buttonRef.current === 'next') history.push(RedirectUrl[currentApplicationCode].permission.nextUrl);
    }).catch((error) => {
      addErrorToast(error);
      hideUpsertLoader();
    });
  };

  return (
    <div className="flex flex-col h-screen">
      <StepHeader backTitle="Back to screen" headTitle="CRUD" link={RedirectUrl[currentApplicationCode].permission.backScreenUrl} />
      <LayoutStepUrl isOpenBigLayout={false} isBuildShow moduleName={LAYOUT_STEP_MODULE_NAME[currentApplicationCode]}>

        <div className="w-full h-0 flex flex-grow flex-col">
          <Header
            upsertLoader={upsertLoader}
            onSave={handleSave}
            onCancel={fetch}
            permissions={permissionList}
          />
          <div
            className="overflow-auto h-full"
          >
            {loader && <Spinner />}
            {!loader
             && (
               !isEmpty(permissionList)
                 ? (
                   <PermissionSettingProvider>
                     <Permissions ref={dataRef} permissions={permissionList} applicationLoginAccess={cloneDeep(applicationLoginAccess)} policyLists={policyLists} handleSave={handleSave} deviceData={deviceData} />
                   </PermissionSettingProvider>
                 )
                 : (
                   <NoData
                     onClick={() => {
                       // Remove
                       if (isEmpty(applicationLoginAccess)) { history.push(RedirectUrl[currentApplicationCode].platformConfig.pageUrl); return; }
                       if (isEmpty(modelList)) {
                         history.push(RedirectUrl[currentApplicationCode].model.pageUrl);
                       }
                     }}
                     title={isEmpty(applicationLoginAccess) ? 'No platforms are available.' : isEmpty(modelList) ? 'No models are available.' : 'No model permission found'}
                     btnText={isEmpty(applicationLoginAccess) ? 'Add platform' : isEmpty(modelList) ? 'Add model' : ''}
                   />
                 )
             )}
          </div>
        </div>
        <StepFooter
          backClick={() => {
            history.push(RedirectUrl[currentApplicationCode].permission.previousUrl);
          }}
          nextClick={() => {
            buttonRef.current = 'next';
            handleSave();
          }}
          isNextDisable={loader}
          isSaveDisable={loader}
          nextLoading={buttonRef.current === 'next' && upsertLoader}
          saveLoading={buttonRef.current === 'save' && upsertLoader}
          saveClick={() => {
            buttonRef.current = 'save';
            handleSave();
          }}
          Back="Previous"
          Next="Save & Next"
          saveText="Save"
        />
      </LayoutStepUrl>
    </div>

  );
}
