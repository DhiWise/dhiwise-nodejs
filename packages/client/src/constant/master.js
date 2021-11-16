import { Input, Select, Checkbox } from '../components';

export const MASTER_PARENT_CODE = {
  NOTIFICATION: 'NOTIFICATION',
  SOCIAL_AUTH: 'SOCIAL_AUTH',
  ANDROID_SOCIAL_AUTH: 'ANDROID_SOCIAL_AUTH',
};

export const COMPONENT_TYPE = {
  text: Input,
  number: Input.Number,
  select: Select,
  checkbox: Checkbox,
};
