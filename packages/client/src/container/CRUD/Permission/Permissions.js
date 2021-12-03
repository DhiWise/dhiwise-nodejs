/* eslint-disable no-nested-ternary */
/* eslint-disable no-param-reassign */
import React, { useState } from 'react';
import PropTypes from 'prop-types';
import {
  capitalize, isEmpty, sortBy,
} from 'lodash';
import { CRUD, DEVICE_TYPE_NAME, LINKED_CRUD_OPERATION } from '../../../constant/permission';
import { Checkbox } from '../../../components';
import PermissionItem from './PermissionItem';
import useToastNotifications from '../../hooks/useToastNotifications';
import { Setting } from './Setting';
import { SETTING_ACTION_TYPES, useSettings } from './PermissionSettingProvider';
import {
  isAnyAction, isCheckedAll, isCheckedAllModel, isCrud, isCheckedAllDevice,
} from './PermissionHelperFunctions';

const Permission = React.forwardRef(({ ...props }, ref) => {
  const [isOpen, setIsOpen] = useState(false);
  const [permissions, setPermissions] = React.useState([]);
  const [deviceData, setDeviceData] = React.useState({});
  const permissionSettingRef = React.useRef(null);
  const platformTypeRef = React.useRef(null);

  const { editSettingData, dispatch } = useSettings();

  React.useImperativeHandle(ref, () => ({ permissions, editSettingData, dispatch }));
  const handleShow = () => {
    setIsOpen(true);
  };
  const handleClose = () => {
    dispatch({ type: SETTING_ACTION_TYPES.RESET_EDIT_DATA });
    setIsOpen(false);
  };

  const { addErrorToast } = useToastNotifications();

  React.useEffect(() => {
    if (props?.permissions) {
      setPermissions(props?.permissions);
      setDeviceData(props?.deviceData);
    }
  }, [props?.permissions]);

  const handleChange = (value, options) => {
    const { action, type, permission } = options;
    const newPermissions = [...permissions];
    newPermissions?.map((perm) => {
      const newPermission = perm;

      function mapSchemaJson() {
        Object.keys(newPermission.schemaJson)?.map((plat) => {
          const platform = plat;

          function uncheckAuth() {
            if (!isAnyAction(newPermission.schemaJson[platform])) {
              // uncheck AUTH selection if any action is not selected
              newPermission.schemaJson[platform].isAuth = false;
              newPermission.schemaJson[platform][CRUD.POLICY] = newPermission.schemaJson[platform][CRUD.POLICY]?.filter((policy) => policy !== 'auth');
              if ((action === CRUD.isAuth) && value) {
                addErrorToast('Please select model actions first.');
              }
            }
          }

          function mapDeviceType() {
            Object.keys(newPermission.schemaJson[platform])?.map((act) => {
              if (isCrud(act)) {
                newPermission.schemaJson[platform][act] = value;
              }
              return act;
            });
            uncheckAuth();
          }

          if (type) {
            if (platform === type) {
              if (action === CRUD.ALL || action === CRUD.ALL_DEVICE) {
                // on mark 'ALL' actions: all actions will be checked/unchecked
                // on mark 'ALL' Devices: all model permission of device will be checked/unchecked
                mapDeviceType();
              } else {
                // other than ALL actions
                if (action === CRUD.POLICY) {
                  newPermission.schemaJson[platform][action] = isEmpty(value?.filter((policy) => props?.policyLists?.find((policyData) => policyData?.fileName === policy))) ? [] : value?.filter((policy) => props?.policyLists?.find((policyData) => policyData?.fileName === policy)); // to remove inactive policies
                } else if (!value && LINKED_CRUD_OPERATION[action]) { // to remove Linked Operations from schemaJson
                  LINKED_CRUD_OPERATION[action]?.forEach((operation) => {
                    newPermission.schemaJson[platform][operation] = value;
                  });
                } else {
                  newPermission.schemaJson[platform][action] = value;
                }
                newPermission.schemaJson[platform].ALL = !!isCheckedAll(newPermission.schemaJson[platform]);
                uncheckAuth();
              }
            }
          } else if (action === CRUD.ALL_MODEL) {
            // on Mark 'ALL' Model: update all model actions
            mapDeviceType();
          }
          return platform;
        });
      }

      if (newPermission._id === permission?._id || action === CRUD.ALL_DEVICE) {
        mapSchemaJson();
        newPermission.isAllModal = isCheckedAllModel(newPermission.schemaJson); // ALL model permission
      }
      return newPermission;
    });
    const checkedAllDevice = isCheckedAllDevice(newPermissions, props?.applicationLoginAccess);
    setDeviceData(checkedAllDevice);
    setPermissions(newPermissions);
  };

  const AllDeviceCheckbox = (options) => {
    const { children, value } = options;
    return (
      <Checkbox
        className="text-center"
        checked={deviceData[value]}
        onChange={(val) => {
          handleChange(val, {
            action: 'ALL_DEVICE',
            type: value,
          });
        }}
      >
        {children}
      </Checkbox>
    );
  };

  return (
    <>
      {
        !isEmpty(permissions)
        && (
          <table className="smallCheckbox modelPermissionTable">
            <tr className="sticky -left-3 z-10 bg-gray-black top-0">
              <td className="sticky -left-3 z-1 bg-gray-black pl-5 pr-10 w-96 modelPermissionLeft">
                <div className="flex justify-between items-center">
                  <div className="">Model list</div>
                  <div />
                </div>
              </td>
              <td className="pb-3">
                <table>
                  <tr>
                    {props?.applicationLoginAccess?.sort()?.map((type) => (
                      <td className="text-left pr-10 permissionTableList" key={type}>
                        <div className="flex justify-between">
                          {capitalize((DEVICE_TYPE_NAME[type?.toUpperCase()] ?? type) ?? '')}
                          <AllDeviceCheckbox value={type}>
                            All
                          </AllDeviceCheckbox>
                        </div>
                      </td>
                    ))}
                  </tr>
                </table>
              </td>
            </tr>
            {sortBy(permissions, ['schemaId.name'])?.map((permission) => (
              <PermissionItem
                handleShow={handleShow}
                title={permission?.schemaId?.name}
                permissionSet={permission?.schemaJson}
                permission={permission}
                policyLists={props?.policyLists}
                onChange={handleChange}
                permissionSettingRef={permissionSettingRef}
                platformTypeRef={platformTypeRef}
                isAnyAction={isAnyAction}
                key={permission?.schemaId?._id}
              />
            ))}
          </table>
        )
      }

      {isOpen && (
        <Setting
          isOpen={isOpen}
          onClose={handleClose}
          onDrawerClose={handleClose}
          permissionData={permissionSettingRef?.current}
          platformType={platformTypeRef?.current}
          policyList={props?.policyLists}
          handleSave={props?.handleSave}
          onChange={handleChange}
        />
      )}
    </>
  );
});
Permission.displayName = 'Permission';
export default Permission;
Permission.propTypes = {
  /**
   * Permission array
   */
  permissions: PropTypes.arrayOf.isRequired,
};
