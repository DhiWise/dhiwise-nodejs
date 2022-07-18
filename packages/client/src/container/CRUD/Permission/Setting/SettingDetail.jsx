import React from 'react';
import {
  cloneDeep, isEmpty, lowerCase,
} from 'lodash';
import { useSelector } from 'react-redux';
import {
  Checkbox, Select, SelectTree, TagGroup,
} from '../../../../components';
import { CRUD } from '../../../../constant/permission';
import { SETTING_ACTION_TYPES, useSettings } from '../PermissionSettingProvider';
import { defaultAttributes } from '../../../../components/SelectTree';
import { ORM_TYPE } from '../../../../constant/Project/applicationStep';
import { getSettingOperationsType } from '../PermissionHelperFunctions';

export const SettingDetail = ({
  policyList, permissionData, platformType, onChange, linkedOperation,
}) => {
  const modelList = useSelector((state) => state.models.modelList);
  const ormType = useSelector((state) => state.projects.applicationDatabase.ormType);
  const [selectedPolicies, setSelectedPolicies] = React.useState({});
  const [selectedAttributes, setSelectedAttributes] = React.useState({});

  const { editSettingData, dispatch } = useSettings();

  React.useEffect(() => {
    const policies = {};
    const attributes = {};
    linkedOperation?.forEach((operationType) => {
      policies[operationType] = editSettingData?.[operationType]?.policy || permissionData?.schemaJson?.[platformType]?.[CRUD.POLICY];
      attributes[operationType] = editSettingData?.[operationType]?.attributes || [];
    });
    setSelectedPolicies(policies);
    setSelectedAttributes(attributes);
  }, [linkedOperation]);

  const handlePolicySelection = (policies, operationType) => {
    const updatedPolicies = cloneDeep(selectedPolicies);
    updatedPolicies[operationType] = policies;
    setSelectedPolicies(updatedPolicies);
    dispatch({
      type: SETTING_ACTION_TYPES.EDIT,
      payload: {
        platformType,
        operation: operationType,
        selected: true,
        policy: policies || [],
        isAuth: permissionData?.schemaJson?.[platformType]?.[CRUD.isAuth],
        attributes: selectedAttributes[operationType],
        model: permissionData?.schemaId?._id,
      },
    });
  };

  const handleAttributeSelection = (allSelectedNode, operationType) => {
    const updatedAttributes = cloneDeep(selectedAttributes);
    updatedAttributes[operationType] = allSelectedNode?.map((node) => node?.fullName);
    setSelectedAttributes(updatedAttributes);
    dispatch({
      type: SETTING_ACTION_TYPES.EDIT,
      payload: {
        platformType,
        operation: operationType,
        selected: true,
        policy: !isEmpty(selectedPolicies[operationType]) ? selectedPolicies[operationType] : permissionData?.schemaJson?.[platformType]?.[CRUD.POLICY],
        isAuth: permissionData?.schemaJson?.[platformType]?.[CRUD.isAuth],
        attributes: allSelectedNode?.map((node) => node?.fullName),
        model: permissionData?.schemaId?._id,
      },
    });
  };

  const handleSelectOperation = (val, operationType, platform) => {
    if (val === false) {
      delete editSettingData[operationType];
      dispatch({ type: SETTING_ACTION_TYPES.MUTATE_EDIT, payload: editSettingData });
    } else {
      dispatch({
        type: SETTING_ACTION_TYPES.EDIT,
        payload: {
          platformType: platform,
          operation: operationType,
          selected: val,
          policy: selectedPolicies[operationType] || permissionData?.schemaJson?.[platformType]?.[CRUD.POLICY],
          isAuth: permissionData?.schemaJson?.[platformType]?.[CRUD.isAuth],
          attributes: selectedAttributes[operationType] || [],
          model: permissionData?.schemaId?._id,
        },
      });
    }
  };

  const handleChange = (val, action, type) => {
    // to update permission Array @val: checkbox value,@action: any from CRUD, @type: device type
    onChange(val, {
      action,
      permission: permissionData,
      type,
    });
  };

  return (
    <>
      {
      linkedOperation?.map((operationType, i) => (
        <>
          <div className={i % 2 === 0 ? '' : 'mt-4 border-t border-gray-200 pt-4'} key={operationType}>
            <Checkbox
              wrapClass="mt-3"
              checked={!!permissionData?.schemaJson?.[platformType]?.[operationType]}
              onChange={(val) => {
                handleSelectOperation(val, operationType, platformType);
                handleChange(val, operationType, platformType);
              }}
            >
              {getSettingOperationsType(operationType)}
            </Checkbox>
            <div className="grid grid-cols-1 gap-5 mt-3">
              <Select
                desc={`Select the middleware you wanted to apply for the ${lowerCase(getSettingOperationsType(operationType))} operation.`}
                label="Middleware"
                defaultValue={selectedPolicies[operationType]}
                value={selectedPolicies[operationType]}
                placeholder="Select middleware"
                options={permissionData?.schemaJson?.[platformType]?.[CRUD.isAuth] ? policyList : policyList?.filter((policy) => policy?.fileName !== 'auth')}
                isMulti
                valueKey="fileName"
                labelKey="fileName"
                onChange={(value) => handlePolicySelection(value, operationType)}
                disabled={!permissionData?.schemaJson?.[platformType]?.[operationType]}
              />
              <div>
                <SelectTree
                  mode="multiSelect"
                  desc={`Select the attribute of your model that you desire to get in ${lowerCase(getSettingOperationsType(operationType))} API response.`}
                  defaultValue={selectedAttributes[operationType]}
                  noDataMessage="No attribute"
                  data={{ ...defaultAttributes[ormType], ...modelList?.find((model) => model?._id === permissionData?.schemaId?._id)?.schemaJson || {} }}
                  disabledKey={['_id']}
                  label="Attribute"
                  placeholder="Select attribute"
                  WrapClassName="selectValue"
                  handleChange={(allSelectedNode) => handleAttributeSelection(allSelectedNode?.allSelectedNode, operationType)}
                  disabled={(!permissionData?.schemaJson?.[platformType]?.[operationType])}
                />
                <TagGroup
                  titleKey="title"
                  TagList={selectedAttributes[operationType]?.map((tag) => ({
                    title: tag,
                    tagVariant: 'secondary',
                    close: true,
                  }))}
                  disabledTag={ormType === ORM_TYPE.MONGOOSE ? [{
                    title: '_id',
                    tagVariant: 'secondary',
                    close: true,
                  }] : []}
                  disabled={!permissionData?.schemaJson?.[platformType]?.[operationType]}
                  onClick={(index) => {
                    selectedAttributes[operationType].splice(ormType === ORM_TYPE.MONGOOSE ? (index - 1) : index, 1);
                    dispatch({
                      type: SETTING_ACTION_TYPES.EDIT,
                      payload: {
                        platformType,
                        operation: operationType,
                        selected: true,
                        policy: !isEmpty(selectedPolicies[operationType]) ? selectedPolicies[operationType] : permissionData?.schemaJson?.[platformType]?.[CRUD.POLICY],
                        isAuth: permissionData?.schemaJson?.[platformType]?.[CRUD.isAuth],
                        attributes: cloneDeep(selectedAttributes[operationType]),
                        model: permissionData?.schemaId?._id,
                      },
                    });
                    setSelectedAttributes(cloneDeep(selectedAttributes));
                  }}
                />
              </div>
            </div>
          </div>
        </>
      ))
    }
    </>
  );
};
