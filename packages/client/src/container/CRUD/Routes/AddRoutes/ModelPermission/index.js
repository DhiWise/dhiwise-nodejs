import React from 'react';
import { cloneDeep, last, lowerCase } from 'lodash';
import { useSelector } from 'react-redux';
import { useFormContext } from 'react-hook-form';
import { Select, SelectTree, TagGroup } from '../../../../../components';
import { OPERATION_TYPE } from '../../../../../constant/routes';
import { useRoute } from '../../RouteProvider';
import { getPolicies } from '../../../../../api/policy';
import { defaultAttributes } from '../../../../../components/SelectTree';
import { ORM_TYPE } from '../../../../../constant/Project/applicationStep';
import { CRUD_OPERATIONS } from '../../../../../constant/permission';

export const ModelPermission = ({ value: permission = {} }) => {
  const [policyLists, setPolicyLists] = React.useState([]);
  const currentApplicationId = useSelector((state) => state.projects.currentApplicationId);
  const modelList = useSelector((state) => state.models.modelList);
  const ormType = useSelector((state) => state.projects.applicationDatabase.ormType);
  const { selectedModelId, editRouteData } = useRoute();
  const { setValue } = useFormContext();

  function fetchAllPolicies() {
    getPolicies({
      applicationId: currentApplicationId,
    }).then(
      (policyRes) => {
        const policyList = policyRes?.data?.list;
        setPolicyLists(policyList);
      },
    );
  }

  React.useEffect(() => {
    fetchAllPolicies();
  }, []);

  return (
    (
      <div className="grid grid-cols-2 gap-5">
        <Select
          placeholder="Select middleware"
          label="Middleware"
          desc={`Select the middleware you wanted to apply for the ${lowerCase(CRUD_OPERATIONS[OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]])} operation.`}
          value={permission?.additionalJson?.additionalSetting?.[editRouteData?.platform]?.[OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]]?.policy}
          options={policyLists}
          valueKey="fileName"
          labelKey="fileName"
          isMulti
          onChange={(value) => {
            const updatedPermissionData = cloneDeep(permission);
            updatedPermissionData.additionalJson.additionalSetting[editRouteData?.platform][OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]].policy = value;
            setValue('permissionData', updatedPermissionData);
          }}
        />
        <div>
          <SelectTree
            mode="multiSelect"
            placeholder="Select attribute"
            label="Attribute"
            desc={`Select the attribute of your model that you desire to get in ${lowerCase(CRUD_OPERATIONS[OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]])} API response.`}
            defaultValue={permission?.additionalJson?.additionalSetting?.[editRouteData?.platform]?.[OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]]?.attributes}
            noDataMessage="No attribute"
            data={{ ...defaultAttributes[ormType], ...modelList.find((model) => model._id === selectedModelId)?.schemaJson }}
            disabledKey={['_id']}
            WrapClassName="selectValue"
            handleChange={(allSelectedNode) => {
              const updatedAttributes = cloneDeep(permission);
              updatedAttributes.additionalJson.additionalSetting[editRouteData?.platform][OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]].attributes = allSelectedNode?.allSelectedNode?.map((node) => node?.fullName);
              setValue('permissionData', updatedAttributes);
            }}
          />
          <TagGroup
            titleKey="title"
            TagList={permission?.additionalJson?.additionalSetting?.[editRouteData?.platform]?.[OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]]?.attributes?.map((tag) => ({
              title: tag,
              tagVariant: 'secondary',
              close: true,
            }))}
            disabledTag={ormType === ORM_TYPE.MONGOOSE ? [{
              title: '_id',
              tagVariant: 'secondary',
              close: true,
            }] : []}
            onClick={(index) => {
              const updatedAttributes = cloneDeep(permission);
              updatedAttributes?.additionalJson?.additionalSetting?.[editRouteData?.platform]?.[OPERATION_TYPE[editRouteData?.method][last(editRouteData?.route?.split('/'))]]?.attributes?.splice(ormType === ORM_TYPE.MONGOOSE ? (index - 1) : index, 1);
              setValue('permissionData', updatedAttributes);
            }}
          />
        </div>
      </div>
    )
  );
};
