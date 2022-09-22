import { isEmpty, compact } from 'lodash';
import { QUERY_PARAMETER_SUPPORTED_TYPES } from '../../../constant/applicationConfigConstant';

export const getSelectedPlatformObject = (selectedPlatforms, platformAccess) => {
  // to create selected platform object (used in two factor authentication)
  const output = {};
  selectedPlatforms?.forEach((platform) => { output[platform] = platformAccess?.includes(platform); });
  return output;
};

// to get fields name
export const getFieldName = (mastersList, id) => mastersList?.find((master) => master._id === id)?.customJson?.fieldName;

export const getMediumObject = (selectedMediums, mastersList, updatedData, templatesList, templateType) => {
  // to create selected medium object (used in two factor authentication and reset password link)
  const output = {};
  if (!isEmpty(selectedMediums)) { output.masterIds = selectedMediums; }
  selectedMediums?.forEach((medium) => {
    output[getFieldName(mastersList, medium)] = true;
    output[`${getFieldName(mastersList, medium)}TemplateId`] = updatedData?.[`${templateType}-${medium}`];
    output[`${getFieldName(mastersList, medium)}Template`] = templatesList?.find((template) => template?._id === updatedData?.[`${templateType}-${medium}`])?.name;
  });
  return output;
};

export const getCustomJson = (customJson, updatedData, sub) => {
  // to create dynamic object of input fields' data (used in notification provider and social auth)
  const output = {};
  customJson?.forEach((json) => {
    output[json?.fieldName] = updatedData?.[`${json?.fieldName}-${sub?._id}`] || '';
  });
  return output;
};

export const getSocialAuthData = (socialMastersList, updatedData) => {
  // to create social auth request data (used in social auth)
  const output = [];
  socialMastersList?.forEach((master) => {
    const obj = {};
    obj.typeId = master?._id;
    obj.type = master?.code;
    obj.platform = updatedData?.[`platform-${master?._id}-selection`] ? updatedData?.[`platform-${master?._id}`] : [];
    obj.isChecked = updatedData?.[`platform-${master?._id}-selection`] || false;
    obj.credential = updatedData?.[`platform-${master?._id}-selection`] ? getCustomJson(master?.customJson, updatedData, master) : {};
    output.push(obj);
  });
  return output;
};

export const getServiceProvideData = (mastersList, updatedData) => {
  // to create external service provider request data (used in notification provider)
  const output = [];
  mastersList?.forEach((master) => master?.subMaster?.forEach((sub) => {
    if (sub?._id === updatedData?.[`notification-${sub?.parentCode}`]) {
      const obj = {};
      obj.typeId = sub?.parentId;
      obj.type = sub?.parentCode;
      obj.serviceProviderId = sub?._id;
      obj.serviceProvide = sub?.name;
      obj.customJson = getCustomJson(sub?.customJson, updatedData, sub);
      output.push(obj);
    }
  }));
  return output;
};

// to prepare list of supported data types for Query parameters accroding to selected model
export const prepareQueryParameters = (schemaJSON, ormType) => {
  const result = {};

  if (!isEmpty(schemaJSON)) {
    Object.keys(schemaJSON)?.forEach((key) => {
      if (QUERY_PARAMETER_SUPPORTED_TYPES[ormType]?.includes(schemaJSON[key]?.type)) {
        result[key] = schemaJSON[key];
      }
      if (Array.isArray(schemaJSON[key])) {
        result[key] = prepareQueryParameters(schemaJSON[key][0], ormType);
        return;
      }
      if (compact(Object.values(schemaJSON[key]))?.findIndex((value) => typeof (value) === 'object') > -1) {
        result[key] = prepareQueryParameters(schemaJSON[key], ormType);
      }
    });
  }
  return result;
};
