import { isEmpty, toLower } from 'lodash';
import { DEVICE_TYPE_NAME } from '../constant/permission';

export const getApplicationPlatforms = (loginAccess) => {
  const allPlatforms = [];
  loginAccess?.forEach((platform) => {
    allPlatforms.push({ id: platform, name: (!isEmpty(toLower(DEVICE_TYPE_NAME[platform?.toUpperCase()])) ? toLower(DEVICE_TYPE_NAME[platform?.toUpperCase()]) : platform) });
  });
  return allPlatforms;
};
