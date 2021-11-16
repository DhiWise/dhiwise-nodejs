/* eslint-disable no-nested-ternary */
import React from 'react';
import PropTypes from 'prop-types';
// import ReactTooltip from 'react-tooltip';
import { cloneDeep, isEmpty } from 'lodash';
import { Icons } from '@dhiwise/icons';
import {
  ListTitle,
  Checkbox,
  Select,
  IconBox,
} from '../../../components';
import { CRUD } from '../../../constant/permission';
import { SETTING_ACTION_TYPES, useSettings } from './PermissionSettingProvider';

function PermissionItem(props) {
  const {
    title, permissionSet, onChange, permission, policyLists, handleShow, permissionSettingRef, platformTypeRef, isAnyAction,
  } = props;

  const { dispatch } = useSettings();

  const handleChange = (val, action, type) => {
    // to update permission Array @val: checkbox value,@action: any from CRUD, @type: device type
    onChange(val, {
      action,
      permission,
      type,
    });
  };

  const ActionCheckbox = (propsVal) => {
    const {
      children, operationType, platformType, disabled = false,
    } = propsVal;
    return (
      <Checkbox
        className="text-center"
        checked={!!permissionSet[platformType][operationType]}
        disabled={disabled}
        onChange={(val) => {
          if (operationType === CRUD.isAuth) {
            const policiesList = permissionSet[platformType][CRUD.POLICY];
            if (val) {
              policiesList?.unshift('auth');
              handleChange(policiesList, CRUD.POLICY, platformType);
            } else {
              handleChange(policiesList?.filter((policy) => policy !== 'auth'), CRUD.POLICY, platformType);
            }
          }
          handleChange(val, operationType, platformType);
        }}
      >
        {children}
      </Checkbox>
    );
  };

  const ModalCheckbox = (propsVal) => {
    const { children } = propsVal;
    return (
      <Checkbox
        className="text-center"
        checked={!!permission.isAllModal}
        onChange={(val) => handleChange(val, CRUD.ALL_MODEL)}
      >
        {children}
      </Checkbox>
    );
  };

  const getSettings = (settingData, platform) => {
    const editSettingData = {};
    !isEmpty(settingData) && settingData?.forEach((setting) => {
      const settingObj = {};
      settingObj.platformType = platform;
      settingObj.operation = setting;
      settingObj.selected = permission?.schemaJson?.[platform]?.[setting];
      settingObj.policy = !isEmpty(permission?.additionalJson?.additionalSetting?.[platform]?.[setting]?.policy) ? (permission?.schemaJson?.[platform]?.[CRUD.isAuth] ? permission?.additionalJson?.additionalSetting?.[platform]?.[setting]?.policy?.concat('auth') : permission?.additionalJson?.additionalSetting?.[platform]?.[setting]?.policy?.filter((policy) => policy !== 'auth')) : permission?.schemaJson?.[platform]?.[CRUD.POLICY]; // Add newly selected policy in settings if no policy is selected for that setting // Add/Remove 'auth' policy in additionalSetting object based on 'isAuth' value
      settingObj.isAuth = permission?.schemaJson?.[platform]?.[CRUD.isAuth];
      settingObj.attributes = cloneDeep(permission?.additionalJson?.additionalSetting?.[platform]?.[setting]?.attributes);
      settingObj.model = permission?.schemaId?._id;
      editSettingData[setting] = settingObj;
    });
    dispatch({ type: SETTING_ACTION_TYPES.EDIT_DATA, payload: editSettingData });
  };

  return (
    <tr variant="normal" className="border-t-1 border-gray-200 ">
      <td className="sticky -left-3 z-1 bg-gray-black pl-5 cursor-pointer py-5 px-1 modelPermissionLeft">
        <ListTitle titleClass="truncate" title={title} />
        <div className="mr-2 flex items-center">
          <ModalCheckbox value={CRUD.ALL} />
          <div className="text-sm text-primary-text">All platform permission</div>
        </div>
      </td>
      <td className="permissionPage">
        <table>
          <tr>
            {permissionSet
            && Object.keys(permissionSet).sort().map((platform) => (
              <td className="cursor-pointer py-5 px-1 pr-8 permissionTableList" key={platform}>
                <div className="flex justify-between items-center">
                  <div className="flex justify-start">
                    <div className="mr-2">
                      <ActionCheckbox platformType={platform} operationType={CRUD.ALL}>
                        All
                      </ActionCheckbox>
                    </div>
                    <div className="mr-2">
                      <ActionCheckbox platformType={platform} operationType={CRUD.C}>
                        Create
                      </ActionCheckbox>
                    </div>
                    <div className="mr-2 text-center">
                      <ActionCheckbox platformType={platform} operationType={CRUD.R}>
                        View
                      </ActionCheckbox>
                    </div>
                    <div className="mr-2">
                      <ActionCheckbox platformType={platform} operationType={CRUD.U}>
                        Update
                      </ActionCheckbox>
                    </div>
                    <div className="mr-2">
                      <ActionCheckbox platformType={platform} operationType={CRUD.D}>
                        Delete
                      </ActionCheckbox>
                    </div>
                  </div>
                  <IconBox
                    onClick={() => {
                      permissionSettingRef.current = permission;
                      platformTypeRef.current = platform;
                      const settingData = !isEmpty(permission?.additionalJson?.additionalSetting?.[platform]) ? Object.keys(permission?.additionalJson?.additionalSetting?.[platform]) : {};
                      getSettings(settingData, platform);
                      handleShow();
                    }}
                    disabled={!isAnyAction(permission?.schemaJson?.[platform])}
                    size="medium"
                    tooltip="Setting"
                    shape="rounded"
                    variant="primary"
                    icon={<Icons.Setting color="#ffffff" />}
                  />
                </div>
                <div className="w-96 mt-2.5 p-2 border-1 border-gray-200 rounded-3 flex justify-start items-center">
                  <div className="text-center flex-grow-0 flex items-center mr-3">
                    <ActionCheckbox platformType={platform} operationType={CRUD.isAuth} disabled={!isAnyAction(permission?.schemaJson?.[platform])} />
                    <div className="text-sm text-primary-text">Auth</div>
                  </div>
                  <div className="flex-grow w-80">
                    <Select
                      name="policy"
                      defaultValue={permissionSet[platform][CRUD.POLICY]}
                      disabled={!isAnyAction(permission?.schemaJson?.[platform])}
                      value={permissionSet[platform][CRUD.POLICY]}
                      placeholder="Select middleware"
                      options={policyLists}
                      isMulti
                      valueKey="fileName"
                      labelKey="fileName"
                      onChange={(value) => {
                        if (value?.includes('auth')) {
                          handleChange(true, CRUD.isAuth, platform);
                        } else {
                          handleChange(false, CRUD.isAuth, platform);
                        }
                        handleChange(value, CRUD.POLICY, platform);
                      }}
                    />
                  </div>
                </div>

              </td>
            ))}
          </tr>
        </table>
      </td>
    </tr>
  );
}
export default PermissionItem;
PermissionItem.propTypes = {
  /**
   * display title
   */
  title: PropTypes.string.isRequired,
  /**
   * permission object
   */
  permission: PropTypes.objectOf(PropTypes.any),
  /**
   * function to change checkbox selection
   */
  onChange: PropTypes.func.isRequired,
  /**
   * set of permission actions
   */
  permissionSet: PropTypes.objectOf(PropTypes.any).isRequired,

};
